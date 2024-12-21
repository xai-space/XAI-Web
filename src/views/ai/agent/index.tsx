import { aiApi } from '@/api/ai'
import { AgentInfoResDataBase, AgentListReq } from '@/api/ai/type'
import PrimaryLayout from '@/components/layouts/primary'
import { ListLoading } from '@/components/loading'
import { Button } from '@/components/ui/button'
import { Routes } from '@/routes'
import { useAIAgentStore } from '@/stores/use-chat-store'
import { useInfiniteScroll } from 'ahooks'
import { useRouter } from 'next/router'
import { ReactNode, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AgentDeleteDialog } from '../components/agent-delete-dialog'
import { useUserStore } from '@/stores/use-user-store'
import { toast } from 'sonner'
import { DynamicConnectButton } from '@dynamic-labs/sdk-react-core'
import { AgentCardList } from '@/components/agent-card-list'

const AgentList = () => {
  const { t } = useTranslation()
  const { query, push, replace } = useRouter()
  const { setAgentInfo } = useAIAgentStore()
  const { userInfo } = useUserStore()

  const isAll = !query.type || query.type === '1'

  return (
    <div className="max-w-[800px] mx-auto pt-0 ">
      <div className="flex justify-between items-center text-xl">
        {t('agent.list')}
        <div className="flex space-x-4">
          <Button
            onClick={() => {
              push(Routes.Create)
            }}
            variant="purple"
          >
            {t('create.token')}
          </Button>
          <Button
            onClick={() => {
              setAgentInfo(undefined)
              push(Routes.AICreate)
            }}
          >
            {t('create.agent')}
          </Button>
        </div>
      </div>

      {userInfo?.user_id && (
        <div className="flex mt-1">
          <Button
            className="!px-8"
            variant={isAll ? 'purple' : 'secondary'}
            onClick={() => {
              replace(`${Routes.AIList}?type=1`)
            }}
          >
            {t('all')}
          </Button>
          <Button
            className="ml-5 !px-8"
            variant={!isAll ? 'purple' : 'secondary'}
            onClick={(e) => {
              if (!userInfo?.user_id) {
                toast.error(t('no.login'))
                return
              }

              e.preventDefault()
              e.stopPropagation()
              replace(`${Routes.AIList}?type=2`)
            }}
          >
            {t('my')}
          </Button>
        </div>
      )}

      <AgentCardList isAll={isAll} />
    </div>
  )
}

AgentList.getLayout = (page: ReactNode) => <PrimaryLayout>{page}</PrimaryLayout>

export default AgentList
