import { useEffect, useMemo, useState } from 'react'

import type { TokenCreateReq } from '@/api/token/types'
import { useCreateToken } from './use-create-token'
import { Network } from '@/enums/contract'
import { useChainsStore } from '@/stores/use-chains-store'
import { deployErr } from '@/errors/deploy'
import { useUserInfo } from '@/hooks/use-user-info'
import { useEvmDeploy } from './use-evm-deploy'
import { useSolDeploy } from './use-sol-deploy'

export type DeployFormParams = Omit<TokenCreateReq, 'factory_address'> & {
  buyAmount: string
}

export const useDeploy = (chainName: string) => {
  const [network, setNetwork] = useState(Network.Svm)
  const { createTokenData, isCreatingToken, createToken } =
    useCreateToken(chainName)
  const { chainsMap } = useChainsStore()
  const { refetchUserInfo } = useUserInfo()

  const onDeployFinally = () => {
    // refetchUserInfo()
  }

  useEffect(() => {
    if (!chainName) return
    const { network_type } = chainsMap[chainName] ?? {}

    setNetwork(network_type!)
  }, [chainName])

  const evmDeploy = useEvmDeploy(chainName, onDeployFinally)
  const solDeploy = useSolDeploy(onDeployFinally)
  // const tvmDeploy = useTvmDeploy()

  const {
    buyAmoutMax,
    deployFee,
    deployHash,
    deployedAddr,
    isSubmitting,
    isConfirming,
    isDeploySuccess,
    isDeployError,
    submitError,
    confirmError,
    resetDeploy,
  } = useMemo(() => {
    return {
      [Network.Evm]: evmDeploy,
      [Network.Svm]: solDeploy,
      [Network.Tvm]: evmDeploy,
    }[network]
  }, [network, evmDeploy, solDeploy]) // TODO: add more deps...

  // console.log('deployedAddr:', deployedAddr) // 4oiw1ZtZkrg3Bbh7tzsi9xfwJpVeQPqAzMj4TVs6NYW1
  const deploy = async (params: DeployFormParams) => {
    // TODO: create token api
    const tokenId = await createToken(params)

    // if (!tokenId) return deployErr.createFailed()

    if (!network) return deployErr.networkNotFound()

    if (network === Network.Evm) {
      return evmDeploy.deploy({ ...params, tokenId: tokenId! })
    }

    if (network === Network.Svm) {
      // Solana
      return solDeploy.deploy({ ...params, tokenId: tokenId! })
    }

    if (network === Network.Tvm) {
      // TON
      // return tvmDeploy.deploy(params)
    }
  }

  return {
    buyAmoutMax,
    deployFee,
    deployHash,
    deployedAddr,
    isSubmitting,
    isConfirming,
    isDeploying: isSubmitting || isConfirming,
    isCreatingToken,
    isDeploySuccess,
    isDeployError,
    submitError,
    confirmError,
    createTokenData,
    deploy,
    resetDeploy,
  }
}
