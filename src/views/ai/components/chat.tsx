'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import ReactMarkdown from 'react-markdown'

import { Avatar } from '@/components/ui/avatar'
import { useTranslation } from 'react-i18next'
import { useChatStream } from '@/hooks/use-chat-stream'
import { defaultAgentLogo, loadingSVG } from '@/config/link'
import { staticUrl } from '@/config/url'
import { useAIAgentStore } from '@/stores/use-chat-store'
import { useUserStore } from '@/stores/use-user-store'
import { toast } from 'sonner'
import { DynamicConnectButton } from '@dynamic-labs/sdk-react-core'

const FormSchema = z.object({
  message: z.string(),
})

interface ChatProps {
  scrollBarToBottom: () => void
}

export function Chat({ scrollBarToBottom }: ChatProps) {
  const { t } = useTranslation()
  const { agentInfo } = useAIAgentStore()
  const { userInfo } = useUserStore()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      message: '',
    },
  })

  const { sessions, isReplying, loading, sessionId, sendQuestion } =
    useChatStream()

  const onSubmit = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault()

    if (!userInfo?.user_id) {
      toast.error(t('no.login'))
      return
    }

    e?.stopPropagation()
    if (!isReplying) {
      sendQuestion(form.getValues('message'))
      form.reset()
    }
  }

  useEffect(() => {
    scrollBarToBottom()
  }, [sessions])

  return (
    <div className="flex flex-col h-full max-w-[775px] w-full mx-auto">
      <div className="flex-1">
        {/* Gretting */}
        {agentInfo?.greeting?.trim()?.length ? (
          <div className="flex items-start mb-2">
            <Avatar
              src={
                agentInfo?.logo
                  ? `${staticUrl}${agentInfo.logo}`
                  : defaultAgentLogo
              }
              className="w-8 h-8 mr-2"
            ></Avatar>
            <div className="bg-gray-800 text-primary rounded-lg p-3 max-w-[80%]">
              <div>{agentInfo?.greeting}</div>
            </div>
          </div>
        ) : null}

        {sessions.map((item, index) => (
          <>
            <div className="mb-4">
              {/* USER */}
              <div className="flex items-start justify-end">
                <div className="bg-primary text-primary-foreground rounded-lg p-3 max-w-[80%]">
                  {item.message.content}
                </div>
                <Avatar className="w-8 h-8 ml-2"></Avatar>
              </div>

              {/* AI */}
              <div className="flex items-start mt-4 mb-2">
                <Avatar
                  src={
                    agentInfo?.logo
                      ? `${staticUrl}${agentInfo.logo}`
                      : defaultAgentLogo
                  }
                  className="w-8 h-8 mr-2"
                ></Avatar>
                <div className="bg-gray-800 text-primary rounded-lg p-3 max-w-[80%]">
                  <ReactMarkdown>{item.response.content}</ReactMarkdown>
                  {loading && index === sessions.length - 1 ? (
                    <img src={loadingSVG} width={20} height={20}></img>
                  ) : null}
                </div>
              </div>
            </div>
          </>
        ))}
      </div>
      <div className="sticky bottom-0 z-50 w-full bg-background flex justify-stretch space-x-2">
        <Form {...form}>
          <form
            className="flex-1"
            onSubmit={form.handleSubmit(() => onSubmit())}
          >
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl className="w-full">
                    <Input
                      {...field}
                      placeholder={t('ai.type_message')}
                      className="flex-grow w-full border-white py-5"
                      disabled={isReplying}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DynamicConnectButton>
          <Button
            disabled={isReplying || !form.getValues('message').trim()}
            className="!flex !h-[100%] px-10"
            onClick={onSubmit}
          >
            {isReplying ? t('ai.sending') : t('ai.send')}
          </Button>
        </DynamicConnectButton>
      </div>
    </div>
  )
}
