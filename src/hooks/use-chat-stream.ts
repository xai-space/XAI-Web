import { AgentSessionsHistoryMemoryRunsItem } from "@/api/ai/type"
import { apiUrl } from "@/config/url"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useSessionHistory } from "./use-session-history"
import { fetchEventSource } from "@microsoft/fetch-event-source"
import { useAIAgentStore } from "@/stores/use-chat-store"
import { defaultUserId } from "@/config/base"
import { aiApi } from "@/api/ai"
import { Routes } from "@/routes"
import { dynamicToken } from "@/config/localstorage"

interface EventData {
    content: string,
    content_type: string
    run_id: string
    agent_id: string
    session_id: string
}

const ctrl = new AbortController();


export const useChatStream = () => {
    const { query, push } = useRouter()

    const [loading, setLoading] = useState(false)
    const [isReplying, setIsReplying] = useState(false)
    const [sessions, setSessions] = useState<AgentSessionsHistoryMemoryRunsItem[]>([])

    const { agentInfo, sessionId, setSessionList, setSessionId } = useAIAgentStore()

    const sessionHistory = useSessionHistory()

    const sendQuestion = (question: string) => {
        let isEnd = false
        setIsReplying(true)
        setLoading(true)
        const runId = Math.random().toString()
        const chunk = {
            message: {
                content: question,
                created_at: Math.floor(Date.now() / 1000),
                role: 'user',
                metrics: undefined,
            },
            response: {
                "event": "RunResponse",
                "model": "gpt-4o",
                "run_id": runId,
                "content": "",
                "agent_id": "",
                "created_at": 1733289768,
                "session_id": "",
                "content_type": "str"
            }
        }

        const newSessions = sessions.concat([chunk])
        setSessions(newSessions)

        fetchEventSource(apiUrl.xai + '/agent/v1/playground/agent/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem(dynamicToken)?.slice(1, -1)}`
            },
            body: JSON.stringify({
                "agent_id": agentInfo?.agent_id,
                "message": question,
                "id": defaultUserId,
                "session_id": query.sid,
                "stream": true
            }),
            signal: ctrl.signal,
            onmessage(event) {
                const data = JSON.parse(event.data) as EventData

                if (isEnd) return;
                if (data.content === 'Run started') return
                if (data.content === 'Updating memory') return isEnd = true

                const newSessions2 = [...newSessions];
                const index = newSessions2.findIndex(s => s.response.run_id === chunk.response.run_id);
                if (index !== -1) {
                    newSessions2[index].response.content += data.content;
                }
                setSessions(newSessions2);
                setLoading(false)
            },
            onclose() {
                setIsReplying(false)
                setLoading(false)

                aiApi.getSessionList(agentInfo!.agent_id).then(({ data }) => {
                    setSessionList(data)

                    if (data.length) {
                        const sid = data[0].session_id
                        setSessionId(sid)
                        push(`${Routes.AIChat}/${agentInfo?.agent_id}?sid=${sid}`)
                    }
                })
            }
        })
    }

    useEffect(() => {
        const getHistory = async () => {
            if (typeof query.id !== 'string' || typeof query.sid !== 'string') return
            const { data } = await sessionHistory.mutateAsync({
                data: {
                    agent_id: query.id,
                },
                session_id: query.sid!,
            })
            setSessions(data.memory.runs)
        }

        if (query.sid) getHistory()

    }, [query.sid, query.id])

    useEffect(() => {
        if (query.t === '0') setSessions([])
    }, [query.t])

    return {
        isReplying,
        sessionId,
        loading,
        sessions,
        sendQuestion
    }
}
