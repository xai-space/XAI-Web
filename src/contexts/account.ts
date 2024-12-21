import { createContext, useContext } from 'react'

import type { UserFollow, UserFollowersRes, UserInfoRes } from '@/api/user/types'
import { CONTEXT_ERR } from '@/errors/context'

interface Value {
  userInfo: UserInfoRes | null
  isPending: boolean
  isOtherUser: boolean
  isAgent: boolean
  refetchUserInfo: VoidFunction
  followers?: UserFollowersRes
  followingResults: ReturnType<any>
  refetchFollow: () => void
}

const AccountContext = createContext<Value | null>(null)

export const AccountProvider = AccountContext.Provider

export const useAccountContext = () => {
  const context = useContext(AccountContext)
  if (!context) {
    throw CONTEXT_ERR.notFound('AccountProvider')
  }

  return context
}
