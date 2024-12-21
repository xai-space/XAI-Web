'use client'

import { useEffect, type ReactNode } from 'react'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

import { PrimaryLayout } from '@/components/layouts/primary'
import { feedApi } from '@/api/feed'
import ReactMarkdown from 'react-markdown'
import { loadingSVG, defaultUserLogo } from '@/config/link'
import { staticUrl } from '@/config/url'
import { ArticleComment } from '../components/article-comment'
import { useArticleStore } from '@/stores/use-article-store'
import { toast } from 'sonner'
import { FaAngleLeft } from 'react-icons/fa6'
import { useTranslation } from 'react-i18next'
import { Routes } from '@/routes'
import { ArticleImages } from '../components/article-images'
import dayjs from 'dayjs'

export const DetailPage = () => {
  const { query, replace } = useRouter()
  const { t } = useTranslation()

  const [loading, setLoading] = useState(false)

  const { article, setArticle } = useArticleStore()

  useEffect(() => {
    const handle = async () => {
      if (!query.id) return

      if (typeof query.id === 'string') {
        try {
          setLoading(true)
          const res = await feedApi.getDetail(query.id)
          setArticle(res.data)
        } catch (e: any) {
          toast.error(e.toString())
        } finally {
          setLoading(false)
        }
      }
    }

    handle()
  }, [query.id])

  if (loading) {
    return (
      <img src={loadingSVG} width={60} height={60} className="mx-auto my-5" />
    )
  }

  return (
    <div className="mx-auto max-w-[755px]">
      <div
        className="inline-flex items-center cursor-pointer mb-3"
        onClick={() => replace(Routes.Feed)}
      >
        <FaAngleLeft size={20}></FaAngleLeft>
        {t('back.artilce.list')}
      </div>
      <div className="bg-black p-4 ">
        <div className="flex items-center mb-3 space-x-3 rounded-md">
          <img
            src={
              article?.agent?.logo
                ? `${staticUrl}${article?.agent?.logo}`
                : article?.user?.logo
                ? `${staticUrl}${article?.user?.logo}`
                : defaultUserLogo
            }
            alt="logo"
            width={40}
            height={40}
            className="w-[40px] h-[40px] rounded-full object-cover"
          />
          <div>
            <span className="font-bold">
              {article?.agent?.name || article?.user?.name || '--'}
            </span>
            <span className="ml-2 text-gray-500">
              {dayjs((article?.created_at || 0) * 1000).fromNow()}
            </span>
          </div>
        </div>
        <div>
          {article?.content && <ReactMarkdown>{article.content}</ReactMarkdown>}
        </div>

        <ArticleImages images={article?.images}></ArticleImages>
        <ArticleComment />
      </div>
    </div>
  )
}

DetailPage.getLayout = (page: ReactNode) => (
  <PrimaryLayout>{page}</PrimaryLayout>
)

export default DetailPage
