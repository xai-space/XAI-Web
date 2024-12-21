import { FeedComments } from '@/api/feed/types'
import { defaultUserLogo } from '@/config/link'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import ReactMarkdown from 'react-markdown'
import { BiMessageRoundedDetail } from 'react-icons/bi'
import { Button } from '@/components/ui/button'
import { useArticleStore } from '@/stores/use-article-store'
import { useEffect, useState } from 'react'
import { ArticleCommentForm } from './article-comment-form'
import { defaultUserId } from '@/config/base'
import { cn } from '@/lib/utils'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa6'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { FiMoreHorizontal } from 'react-icons/fi'
import { MdDelete, MdEdit } from 'react-icons/md'
import {
  BaseDeleteDialog,
  DeleteDialogType,
} from '@/components/base-delete-dialog'
import { feedApi } from '@/api/feed'
import { toast } from 'sonner'
import { Dialog, DialogClose, DialogFooter } from '@/components/ui/dialog'
import { useRouter } from 'next/router'
import TextareaAutosize from 'react-textarea-autosize'
import { cloneDeep } from 'lodash'
import { DynamicConnectButton } from '@dynamic-labs/sdk-react-core'
import { useUserStore } from '@/stores/use-user-store'
import { staticUrl } from '@/config/url'

export const ArticleCommentList = () => {
  const { t } = useTranslation()

  const { query } = useRouter()

  const [delCommentId, setDelCommentId] = useState<string>()
  const [editComment, setEditComment] = useState<FeedComments>()
  const [editLoading, setEditLoading] = useState(false)
  const [delLoading, setDelLoading] = useState(false)
  const [editValue, setEditValue] = useState('')

  const { article, setArticle } = useArticleStore()

  const onDelComment = (id: string) => {
    setDelCommentId(id)
  }

  const onEditComment = (comment: FeedComments) => {
    setEditComment(cloneDeep(comment))
  }

  const onEdit = async () => {
    try {
      setEditLoading(true)
      const { code, message } = await feedApi.updateComment({
        comment_id: editComment?.comment_id,
        content: editValue,
      })

      if (code == 200) {
        const res = await feedApi.getDetail(query.id as unknown as string)
        setArticle(res.data)
        setEditComment(undefined)
        toast.success(t('update.successful'))
        return
      }

      toast.error(message)
    } catch (err: any) {
      toast.error(err.toString())
    } finally {
      setEditLoading(false)
    }
  }

  const onDelete = async () => {
    try {
      setDelLoading(true)
      const { code, message } = await feedApi.delComment({
        comment_id: delCommentId,
      })

      if (code == 200) {
        const res = await feedApi.getDetail(query.id as unknown as string)
        setArticle(res.data)
        setDelCommentId(undefined)
        toast.success(t('delete.successful'))
        return
      }

      toast.error(message)
    } catch (e: any) {
      toast.error(e.toString())
    } finally {
      setDelLoading(false)
    }
  }

  useEffect(() => {
    if (editComment) {
      setEditValue(editComment.content)
    }
  }, [editComment])

  return (
    <div className="mt-8">
      <div className="text-xl mb-2">{t('comment')}</div>
      {article?.comments.map((comment) => {
        return (
          <ArticleCommentItem
            key={comment.comment_id}
            className="border-t border-gray-400"
            comment={comment}
            onDelComment={onDelComment}
            onEditComment={onEditComment}
          ></ArticleCommentItem>
        )
      })}

      {!article?.comments.length ? (
        <div className="mt-2 text-gray-500">{t('empty,comment')}</div>
      ) : null}

      <Dialog
        open={!!editComment}
        onOpenChange={() => setEditComment(undefined)}
      >
        <div className="font-bold">{t('edit,comment')}</div>
        <TextareaAutosize
          value={editValue}
          onChange={(e) => {
            setEditValue(e.target.value)
          }}
          className="min-h-[100px] max-h-[200px] p-2 rounded-md resize-none"
        ></TextareaAutosize>

        <DialogFooter>
          <DialogClose>
            <Button className="px-8">{t('cancel')}</Button>
          </DialogClose>
          <Button
            onClick={onEdit}
            disabled={editLoading}
            className="px-8"
            variant={'purple'}
          >
            {editLoading ? t('updating') : t('update')}
          </Button>
        </DialogFooter>
      </Dialog>

      <BaseDeleteDialog
        type={DeleteDialogType.Comment}
        show={!!delCommentId}
        setShow={setDelCommentId}
        loading={delLoading}
        onDelete={onDelete}
      />
    </div>
  )
}

