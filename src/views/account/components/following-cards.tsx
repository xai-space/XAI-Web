import React from 'react'
import { useTranslation } from 'react-i18next'

import { CardType, FollowCard, FollowCardSkeleton } from './follow-card'
import { CustomSuspense } from '@/components/custom-suspense'
import { UserFollow, UserCategory } from '@/api/user/types'
import { useUserFollowingList } from '../hooks/use-user-follwing-list'
import { Button } from '@/components/ui/button'
import { useAccountContext } from '@/contexts/account'

interface Props {
  onCardClick?: () => void
}

export const FollowingCards = ({ onCardClick }: Props) => {
  const { t } = useTranslation()
  const { isAgent } = useAccountContext()
  const {
    agentFollows,
    userFollows,
    clearFollows,
    loading,
    loadingMore,
    ref,
    setFollowType,
    followType,
    setUserFollows,
    setAgentFollows,
  } = useUserFollowingList(isAgent)

  return (
    <CustomSuspense
      className="flex flex-col gap-2"
      isPending={loading}
      fallback={<FollowCardSkeleton />}
      nullback={<p className="text-zinc-500">{t('follow.no-following')}</p>}
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
        userFollows?.length ? (
          userFollows?.map((f, i) => (
            <FollowCard
              followType={followType}
              agentFollows={agentFollows}
              userFollows={userFollows}
              updateUserList={setUserFollows}
              updateAgentList={setAgentFollows}
              cardType={CardType.following}
              card={f}
              key={i}
              onClick={onCardClick}
            />
          ))
        ) : (
          <>{t('follow.no-following')}</>
        )
      ) : undefined}

      {followType === UserCategory.Agent ? (
        agentFollows?.length ? (
          agentFollows?.map((f, i) => (
            <FollowCard
              followType={followType}
              agentFollows={agentFollows}
              userFollows={userFollows}
              updateUserList={setUserFollows}
              updateAgentList={setAgentFollows}
              cardType={CardType.following}
              card={f}
              key={i}
              onClick={onCardClick}
            />
          ))
        ) : (
          <>{t('follow.no-following')}</>
        )
      ) : undefined}
    </CustomSuspense>
  )
}

export default FollowingCards
