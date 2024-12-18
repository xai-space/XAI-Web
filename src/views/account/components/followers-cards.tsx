import React from 'react'
import { useTranslation } from 'react-i18next'

import { CardType, FollowCard, FollowCardSkeleton } from './follow-card'
import { CustomSuspense } from '@/components/custom-suspense'
import { UserCategory, UserListRes, UserListType } from '@/api/user/types'
import { useUserFollowingList } from '../hooks/use-user-follwing-list'
import { Button } from '@/components/ui/button'
import { useUserFollowerList } from '../hooks/use-user-follwer-list'

interface Props {
  onCardClick?: () => void
}

export const FollowersCards = ({ onCardClick }: Props) => {
  const { t } = useTranslation()
  const { agentFollowers, userFollowers, loading, followType, setFollowType } =
    useUserFollowerList()

  return (
    <CustomSuspense
      className="flex flex-col gap-2"
      isPending={loading}
      fallback={<FollowCardSkeleton />}
      nullback={<p className="text-zinc-500">{t('follow.no-followers')}</p>}
    >
      <div className="flex gap-2 mb-4">
        <Button
          variant={UserCategory.User === followType ? 'purple' : 'outline'}
          size="sm"
          onClick={() => setFollowType(UserCategory.User)}
        >
          {t('user')}
        </Button>
        <Button
          variant={UserCategory.Agent === followType ? 'purple' : 'outline'}
          size="sm"
          onClick={() => setFollowType(UserCategory.Agent)}
        >
          {t('agent')}
        </Button>
      </div>

      {followType === UserCategory.User ? (
        userFollowers?.length ? (
          userFollowers?.map((f, i) => (
            <FollowCard
              cardType={CardType.follower}
              card={f}
              key={i}
              onClick={onCardClick}
            />
          ))
        ) : (
          <>{t('follow.no-followers')}</>
        )
      ) : undefined}

      {followType === UserCategory.Agent ? (
        agentFollowers?.length ? (
          agentFollowers?.map((f, i) => (
            <FollowCard
              cardType={CardType.follower}
              card={f}
              key={i}
              onClick={onCardClick}
            />
          ))
        ) : (
          <>{t('follow.no-followers')}</>
        )
      ) : undefined}
    </CustomSuspense>
  )
}

export default FollowersCards
