import { IoDiamond, IoDiamondOutline } from 'react-icons/io5'
import { RiNotification3Fill, RiNotification3Line } from 'react-icons/ri'
import { BsRocketTakeoff, BsRocketTakeoffFill } from 'react-icons/bs'
import { AiFillFire, AiOutlineFire } from 'react-icons/ai'

import { useResponsive } from '@/hooks/use-responsive'
import { Routes } from '@/routes'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { useScroll } from 'ahooks'

interface BottomNav {
  title: string
  path: string
  icon: React.ReactNode
  iconActive: React.ReactNode
  isActive: boolean
}

const PERCENT = 0.5
export const MobileNavBottom = () => {
  const { isPad } = useResponsive()
  const { t } = useTranslation()
  const { push, pathname } = useRouter()
  const { top } = useScroll(document) ?? { top: 0 }

  const navs: BottomNav[] = [
    {
      title: t('Coin'),
      path: Routes.Main,
      icon: <BsRocketTakeoff />,
      iconActive: <BsRocketTakeoffFill />,
      isActive: pathname === Routes.Main,
    },
    {
      title: t('reward'),
      path: Routes.Reward,
      icon: <IoDiamondOutline />,
      iconActive: <IoDiamond />,
      isActive: pathname === Routes.Reward,
    },
    {
      title: t('Notification'),
      path: Routes.Notification,
      icon: <RiNotification3Line />,
      iconActive: <RiNotification3Fill />,
      isActive: pathname === Routes.Notification,
    },
    {
      title: t('fire'),
      path: Routes.NewsMoonshot,
      icon: <AiOutlineFire />,
      iconActive: <AiFillFire />,
      isActive: pathname.includes(Routes.News),
    },
  ]

  if (!isPad) return null

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 flex justify-around items-center bg-secondary min-w-full',
        'border-t border-zinc-600'
      )}
    >
      {navs.map((nav, i) => (
        <div
          key={i}
          className="py-3 sm:px-4"
          onClick={() => {
            push(nav.path)
          }}
        >
          <span className="text-2xl">
            {nav.isActive ? nav.iconActive : nav.icon}
          </span>
        </div>
      ))}
    </div>
  )
}

export default MobileNavBottom
