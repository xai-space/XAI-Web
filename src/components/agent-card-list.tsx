import { CardContent } from './ui/card'

import { AgentInfoResDataBase, AgentListReq } from '@/api/ai/type'
import { Routes } from '@/routes'

import { useInfiniteScroll } from 'ahooks'
import { Card } from './ui/card'
import { useEffect, useState } from 'react'
import { defaultAgentLogo } from '@/config/link'
import { aiApi } from '@/api/ai'
import { staticUrl } from '@/config/url'
import { cn } from '@/lib/utils'
import { FaRegEdit } from 'react-icons/fa'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { useUserStore } from '@/stores/use-user-store'
import { ListLoading } from './loading'
import { AgentDeleteDialog } from '@/views/ai/components/agent-delete-dialog'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import { useAIAgentStore } from '@/stores/use-chat-store'

interface Result {
  list: AgentInfoResDataBase[]
  noMore: boolean
}

interface AgentCardListProps {
  isAll: boolean
  isOtherUser?: boolean
}

export const AgentCardList = ({
  isAll,
  isOtherUser = false,
}: AgentCardListProps) => {
  const { t } = useTranslation()
  const { userInfo, otherUserInfo } = useUserStore()
  const [delAgent, setDelAgent] = useState<AgentInfoResDataBase | undefined>(
    undefined
  )

  const { setAgentInfo } = useAIAgentStore()
  const { push } = useRouter()

  const getLoadMoreList = async (s: Result | undefined): Promise<Result> => {
    let start = Math.floor((s?.list.length || 0) / 20) + 1
    const bodyData: AgentListReq = {
      page: start,
      limit: 20,
    }

    const userId = isOtherUser ? otherUserInfo?.user_id : userInfo?.user_id

    if (!isAll && userId) {
      bodyData.user_id = userId
    }

    const { data } = await aiApi.getAgentList(bodyData)

    return {
      list: data.list,
      noMore: data.list.length !== 20,
    }
  }

  const { data, loading, loadingMore, reload, mutate } =
    useInfiniteScroll<Result>(getLoadMoreList, {
      target: document,
      isNoMore: (d) => d?.noMore === true,
    })

  const reloadList = () => {
    mutate({
      list: [],
      noMore: true,
    })
    reload()
  }

  useEffect(() => {
    reloadList()
  }, [isAll])

  return (
    <>
      <div className="grid grid-cols-2 gap-3 mt-4 w-full max-sm:grid-cols-1">
        {data?.list.map((agent) => {
          return (
            <Card
              key={agent.agent_id}
              onClick={() => {
                push(`${Routes.AIChat}/${agent.agent_id}`)
              }}
            >
              <CardContent className="p-3">
                <div className="flex">
                  <img
                    src={
                      agent.logo
                        ? `${staticUrl}${agent.logo}`
                        : defaultAgentLogo
                    }
                    alt="Logo"
                    width={72}
                    height={72}
                    className="w-[72px] h-[72px] rounded-md object-cover"
                  />
                  <div className="flex-1 flex flex-col justify-between ml-2">
                    <div
                      className={cn(
                        !isAll
                          ? 'flex justify-between items-center w-full'
                          : null
                      )}
                    >
                      <span className="line-clamp-1 break-all">
                        {agent.name}
                      </span>
                      {!isAll ? (
                        <div className="flex items-center space-x-1">
                          <div
                            className="ml-2 flex items-center space-x-1 text-nowrap text-sm rounded-full px-2 hover:opacity-50 transition-all"
                            onClick={(e) => {
                              e.stopPropagation()
                              e.preventDefault()
                              setAgentInfo(agent)
                              push(`${Routes.AIEdit}/${agent.agent_id}`)
                            }}
                          >
                            {/* <span className="text-purple-500">
                              {t('edit.agent')}
                            </span> */}
                            <FaRegEdit
                              className="text-purple-500"
                              size={20}
                            ></FaRegEdit>
                          </div>

                          <div>
                            <RiDeleteBin6Line
                              className="text-red-500  hover:opacity-50 "
                              size={20}
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                setDelAgent(agent)
                              }}
                            ></RiDeleteBin6Line>
                          </div>
                        </div>
                      ) : null}
                    </div>
                    <div
                      className={cn(
                        'line-clamp-1 break-all text-sm text-gray-500',
                        '-translate-y-[2px]'
                      )}
                    >
                      {agent.description}
                    </div>
                    <div className="text-gray-400 text-sm">
                      {/* @{agent.id} */}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {loading || loadingMore ? (
        <ListLoading />
      ) : data?.noMore && !data.list.length ? (
        <span>{!isOtherUser ? t('no.have.agent') : t('other.no.agent')}</span>
      ) : null}

      <AgentDeleteDialog
        delAgent={delAgent}
        setDelAgent={setDelAgent}
        onDeleted={reloadList}
      />
    </>
  )
}
