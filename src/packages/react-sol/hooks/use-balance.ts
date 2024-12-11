import { useQuery } from '@tanstack/react-query'
import { useConnection } from '@solana/wallet-adapter-react'
import { web3 } from '@coral-xyz/anchor'

import { formatSol } from '../lib/utils'
import type { WithQueryOptions } from '../types/query'

interface UseBalanceOptions extends WithQueryOptions<number> {
  publicKey: web3.PublicKey | null
}

export const useBalance = ({
  publicKey,
  query: { enabled = true, ...query } = {},
}: UseBalanceOptions) => {
  const { connection } = useConnection()

  const { data: balance, ...results } = useQuery({
    queryKey: ['useBalance', publicKey?.toString()],
    queryFn: () => connection.getBalance(publicKey!),
    enabled: !!publicKey && enabled,
    ...query,
  })

  return {
    ...results,
    balance,
    balanceSol: balance ? formatSol(balance) : undefined,
  }
}
