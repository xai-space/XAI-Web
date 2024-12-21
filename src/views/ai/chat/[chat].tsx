import { type ReactNode, useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'

import { PrimaryLayout } from '@/components/layouts/primary'
import { Chat } from '../components/chat'
import { aiApi } from '@/api/ai'
import { staticUrl } from '@/config/url'
import { defaultAgentLogo } from '@/config/link'
import { Button } from '@/components/ui/button'

import { useTranslation } from 'react-i18next'
import { useAIAgentStore } from '@/stores/use-chat-store'
import { Routes } from '@/routes'

import { SessionManagement } from '../components/session-management'
import { FiPlus } from 'react-icons/fi'
import { Avatar } from '@/components/ui/avatar'

export const ChatPage = () => {
  const { t } = useTranslation()
  const { push, replace, query } = useRouter()

  const { sessionId, agentInfo, setAgentInfo, setSessionList, setSessionId } =
    useAIAgentStore()

  const ref = useRef<HTMLDivElement>(null)

  const scrollBarToBottom = () => {
    ref.current?.scrollTo({
      top: ref.current.scrollHeight,
    })
  }

  useEffect(() => {
    if (typeof query.id === 'string') {
      aiApi.getAgentInfo(query.id).then(({ data }) => {
        setAgentInfo(data)
      })

      aiApi.getSessionList(query.id).then(({ data }) => {
        setSessionList(data)
        if (query.sid) {
          return setSessionId(query.sid as unknown as string)
        }

        if (data.length) {
          // Zero represents a new session.
          if (query.t != '0') {
            const sid = data[0].session_id
            replace(`${Routes.AIChat}/${query.id}?sid=${sid}`)
            setSessionId(sid)
          }
        }
      })
    }
  }, [query.id, query.sid])

  return (
    <div
      ref={ref}
      className="flex flex-col h-[calc(100vh-32px)] overflow-y-scroll px-4"
    >
      <div className="sticky py-4 top-0 z-50 flex justify-between items-center bg-background">
        <div className="flex items-center mb-4">
          <Avatar
            src={
              agentInfo?.logo
                ? `${staticUrl}${agentInfo?.logo}`
                : defaultAgentLogo
            }
            alt="Logo"
          />
          <span className="ml-2">{agentInfo?.name}</span>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => {
              push(Routes.AIList)
            }}
          >
            {t('agent.list')}
          </Button>
          <SessionManagement />
          <Button
            variant="purple"
            onClick={() => {
              push(Routes.AICreate)
            }}
          >
            {t('create.agent')}
          </Button>
          <Button
            variant="purple"
            onClick={() => {
              replace(`${Routes.AIChat}/${agentInfo?.agent_id}?t=0`)
              setSessionId('')
              setSessionList([])
            }}
          >
            <FiPlus size={18}></FiPlus> {t('new.session')}
          </Button>
        </div>
      </div>
      <Chat scrollBarToBottom={scrollBarToBottom} />
    </div>
  )
}

ChatPage.getLayout = (page: ReactNode) => (
  <PrimaryLayout disablePadding={true}>{page}</PrimaryLayout>
)

export default ChatPage
