import { ComponentProps, useEffect, useState } from 'react'
import { IoLanguageOutline } from 'react-icons/io5'
import { IoDiamondOutline } from 'react-icons/io5'
import { IoDiamond } from 'react-icons/io5'
import {
  RiNotification3Line,
  RiRobot2Fill,
  RiRobot2Line,
  RiRocketFill,
  RiRocketLine,
} from 'react-icons/ri'
import { MdOutlineArticle } from 'react-icons/md'
import { RiNotification3Fill } from 'react-icons/ri'
import { FaRegUser } from 'react-icons/fa6'
import { FaUser } from 'react-icons/fa6'

import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { useUserStore } from '@/stores/use-user-store'
import { useLang } from '@/hooks/use-lang'
import { cn } from '@/lib/utils'
import { Routes } from '@/routes'
import { officialLinks } from '@/config/link'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import { joinPaths } from '@/utils'
import { get } from 'lodash-es'
import { useResponsive } from '@/hooks/use-responsive'
import Logo from '@/components/logo'
import SocialLinks from '@/components/social-links'
import NavAccount from './nav-account'
import RewardButton from '@/components/reward-button'
import { useAIAgentStore } from '@/stores/use-chat-store'
import { PublishPostDialog } from '@/components/publish-post-dialog'
import { DynamicConnectButton } from '@dynamic-labs/sdk-react-core'
import { UserCategory } from '@/api/user/types'
import { getUnreadNotices } from '@/api/user'
import { useRequest } from 'ahooks'
interface Props {
  collapseSize?: keyof ReturnType<typeof useResponsive>
}

export const NavAside = ({
  className,
  collapseSize = 'isLaptop',
  ...props
}: ComponentProps<'div'> & Props) => {
  const { t, i18n } = useTranslation()
  const { setLang } = useLang()
  const { pathname, ...router } = useRouter()
  const { userInfo } = useUserStore()
  const responsive = useResponsive()
  const [isCollapsed, setIsCollapsed] = useState(responsive[collapseSize])

  const { agentInfo, sessionId } = useAIAgentStore()

  const userNavs = [
    {
      title: t('profile'),
      path: joinPaths(
        Routes.Account,
        userInfo?.user_id || '',
        `?t=${UserCategory.User}`
      ),
      icon: <FaRegUser />,
      iconActive: <FaUser />,
      isActive: pathname.includes(Routes.Account),
    },
  ]

  const navs = [
    {
      title: t('Coin'),
      path: Routes.Main,
      icon: <RiRocketLine />,
      iconActive: <RiRocketFill />,
      isActive: pathname === Routes.Main,
    },
    {
      title: 'AI Agent',
      path: sessionId
        ? `${Routes.AIChat}/${agentInfo?.agent_id}?sid=${sessionId}`
        : Routes.AIList,
      icon: <RiRobot2Line />,
      iconActive: <RiRobot2Fill />,
      isActive: pathname.startsWith(Routes.AI),
    },
    {
      title: 'Feed',
      path: Routes.Feed,
      icon: <MdOutlineArticle />,
      iconActive: <MdOutlineArticle />,
      isActive: pathname === Routes.Feed,
    },
    // {
    //   title: t('award'),
    //   path: Routes.Reward,
    //   icon: <IoDiamondOutline />,
    //   iconActive: <IoDiamond />,
    //   isActive: pathname === Routes.Reward,
    // },
    {
      title: t('Notification'),
      id: 'notice',
      path: Routes.Notification,
      icon: <RiNotification3Line />,
      iconActive: <RiNotification3Fill />,
      isActive: pathname === Routes.Notification,
    },
  ]

  useEffect(() => {
    setIsCollapsed(responsive[collapseSize])
  }, [responsive, collapseSize])

  // console.log('xixoioox..')

  const { data: noticeCount } = useRequest(getUnreadNotices, {
    onSuccess: (data) => {
      // console.log('noticeCount:', data)
    },
  })
  return (
    <aside
      className={cn(
        'flex flex-col space-y-4 w-52 pt-4 select-none relative h-screen justify-between',
        isCollapsed && 'w-10 items-center',
        className
      )}
      {...props}
    >
      <div>
        <Logo
          showMeme
          showLogo={!isCollapsed}
          className="w-28"
          linkClass={isCollapsed ? 'relative flex item-center' : 'relative'}
          betaClass={isCollapsed ? 'absolute -bottom-5 ml-1' : ''}
        />
        <div
          className={cn(
            'pt-2 space-y-3',
            isCollapsed && 'mt-5 flex flex-col items-center'
          )}
        >
          <NavigationMenu className="grid grid-cols-1 max-w-full">
            <NavigationMenuList
              className={cn(
                'grid grid-cols-1 space-x-0 space-y-3',
                isCollapsed && 'space-y-2'
              )}
            >
              {navs.map((n, i) => (
                <NavigationMenuItem
                  key={i}
                  className={cn('w-full relative', isCollapsed && 'w-auto')}
                >
                  <NavigationMenuLink
                    className={cn(
                      'border-[15px] text-lg w-full flex justify-start space-x-2 pl-2 cursor-pointer bg-clip-padding font-normal hover:opacity-90',
                      !n.isActive &&
                        'chamfer-gray bg-border-gray hover:bg-border-gray',
                      n.isActive &&
                        'font-bold chamfer-blue bg-border-blue hover:bg-border-blue',
                      isCollapsed &&
                        'border-[10px] space-x-0 p-0 justify-center text-xl'
                    )}
                    onClick={() => router.push(n.path)}
                    title={n.title}
                  >
                    {n.isActive ? n.iconActive : n.icon}
                    {!isCollapsed && <span>{n.title}</span>}
                    {n.id === 'notice' && (
                      <div className="absolute top-1 -left-1 flex px-1 justify-center items-center text-center text-white rounded-full text-[12px] bg-red-500">
                        {get(noticeCount, 'data.count', '')}
                      </div>
                    )}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          <div
            className={cn(
              'flex justify-between items-center mt-1',
              isCollapsed && 'flex-col justify-center space-x-0 space-y-2'
            )}
          >
            <div
              className={cn(
                'flex justify-center items-center space-x-1',
                className
              )}
              {...props}
            >
              <Button
                type="button"
                size={isCollapsed ? 'icon' : 'icon-lg'}
                title={t('change.language')}
                onClick={() =>
                  i18n.language === 'en' ? setLang('zh') : setLang('en')
                }
                className="border-transparent sm:hover:border-black w-full"
              >
                <IoLanguageOutline size={20} />
              </Button>
            </div>

            <SocialLinks
              x={officialLinks.x}
              tg={officialLinks.tg}
              whitepaper={officialLinks.whitepaper}
              size={20}
              buttonProps={{
                size: isCollapsed ? 'icon' : 'icon-lg',
                className: isCollapsed ? 'w-full' : '',
              }}
            />
          </div>

          <PublishPostDialog isCollapsed={isCollapsed} />
        </div>
      </div>

      <div
        className={cn('flex flex-col items-start pb-5', !userInfo && 'w-full')}
      >
        <NavAccount userInfo={userInfo} isCollapsed={isCollapsed} />

        {/* <RewardButton
          shadow="none"
          showReferral={isCollapsed ? false : true}
          className={cn(
            'border-none w-full justify-between mt-3',
            isCollapsed && 'w-fit p-2'
          )}
        /> */}
      </div>
    </aside>
  )
}
