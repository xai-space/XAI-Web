import { useMemo } from 'react'
import { BigNumber } from 'bignumber.js'
import { Address, formatEther, parseEther, parseEventLogs } from 'viem'
import { useBalance, useReadContract, useWriteContract } from 'wagmi'

import { BI_ZERO } from '@/constants/number'
// import { bcAbiMap } from '@/contract/abi/bonding-curve'
import { CONTRACT_ERR } from '@/errors/contract'
import { useWaitForTx } from '@/hooks/use-wait-for-tx'
import { parseHash } from '@/utils/contract'
import { DeployFormParams } from './use-deploy'
import { useTokenConfig } from '@/hooks/use-token-config'
import { useInvite } from '@/hooks/use-invite'
import { useDynamicContext } from '@dynamic-labs/sdk-react-core'
import { deployEvmAirdropParams } from '@/config/deploy'

interface EvmDeployParams {
  tokenId: string
}

export const useEvmDeploy = (chainName: string, onFinally?: () => void) => {
  const { primaryWallet, network = 0 } = useDynamicContext()
  const { data: { value: balance = BI_ZERO } = {} } = useBalance({
    address: primaryWallet?.address as Address,
  })
  const { configValue, bcAddress, bcVersion } = useTokenConfig(chainName)
  const bcConfig = {
    // abi: bcAbiMap[bcVersion!],
    abi: [],
    address: bcAddress!,
    chainId: Number(network),
  } as const
  const { getReferrals } = useInvite()

  const { data: deployFee = BI_ZERO } = useReadContract({
    ...bcConfig,
    functionName: 'creationFee_',
    query: { enabled: !!bcAddress },
  })
  const { data: maxBuy_ = BI_ZERO } = useReadContract({
    ...bcConfig,
    functionName: 'maxBuy_',
    query: { enabled: !!bcAddress },
  })
  const buyAmoutMax = formatEther(maxBuy_)

  const {
    data: hash,
    isPending: isSubmitting,
    error: submitError,
    writeContract,
    reset: resetDeploy,
  } = useWriteContract({
    mutation: {
      onError: ({ message }) => {
        CONTRACT_ERR.message(message, false)
      },
    },
  })
  const {
    data: { logs } = {},
    error: confirmError,
    isLoading: isConfirming,
    isSuccess: isDeploySuccess,
    isError: isDeployError,
  } = useWaitForTx({ hash, onFinally })

  const deployedAddr = useMemo(() => {
    if (!logs) return
    const [result] = parseEventLogs({
      abi: bcConfig.abi,
      eventName: 'MemeHubDeployToken',
      logs,
    })

    return result.args.token
  }, [logs])

  const checkForDeploy = () => {
    if (BigNumber(balance.toString()).lt(deployFee.toString())) {
      CONTRACT_ERR.balanceInsufficient()
      return false
    }
    if (!bcConfig.address || !bcConfig.abi || bcConfig.chainId <= 0) {
      CONTRACT_ERR.configNotFound('address/abi/chain id')
      return false
    }
    if (!configValue) {
      CONTRACT_ERR.marketParamsNotFound()
      return false
    }

    return true
  }

  const deploy = async ({
    name,
    symbol,
    tokenId,
    buyAmount,
  }: DeployFormParams & EvmDeployParams) => {
    if (!checkForDeploy()) return
    const totalDeployFee = BigNumber(deployFee.toString())
      .plus(parseEther(buyAmount).toString())
      .toFixed()

    const [parent, gparent] = await getReferrals()

    writeContract({
      ...bcConfig,
      functionName: 'createToken',
      args: [
        parseEther(buyAmount),
        [parent as Address, gparent as Address],
        [name, symbol],
        [parseHash(tokenId)],
        deployEvmAirdropParams,
      ],
      value: BigInt(totalDeployFee),
    })
  }

  return {
    buyAmoutMax,
    deployFee: formatEther(deployFee),
    deployHash: hash,
    deployedAddr,
    submitError,
    confirmError,
    isSubmitting,
    isConfirming,
    isDeploySuccess,
    isDeployError,
    deploy,
    resetDeploy,
  }
}
