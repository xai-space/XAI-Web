import { useEffect } from 'react'
import { Router } from 'next/router'
import { toast } from 'sonner'
import { type Hash } from 'viem'

import { useWaitForTx } from '@/hooks/use-wait-for-tx'
import { SlippageError } from './slippage-error'
import { TxLoading } from './tx-loading'
import { TxSuccess } from './tx-success'
import { useTokenContext } from '@/contexts/token'
import { Network } from '@/enums/contract'
import { useWaitTransactionConfirm } from '@/packages/react-sol'

export interface TxStatusProps {
  hash: string
  tokenLabel: string
  reserveLabel: string
  reward: string
  txUrl: string
  isBuy: boolean
  network: Network
  getToastId: () => string | number
}

export const TxStatus = (props: TxStatusProps) => {
  const getwaitForTx = () => {
    if (props.network === Network.Svm)
      return useWaitTransactionConfirm({
        signature: props.hash,
      })

    return useWaitForTx({ hash: props.hash as Hash })
  }

  const { isLoading, isError, isSuccess } = getwaitForTx()

  useEffect(() => {
    const close = () => toast.dismiss(props.getToastId())

    Router.events.on('routeChangeStart', close)
    return () => {
      Router.events.off('routeChangeStart', close)
    }
  }, [])

  return (
    <>
      {isLoading && <TxLoading {...props} />}
      {isError && <SlippageError {...props} />}
      {isSuccess && <TxSuccess {...props} />}
    </>
  )
}
