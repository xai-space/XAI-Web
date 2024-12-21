import { web3 } from '@coral-xyz/anchor'
import BigNumber from 'bignumber.js'
import { v4 as uuidV4 } from 'uuid'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { useDynamicContext } from '@dynamic-labs/sdk-react-core'

import { CONTRACT_ERR } from '@/errors/contract'
import {
  useProgram,
  useVersionedTransaction,
  useWaitTransactionConfirm,
} from '@/packages/react-sol'
import { programIds } from '@/program'
import { IDL } from '@/program/token/idl'
import { DeployFormParams } from './use-deploy'
import { getCreateTokenAccount } from '@/program/token/account'
import { useDynamicWallet } from '@/hooks/dynamic/use-dynamic-wallet'
import { useDynamicBalance } from '@/hooks/dynamic/use-balance'
import { useSvmTrade } from '@/views/token/hooks/svm/use-svm-trade'

const deployFee = 0.05

interface DeployParams extends DeployFormParams {
  tokenId: string
}

export const useSolDeploy = (onFinally?: VoidFunction) => {
  const { primaryWallet } = useDynamicContext()
  const { chainsInfo } = useDynamicWallet()
  const { primaryBalance: balance } = useDynamicBalance()
  const { send } = useVersionedTransaction()
  const [deployedAddr, setDeployedAddr] = useState('')
  const { getBuyInstructions } = useSvmTrade()
  const { program, error } = useProgram({
    idl: IDL,
    programId: programIds.programId,
  })

  const checkForDeploy = () => {
    if (BigNumber(balance?.toString() || 0).lt(deployFee.toString())) {
      CONTRACT_ERR.balanceInsufficient()
      return false
    }
    if (!program?.account || !program.idl) {
      CONTRACT_ERR.configNotFound('address/abi/chain id')
      return false
    }

    return true
  }

  // Send TX
  const {
    data: signature,
    isPending: isSubmitting,
    error: submitError,
    mutateAsync: deploy,
    reset: resetDeploy,
  } = useMutation({
    mutationKey: ['deploy_token'],
    mutationFn: async ({ name, buyAmount, symbol, tokenId }: DeployParams) => {
      if (!checkForDeploy()) return
      if (!program) throw error

      let identifier = tokenId
      identifier = identifier.replace(/-/g, '')

      const metadata = {
        name,
        symbol,
        // TODO: wait api
        uri: 'https://5vfxc4tr6xoy23qefqbj4qx2adzkzapneebanhcalf7myvn5gzja.arweave.net/7UtxcnH13Y1uBCwCnkL6APKsge0hAgacQFl-zFW9NlI',
        decimals: chainsInfo?.master_symbol,
      }

      const createTokenCtx = getCreateTokenAccount(
        new web3.PublicKey(primaryWallet!.address),
        identifier
      )

      setDeployedAddr(createTokenCtx.mint.toBase58())

      // Buy token immediately
      const buyIxs =
        buyAmount !== '0'
          ? await getBuyInstructions(
            buyAmount,
            '5',
            createTokenCtx.mint.toBase58()
          )
          : []

      const ixs = await Promise.all([
        program.methods
          .initCreateTokenAccount(metadata, identifier)
          .accounts(createTokenCtx)
          .instruction(),
        program.methods
          .createToken(metadata, identifier)
          .accounts(createTokenCtx)
          .instruction(),
        ...buyIxs,
      ])

      return send(ixs)
    },
    onError: ({ message }) => {
      CONTRACT_ERR.message(message, false)
    },
  })

  // Confirm TX
  const {
    isLoading: isConfirming,
    error: confirmError,
    isSuccess: isDeploySuccess,
    isError: isDeployError,
  } = useWaitTransactionConfirm({
    signature: signature,
    onFinally,
  })

  return {
    buyAmoutMax: '5',
    deployFee: deployFee,
    deployHash: signature,
    isSubmitting,
    isConfirming,
    deployedAddr,
    submitError,
    confirmError,
    isDeploySuccess,
    isDeployError,
    deploy,
    resetDeploy,
  }
}