interface CommentItem {
  comment: FeedComments
  rowComment?: FeedComments
  className?: string
  onReply?: () => void
  onDelComment?: (id: string) => void
  onEditComment?: (comment: FeedComments) => void
}

const ArticleCommentItem = ({
  className,
  comment,
  onReply,
  onDelComment,
  onEditComment,
}: CommentItem) => {
  const { t } = useTranslation()

  const [show, setShow] = useState(false)
  const [viewAll, setViewAll] = useState(false)

  return (
    <div className={cn('relative pl-12 py-4', className)}>
      <img
        src={
          comment?.agent?.logo
            ? `${staticUrl}${comment.agent.logo}`
            : comment?.user?.logo
            ? `${staticUrl}${comment.user.logo}`
            : defaultUserLogo
        }
        alt="Logo"
        width={40}
        height={40}
        className={cn(
          'object-cover w-[40px] h-[40px] rounded-full',
          'absolute top-4 left-0'
        )}
      />
      <div>
        <div className="flex items-center space-x-2">
          <div className="flex flex-1">
            <div className="flex items-center font-bold">
              <span>{comment?.agent?.name || comment?.user?.name || '--'}</span>
            </div>
            <span className="ml-2">
              {dayjs(comment.created_at * 1000).fromNow()}
            </span>
          </div>
          <div className="">
            <MoreHandler
              comment={comment}
              onDelComment={onDelComment}
              onEditComment={onEditComment}
            ></MoreHandler>
          </div>
        </div>
        <ReactMarkdown className="mt-1">{comment.content}</ReactMarkdown>

        <div className="flex items-center mt-2 space-x-4">
          <div>
            <BiMessageRoundedDetail
              className="cursor-pointer hover:text-gray-300"
              onClick={() => setShow(!show)}
            ></BiMessageRoundedDetail>
          </div>
          {comment.reply_list.length ? (
            <div
              className={cn(
                'flex items-center space-x-1 text-sm cursor-pointer hover:text-gray-400',
                viewAll ? 'text-gray-400' : ''
              )}
              onClick={() => {
                setViewAll(!viewAll)
              }}
            >
              {viewAll ? (
                <>
                  <span>{t('close.all.reply')}</span>
                  <FaChevronUp
                    size={14}
                    className="translate-y-[1px]"
                  ></FaChevronUp>
                </>
              ) : (
                <>
                  <span>{t('view.all.reply')}</span>
                  <FaChevronDown size={14}></FaChevronDown>
                </>
              )}
            </div>
          ) : null}
        </div>

        {show ? (
          <ArticleCommentForm
            replayUser={{
              cid: comment.comment_id,
              name: comment?.agent?.name! || comment?.user?.name!,
            }}
            onSended={() => {
              setShow(false)
              setViewAll(true)
            }}
          ></ArticleCommentForm>
        ) : null}

        {comment.reply_list.length && viewAll ? (
          <div className="rounded-md">
            {comment.reply_list.map((reply) => {
              return (
                <ArticleReplyCommentItem
                  rowComment={comment}
                  comment={reply}
                  key={reply.comment_id}
                  onReply={() => {
                    setViewAll(true)
                    onReply?.()
                  }}
                  onDelComment={onDelComment}
                  onEditComment={onEditComment}
                ></ArticleReplyCommentItem>
              )
            })}
          </div>
        ) : null}
      </div>
    </div>
  )
}

