import { create } from 'zustand'

import type { UserInfoRes } from '@/api/user/types'
import { AgentInfoResDataBase } from '@/api/ai/type'

interface UserStore {
  userInfo: UserInfoRes | null
  oldUserInfo: UserInfoRes | null
  otherUserInfo: UserInfoRes | null

  agentInfo: AgentInfoResDataBase | null

  /** Is also `userInfo` */

  setUserInfo: (userInfo: UserStore['userInfo']) => void
  setOtherUserInfo: (userInfo: UserStore['otherUserInfo']) => void
  setAgentInfo: (agentInfo: UserStore['agentInfo']) => void
}

export const useUserStore = create<UserStore>((set, get) => ({
  userInfo: null,
  oldUserInfo: null,
  otherUserInfo: null,
  agentInfo: null,
  setUserInfo: (userInfo) => set({ userInfo, oldUserInfo: get().userInfo }),
  setOtherUserInfo: (userInfo) => set({ otherUserInfo: userInfo }),
  setAgentInfo: (agentInfo) => set({ agentInfo }),
}))
