import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { useAccountContext } from '@/contexts/account'
import { useClipboard } from '@/hooks/use-clipboard'
import { useUser } from '@/hooks/use-user'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { UserInfoRes, UserUpdateReq } from '@/api/user/types'
import { UseMutateAsyncFunction } from '@tanstack/react-query'
import { ApiResponse } from '@/api/types'
import AccountInfoDesktop from './account-info-desktop'
import { useResponsive } from '@/hooks/use-responsive'
import AccountInfoMoblie from './account-info-mobile'
import { useRequest } from 'ahooks'
import { aiApi } from '@/api/ai'
import { useEffect } from 'react'
export interface AccountInfoProps {
  isOtherUser: boolean
  isFollowing: boolean
  isUnfollowing: boolean
  tokenAddr: string
  isAgent: boolean
  update: UseMutateAsyncFunction<
    ApiResponse<UserInfoRes>,
    Error,
    UserUpdateReq,
    string | number
  >
  follow: UseMutateAsyncFunction<
    ApiResponse<UserInfoRes>,
    Error,
    string,
    string | number
  >
  unfollow: UseMutateAsyncFunction<
    ApiResponse<UserInfoRes>,
    Error,
    string,
    string | number
  >
  refetchUserInfo: VoidFunction
}

export const Profile = () => {
  const { userInfo, isAgent, isOtherUser, refetchUserInfo, refetchFollow } =
    useAccountContext()
  const { isFollowing, isUnfollowing, follow, unfollow, update } = useUser({
    onFollowFinlly: () => {
      refetchUserInfo()
      refetchFollow()
    },
  })
  const { t } = useTranslation()
  const { query } = useRouter()
  const { isPad } = useResponsive()
  const tokenAddr = (query.address || '') as string

  console.log('queryProfile:', query)
  useEffect(() => {
    getAgentProfile()
  }, [query.uid])
  const { data: profileData, runAsync: getAgentProfile } = useRequest(
    () => aiApi.getAgentInfo(query.uid as string),
    {
      manual: true,
      onSuccess: (res) => {
        console.log('getAgentProfile:', res)
        return res.data
      },
    }
  )

  return (
    <div className="flex-1 border border-border rounded-md">
      <div
        className="bg-cover bg-center h-72"
        style={{ backgroundImage: `url(/images/profile-bg.jpg)` }}
      />
      <div className="bg-background px-2 pt-2 relative after:absolute after:w-full after:h-px after:bg-border after:bottom-5 after:left-0">
        {!isPad ? (
          <AccountInfoDesktop
            isAgent={isAgent}
            isOtherUser={isOtherUser}
            isFollowing={isFollowing}
            isUnfollowing={isUnfollowing}
            tokenAddr={tokenAddr}
            update={update}
            follow={follow}
            unfollow={unfollow}
            refetchUserInfo={refetchUserInfo}
          />
        ) : (
          <AccountInfoMoblie
            isAgent={isAgent}
            isOtherUser={isOtherUser}
            isFollowing={isFollowing}
            isUnfollowing={isUnfollowing}
            tokenAddr={tokenAddr}
            update={update}
            follow={follow}
            unfollow={unfollow}
            refetchUserInfo={refetchUserInfo}
          />
        )}
      </div>
      <div className="align-top p-2 relative bottom-[0.65rem]">
        <p className="text-zinc-600">
          {t('bio')}:{' '}
          {userInfo?.description ? userInfo?.description : t('there.noting')}
        </p>
      </div>
    </div>
  )
}

export default Profile

export const HoverCardPop = ({
  children,
  content,
  variant = 'center',
  position = 'bottom',
  className,
}: {
  children: React.ReactNode
  content: string
  variant?: 'start' | 'center' | 'end'
  position?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
}) => (
  <HoverCard>
    <HoverCardTrigger asChild>{children}</HoverCardTrigger>
    <HoverCardContent
      className={cn(
        'p-1 w-32 border-none text-center font-medium text-base',
        className
      )}
      align={variant}
      side={position}
    >
      {content}
    </HoverCardContent>
  </HoverCard>
)
