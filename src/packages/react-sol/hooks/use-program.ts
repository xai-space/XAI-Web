import { useQuery } from '@tanstack/react-query'
import { type Idl, type Address, Program } from '@coral-xyz/anchor'

import { useConnection } from '@solana/wallet-adapter-react'

export interface UseProgramOptions<IDL extends Idl> {
  idl: IDL
  programId: Address
}

export const useProgram = <IDL extends Idl = Idl>({
  idl,
  programId,
}: UseProgramOptions<IDL>) => {
  const { connection } = useConnection()

  const { data: program, ...results } = useQuery({
    queryKey: ['useProgram', programId],
    queryFn: async () =>
      new Program<IDL>(idl, programId, {
        connection,
      }),
    enabled: !!connection,
  })

  return {
    program,
    ...results,
  }
}
