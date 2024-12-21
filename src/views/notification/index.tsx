import { useEffect, type ReactNode } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { PrimaryLayout } from '@/components/layouts/primary'
import NoticeCardList from './components/notice-card-list'
import { useTranslation } from 'react-i18next'
import { NoticeAtion } from '@/api/user/types'

interface NavList {
  title: string
  value: string
}

export const NotificationPage = () => {
  const { t } = useTranslation()
  const navList: NavList[] = [
    {
      title: t('all'),
      value: 'all',
    },
    {
      title: t('notice.follow'),
      value: 'follow',
    },
    {
      title: t('notice.like'),
      value: 'like',
    },
    {
      title: t('notice.comment'),
      value: 'comment',
    },
  ]

  return (
    <div className="w-full px-10 max-sm:px-0">
      <Tabs defaultValue="all">
        <div className="fixed z-10">
          {/* 消息导航 */}
          <TabsList className="flex justify-start bg-[#000]">
            {navList.map((item, index) => (
              <TabsTrigger className="min-w-28" key={index} value={item.value}>
                {item.title}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        {/* 消息类别 */}
        {navList.map((item, index) => (
          <TabsContent key={index} value={item.value}>
            <NoticeCardList action={item.value} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

NotificationPage.getLayout = (page: ReactNode) => (
  <PrimaryLayout>{page}</PrimaryLayout>
)

export default NotificationPage
