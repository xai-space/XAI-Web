import { feedApi } from '@/api/feed'
import Input from '@/components/input'
import { Button } from '@/components/ui/button'
import { defaultUserId } from '@/config/base'
import { useArticleStore } from '@/stores/use-article-store'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import TextareaAutosize from 'react-textarea-autosize'
import { useUserStore } from '@/stores/use-user-store'
import { DynamicConnectButton } from '@dynamic-labs/sdk-react-core'
import { isEmpty } from 'lodash'

interface ReplyProps {
  replayUser?: {
    name: string
    cid: string
  }
  onSended?: () => void
}

export const ArticleCommentForm = ({ replayUser, onSended }: ReplyProps) => {
  const { query } = useRouter()
  const { t } = useTranslation()
  const { setArticle, setFeedList } = useArticleStore()
  const { userInfo } = useUserStore()

  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)

  const postComment = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!userInfo?.user_id) {
      toast.error(t('no.login'))
      return
    }
    e.stopPropagation()

    if (comment.trim().length === 0) {
      toast.warning(t('input.comment'))
      return
    }
    if (typeof query.id === 'string') {
      setLoading(true)
      try {
        await feedApi.createComment({
          article_id: query.id,
          content: comment,
          raw_comment_id: replayUser?.cid,
        })
        toast.success(t('comment.posted'))
        // setFeedList([])
        await getComment()
      } catch {
      } finally {
        onSended?.()
        setLoading(false)
        setComment('')
        setLoading(false)
      }
    }
  }

  const getComment = async () => {
    const data = await feedApi.getDetail(query.id as unknown as string)
    setArticle(data.data)
  }

  return (
    <div className="mt-5">
      <TextareaAutosize
        className="w-full resize-none p-2 rounded-md min-h-[100px] max-h-[200px]"
        value={comment}
        disabled={loading}
        onChange={(e) => setComment(e.target.value)}
        placeholder={
          replayUser ? `${t('replay')} @${replayUser.name}` : t('enter.comment')
        }
      ></TextareaAutosize>
      <DynamicConnectButton>
        <Button
          onClick={postComment}
          className="mt-2"
          disabled={loading || isEmpty(comment.trim())}
        >
          {loading ? t('posting') : t('post.comment')}
        </Button>
      </DynamicConnectButton>
    </div>
  )
}
