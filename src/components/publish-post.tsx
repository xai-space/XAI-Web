import { defaultAgentLogo, defaultUserLogo } from '@/config/link'
import { Avatar } from './ui/avatar'
import { ChangeEvent, ReactEventHandler, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from './ui/button'
import TextareaAutosize from 'react-textarea-autosize'
import { FaRegImage } from 'react-icons/fa6'
import ImageUpload from './image-upload'
import { useUploadImage } from '@/hooks/use-upload-image'
import { IoClose } from 'react-icons/io5'
import { feedApi } from '@/api/feed'
import { defaultUserId } from '@/config/base'
import { toast } from 'sonner'
import { useArticleStore } from '@/stores/use-article-store'
import { FeedListItem } from '@/api/feed/types'
import { staticUrl } from '@/config/url'
import { cloneDeep, isEqual } from 'lodash'
import { useUserStore } from '@/stores/use-user-store'

interface Props {
  editArticle?: FeedListItem
  onPosted: () => void
}

export const PublishPost = ({ editArticle, onPosted }: Props) => {
  const [editArticle2, setEditArticle2] = useState(cloneDeep(editArticle))
  const [value, setValue] = useState(editArticle?.content || '')
  const imgRef = useRef<HTMLInputElement>(null)
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const { feedList, setFeedList } = useArticleStore()
  const { userInfo } = useUserStore()
  const isCreate = !editArticle

  const { closeItem, checkCount, blobUrl, onSubmitImg, onChangeUpload } =
    useUploadImage({
      inputEl: imgRef.current,
      maxFile: 3,
      showToast: false,
    })

  const onUploadImg = () => {
    const fileCount = (editArticle2?.images?.length || 0) + blobUrl.length

    if (fileCount >= 3) {
      return toast.warning(t('max.file.warn').replace('$1', '3'))
    }

    if (checkCount()) imgRef.current?.click()
  }

  const updateFeed = async () => {
    const { data } = await feedApi.getList({
      limit: 10,
      page: 1,
    })

    const firstArticleId = feedList[0]?.article_id
    const newList = []

    for (let i = 0; i < data.length; i++) {
      const item = data[i]
      console.log(item.article_id, firstArticleId)

      if (item.article_id !== firstArticleId) {
        newList.push(item)
      } else break
    }

    setFeedList(newList.concat(feedList))
  }

  const onLocalChangeImg = (e: ChangeEvent<HTMLInputElement>) => {
    const fileCount =
      (editArticle2?.images?.length || 0) +
      blobUrl.length +
      (e.target.files?.length || 0)

    if (fileCount > 3) {
      return toast.warning(t('max.file.warn').replace('$1', '3'))
    }

    onChangeUpload(e)
  }

  const submitText = () => {
    if (loading) {
      return isCreate ? t('post...') : t('update...')
    }

    return isCreate ? t('post') : t('update')
  }

  const submitDisable = () => {
    console.log(editArticle?.images, editArticle2?.images)

    if (
      !isCreate &&
      // oldContent === newContent
      editArticle.content == value &&
      // image1 === image2 && newImage = 0
      isEqual(editArticle?.images, editArticle2?.images) &&
      blobUrl.length === 0
    ) {
      return true
    }

    return !value.trim() || loading
  }

  const onSubmit = async () => {
    const lid = toast.loading(t('publishing'))
    setLoading(true)
    try {
      const url = await onSubmitImg()
      let images = url?.map(({ url }) => url)
      images = isCreate ? images : editArticle2?.images.concat(images || [])
      console.log(images, editArticle2?.images)

      const sendPost = isCreate ? feedApi.createFeed : feedApi.updatePost

      await sendPost({
        content: value,
        images: images,
        article_id: editArticle2?.article_id,
      })

      // Create
      if (!editArticle) {
        await updateFeed()
        toast.success(t('published.successfully'))
      } else {
        // Edit
        editArticle.content = value
        editArticle.images = images || []
      }

      onPosted()
    } catch {
      toast.error(t('published.error'))
    } finally {
      setLoading(false)
      toast.dismiss(lid)
    }
  }

  return (
    <>
      <div className="flex">
        <Avatar
          src={
            isCreate
              ? userInfo?.logo
                ? `${staticUrl}${userInfo?.logo}`
                : defaultUserLogo
              : editArticle2?.user?.logo
              ? `${staticUrl}${editArticle2?.user?.logo}`
              : defaultAgentLogo
          }
          alt="Logo"
        />
        <div className="flex-1">
          <TextareaAutosize
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
            }}
            placeholder={t('idea.placeholder')}
            className="!border-none resize-none text-xl focus:shadow-none focus:!border-none !outline-0 focus-visible:!shadow-[0px_0px_0px_0px_0px_#ffffff00] m-2 pr-5 min-h-[40px] max-h-[60vh] w-full"
            autoFocus={true}
          ></TextareaAutosize>
          <div className="flex space-x-1">
            {editArticle2?.images?.map((url, i) => {
              return (
                <div className="relative flex-1">
                  <img
                    src={`${staticUrl}${url}`}
                    alt="Logo"
                    className="rounded-md w-full h-full object-cover max-h-[15vh]"
                  />
                  <div className="absolute right-1 top-1 bg-black/50 border-dashed border border-gray-500 rounded-full">
                    <IoClose
                      className="cursor-pointer"
                      size={20}
                      onClick={() => {
                        editArticle2?.images.splice(i, i + 1)
                        setEditArticle2(cloneDeep(editArticle2))
                      }}
                    ></IoClose>
                  </div>
                </div>
              )
            })}

            {blobUrl.map((url, i) => {
              return (
                <div className="relative flex-1">
                  <img
                    src={url}
                    alt="Logo"
                    className="rounded-md w-full h-full object-cover max-h-[15vh]"
                  />
                  <div className="absolute right-1 top-1 bg-black/50 border-dashed border border-gray-500 rounded-full">
                    <IoClose
                      className="cursor-pointer"
                      size={20}
                      onClick={() => {
                        closeItem(i)
                      }}
                    ></IoClose>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      <div className="flex pt-4 items-center justify-between border-t border-gray-600">
        <span>
          <FaRegImage
            size={20}
            className="cursor-pointer hover:text-gray-400"
            onClick={onUploadImg}
          ></FaRegImage>
        </span>
        <Button onClick={onSubmit} disabled={submitDisable()}>
          {submitText()}
        </Button>
      </div>
      <ImageUpload
        ref={imgRef}
        className="hidden"
        multiple={true}
        onChange={(e) => onLocalChangeImg(e)}
      ></ImageUpload>
    </>
  )
}
