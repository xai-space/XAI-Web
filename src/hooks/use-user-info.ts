import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useDisconnect } from 'wagmi'

import { userApi } from '@/api/user'
import { useUserStore } from '@/stores/use-user-store'
import { dynamicToken } from '@/config/localstorage'
import { useDynamicContext, useIsLoggedIn } from '@dynamic-labs/sdk-react-core'
import { useRouter } from 'next/router'
import { Routes } from '@/routes'
import { UserCategory } from '@/api/user/types'
import { aiApi } from '@/api/ai'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
// import { useSignLogin } from './use-sign-login'

interface RefetchUserInfoProps {
  userId: string
  isOther: boolean
}

export const useUserInfo = () => {
  const { userInfo, otherUserInfo, agentInfo, setUserInfo, setOtherUserInfo, setAgentInfo } = useUserStore()
  const router = useRouter()

  const { t } = useTranslation()

  const isLoggedIn = useIsLoggedIn()
  const { user } = useDynamicContext()


  const [isFetchingUserInfo, setIsFetchingUserInfo] = useState(false)
  const [isFetchingAgentInfo, setIsFetchingAgentInfo] = useState(false)

  const refetchUserInfo = async ({
    userId,
    isOther,
  }: RefetchUserInfoProps) => {
    setIsFetchingUserInfo(true)
    try {
      const res = await userApi.getInfo(userId)
      if (isOther) {
        setOtherUserInfo(res.data)
      } else {
        setUserInfo(res.data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsFetchingUserInfo(false)
    }
  }

  const refetchAgentInfo = async (agentId: string) => {
    setIsFetchingAgentInfo(true)
    try {
      const res = await aiApi.getAgentInfo(agentId)
      setAgentInfo(res.data)
    } catch (e) {
      console.error(e)
    } finally {
      setIsFetchingAgentInfo(false)
    }
  }

  useEffect(() => {
    console.log('isLoggedIn refetchUserInfo')
    if (isLoggedIn && !isFetchingUserInfo && !userInfo?.user_id && user?.userId) {
      refetchUserInfo({ userId: user.userId, isOther: false })
      return
    }

    if (!isLoggedIn && userInfo?.user_id) {
      setUserInfo(null)
      router.push('/')
    }
  }, [isLoggedIn, user])

  useEffect(() => {
    const userId = router.query.uid
    const type = router.query.t

    if (type === UserCategory.Agent) return
    if (!userId) return

    if (router.pathname.startsWith(Routes.Account) && userId !== otherUserInfo?.user_id) {
      refetchUserInfo({
        userId: userId as string,
        isOther: true,
      })
    }

  }, [router.query.uid])


  useEffect(() => {
    const agentId = router.query.uid
    const type = router.query.t
    if (type && type === UserCategory.Agent && router.pathname.startsWith(Routes.Account)) {
      refetchAgentInfo(agentId as string)
    }

  }, [router.query.uid])


  // useEffect(() => {
  //   if (!userInfo?.user_id) {
  //     router.push('/')
  //     toast.error(t('no.login'))
  //   }
  // }, [userInfo])

  return {
    userInfo: userInfo,
    otherUserInfo,
    // otherUserInfo: otherUserInfo?.data,
    isFetchingUserInfo,
    // isFetchingOtherUserInfo,
    refetchUserInfo,
    // refetchOtherUserInfo,
    agentInfo,
    isFetchingAgentInfo,
    refetchAgentInfo,
  }
}