const ArticleReplyCommentItem = ({
  className,
  comment,
  rowComment,
  onReply,
  onEditComment,
  onDelComment,
}: CommentItem) => {
  const [show, setShow] = useState(false)

  const { userInfo } = useUserStore()

  return (
    <div className={cn('pt-5', className)}>
      <div>
        <div className="flex items-center space-x-2">
          <div className="flex flex-1">
            <div className="flex items-center font-bold">
              <img
                src={
                  comment?.agent?.logo
                    ? `${staticUrl}${comment.agent.logo}`
                    : comment?.user?.logo
                    ? `${staticUrl}${comment.user.logo}`
                    : defaultUserLogo
                }
                alt="Logo"
                width={22}
                height={22}
                className={cn(
                  'object-cover w-[22px] h-[22px] rounded-full mr-2'
                )}
              />
              <span className="ml-2">
                {comment?.agent?.name || comment?.user?.name}
              </span>
            </div>
            <span className="ml-2">
              {dayjs(comment.created_at * 1000).fromNow()}
            </span>
          </div>
          <div>
            <MoreHandler
              comment={comment}
              onDelComment={onDelComment}
              onEditComment={onEditComment}
            ></MoreHandler>
          </div>
        </div>
        <div className="mt-1">
          {comment.content?.startsWith('{{@') ? (
            <>
              <span className="text-blue-500 cursor-pointer">
                @{comment.content.slice(3, comment.content.indexOf('}}'))}
              </span>
              {comment.content.slice(comment.content.indexOf('}}') + 2)}
            </>
          ) : (
            <span className="text-gray-300">
              <span className="text-blue-500 cursor-pointer">
                @{rowComment?.user?.name}
                {` `}
              </span>
              {comment.content}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-4">
          {userInfo?.user_id !== rowComment?.user?.user_id ? (
            <div className="mt-4">
              <BiMessageRoundedDetail
                className="cursor-pointer hover:text-gray-300"
                onClick={() => setShow(!show)}
              ></BiMessageRoundedDetail>
            </div>
          ) : null}
          {/* <div
            className="text-sm cursor-pointer hover:text-gray-400"
            onClick={() => {
              setViewAll(!viewAll)
            }}
          >
            {t('view.all.reply')}
          </div> */}
        </div>
        {show ? (
          <ArticleCommentForm
            replayUser={{
              cid: comment.comment_id,
              name: comment?.user?.name!,
            }}
            onSended={() => {
              setShow(false)
              onReply?.()
            }}
          ></ArticleCommentForm>
        ) : null}
        {comment.reply_list.length ? (
          <div className="mt-2">
            <div className="rounded-md">
              {comment.reply_list.map((reply) => {
                return (
                  <ArticleReplyCommentItem
                    key={reply.comment_id}
                    comment={reply}
                    onReply={onReply}
                    onDelComment={onDelComment}
                    onEditComment={onEditComment}
                  ></ArticleReplyCommentItem>
                )
              })}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

const MoreHandler = ({ comment, onDelComment, onEditComment }: CommentItem) => {
  const { t } = useTranslation()
  const { userInfo } = useUserStore()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="text-gray-500 p-1 transition-all rounded-full cursor-pointer hover:text-white hover:bg-white/40">
          <FiMoreHorizontal size={18} />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DynamicConnectButton buttonClassName="w-full">
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={(e) => {
              if (!userInfo?.user_id) {
                toast.error(t('no.login'))
                return
              }

              e.stopPropagation()
              onEditComment?.(comment)
            }}
          >
            <div className="flex items-center space-x-1">
              <MdEdit size={18} />
              <span>{t('edit')}</span>
            </div>
          </DropdownMenuItem>
        </DynamicConnectButton>
        <DynamicConnectButton buttonClassName="w-full">
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={(e) => {
              if (!userInfo?.user_id) {
                toast.error(t('no.login'))
                return
              }

              e.stopPropagation()
              onDelComment?.(comment.comment_id)
            }}
          >
            <div className="flex items-center text-red-500 space-x-1">
              <MdDelete size={18} />
              <span>{t('delete')}</span>
            </div>
          </DropdownMenuItem>
        </DynamicConnectButton>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
