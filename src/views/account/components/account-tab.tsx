import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TokenHeldCards } from './token-held-cards'
import { MentionCards } from './mention-cards'
import { CommentCards } from '@/components/comment-cards'
import { TokenCards } from '@/components/token-cards'
import { useUserList } from '../hooks/use-user-list'
import { UserCategory, UserListType } from '@/api/user/types'
import { Routes } from '@/routes'
import { useAccountContext } from '@/contexts/account'
import { cn } from '@/lib/utils'
import { joinPaths } from '@/utils'
import { PostFeed } from '@/components/post-feed'
import { AgentCardList } from '@/components/agent-card-list'

export const AccountTab = () => {
  const { t } = useTranslation()
  const { isOtherUser } = useAccountContext()
  const [isShowBorder, setIsShowBorder] = useState(true)
  const { query, ...router } = useRouter()

  const tab = String(query.tab || UserListType.Agent)
  // const myAccountTabs = [
  //   {
  //     label: t('comments'),
  //     value: UserListType.Comments,
  //   },
  //   {
  //     label: t('mentions'),
  //     value: UserListType.Mentions,
  //   },
  // ]

  const tabs = [
    // {
    //   label: t('token.created'),
    //   value: UserListType.CoinsCreated,
    // },
    // {
    //   label: t('token.held'),
    //   value: UserListType.CoinsHeld,
    // },
    {
      label: t('agent.list'),
      value: UserListType.Agent,
    },
    {
      label: t('published.posts'),
      value: UserListType.PublishedPosts,
    },
    // {
    //   label: t('published.comments'),
    //   value: UserListType.PublishedComments,
    // },
    // ...(isOtherUser ? [] : myAccountTabs),
  ]

  // const {
  //   tokenHeld,
  //   comments,
  //   mentions,
  //   isLoading,
  //   isFetching,
  //   // fetchNextPage,

  //   myTokens,
  //   myTokenTotal,
  //   isLoadingMyTokens,
  //   isFetchingMyTokens,
  //   fetchNextMyTokens,
  // } = useUserList(Number(tab), isOtherUser)

  return (
    <Tabs
      className="w-full mt-0 max-sm:mt-0 max-lg:px-3"
      value={tab}
      onValueChange={(value) => {
        if (!query.uid) return
        router.push(
          {
            pathname: joinPaths(Routes.Account, query.uid as string),
            query: { tab: value, t: query.t },
          },
          undefined,
          { shallow: true }
        )
      }}
    >
      <TabsList
        className={cn(
          'h-12 mb-2 max-sm:w-full max-sm:h-10 max-sm:mb-0',
          'border-none rounded-none text-base select-none'
        )}
      >
        {tabs.map((t) => (
          <TabsTrigger
            className={cn(
              'h-full w-full max-sm:px-2 max-sm:text-xs',
              ' data-[state=active]:text-white data-[state=active]:bg-background',
              'data-[state=active]:hover:bg-transparent hover:bg-transparent relative',
              'after:absolute hover:after:w-full after:h-[2px] after:bg-purple-500 after:bottom-0 after:left-0 after:hover:animate-left-to-right',
              isShowBorder &&
                'data-[state=active]:after:absolute data-[state=active]:after:animate-left-to-right data-[state=active]:after:w-full'
            )}
            key={t.value}
            value={t.value.toString()}
            onMouseEnter={() => setIsShowBorder(false)}
            onMouseLeave={() => setIsShowBorder(true)}
          >
            {t.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {/* Token created */}
      {/* <TabsContent value={UserListType.CoinsCreated.toString()}>
        <TokenCards
          className="md:grid-cols-2 xl:grid-cols-3"
          cards={myTokens}
          total={myTokenTotal}
          isLoading={isLoadingMyTokens}
          isPending={isFetchingMyTokens}
          onFetchNext={fetchNextMyTokens}
          showSearch={false}
        />
      </TabsContent> */}

      {/* Token held */}
      {/* <TabsContent value={UserListType.CoinsHeld.toString()}>
        <TokenHeldCards
          cards={tokenHeld.list}
          total={tokenHeld.total}
          isLoading={isLoading}
          isPending={isFetching}
          onFetchNext={fetchNextPage}
        />
      </TabsContent> */}

      {/* My Agent */}
      <TabsContent value={UserListType.Agent.toString()}>
        <AgentCardList isAll={false} />
      </TabsContent>

      {/* Published Posts */}
      <TabsContent value={UserListType.PublishedPosts.toString()}>
        <PostFeed className="mx-0 !w-full max-w-full" isMy={true} />
      </TabsContent>

      {/* Only self can see. */}
      {/* {!isOtherUser && (
        <>
          <TabsContent value={UserListType.Comments.toString()}>
            <CommentCards
              disableToProfile
              readonly
              cards={comments.list}
              total={comments.total}
              isLoading={isLoading}
              isPending={isFetching}
              onFetchNext={fetchNextPage}
            />
          </TabsContent>
          <TabsContent value={UserListType.Mentions.toString()}>
            <MentionCards
              cards={mentions.list}
              total={mentions.total}
              isLoading={isLoading}
              isPending={isFetching}
              onFetchNext={fetchNextPage}
            />
          </TabsContent>
        </>
      )} */}
    </Tabs>
  )
}

export default AccountTab
