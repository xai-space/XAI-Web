import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FollowersCards } from './followers-cards'
import { FollowingCards } from './following-cards'
import { UserListType } from '@/api/user/types'
import { useAccountContext } from '@/contexts/account'
import { useRef } from 'react'
import { Root as VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useUserStore } from '@/stores/use-user-store'

export const FollowDesktop = () => {
  const { t } = useTranslation()
  const [tab, setTab] = useState(UserListType.Following)
  const { isOtherUser, isAgent, followers, followingResults, refetchFollow } =
    useAccountContext()
  const { userInfo, otherUserInfo } = useUserStore()
  // const {
  //   agent,
  //   user,
  //   // followers,
  //   // isLoading: isLoadingFollowers,
  //   // isFetching: isFetchingFollowers,
  // } = followersResults

  const {
    following,
    isLoading: isLoadingFollowing,
    isFetching: isFetchingFollowing,
  } = followingResults
  const closeRef = useRef<HTMLButtonElement>(null)
  const isFollowers = tab === UserListType.Followers

  return (
    <Dialog>
      <div
        className="flex items-center justify-start"
        style={{ margin: '0 10px 10px 0px' }}
      >
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            shadow="none"
            onClick={() => setTab(UserListType.Followers)}
            className="shadow-none pl-0 !border-none"
          >
            <span className="space-x-1 text-base">
              <span className="font-bold">
                {otherUserInfo?.follower_count ?? 0}
              </span>
              <span className="text-blue-600">{t('followers')}</span>
            </span>
          </Button>
        </DialogTrigger>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setTab(UserListType.Following)}
            shadow="none"
            className="shadow-none !border-none"
          >
            <span className="space-x-1 text-base">
              <span className="font-bold ">
                {otherUserInfo?.follow_count ?? 0}
              </span>
              <span className="text-blue-600">{t('following')}</span>
            </span>
          </Button>
        </DialogTrigger>
      </div>

      <DialogContent className="p-4">
        <VisuallyHidden>
          <DialogClose ref={closeRef} />
        </VisuallyHidden>
        <DialogHeader>
          <DialogTitle>
            {isFollowers
              ? !isOtherUser
                ? t('followers.my')
                : t('followers')
              : !isOtherUser
              ? t('following.my')
              : t('following')}
          </DialogTitle>
        </DialogHeader>
        {/* <FollowersCards
          // total={following.total}
          // isLoading={isLoadingFollowers}
          // isPending={isFetchingFollowers}
          onCardClick={() => closeRef.current?.click()}
        /> */}
        {isFollowers ? (
          <FollowersCards onCardClick={() => closeRef.current?.click()} />
        ) : (
          <FollowingCards onCardClick={() => closeRef.current?.click()} />
        )}
      </DialogContent>
    </Dialog>
  )
}

export default FollowDesktop
