import { aiApi } from '@/api/ai'
import { AgentInfoResDataBase } from '@/api/ai/type'
import {
  BaseDeleteDialog,
  DeleteDialogType,
} from '@/components/base-delete-dialog'
import { useAIAgentStore } from '@/stores/use-chat-store'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

interface Props {
  delAgent?: AgentInfoResDataBase
  setDelAgent: (session?: AgentInfoResDataBase) => void
  onDeleted: () => void
}
export const AgentDeleteDialog = ({
  setDelAgent,
  onDeleted,
  delAgent,
}: Props) => {
  const { t } = useTranslation()
  const { agentInfo, setAgentInfo } = useAIAgentStore()

  const [loading, setLoading] = useState(false)

  const onDelete = async () => {
    try {
      setLoading(true)
      const { code, message } = await aiApi.deleteAgent(delAgent!.agent_id)

      if (code == 200) {
        onDeleted()
        setDelAgent(undefined)
        if (agentInfo?.agent_id === delAgent?.agent_id) {
          setAgentInfo(undefined)
        }
        return toast.success(t('delete.successful'))
      }

      toast.error(message)
    } catch {
    } finally {
      setLoading(false)
    }
  }

  return (
    <BaseDeleteDialog
      type={DeleteDialogType.Agent}
      show={!!delAgent}
      loading={loading}
      onDelete={onDelete}
      setShow={setDelAgent}
    ></BaseDeleteDialog>
  )
}
