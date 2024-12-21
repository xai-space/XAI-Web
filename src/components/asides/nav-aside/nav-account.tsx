import React from 'react'
import { IoIosMore } from 'react-icons/io'

import { Avatar } from '../../ui/avatar'
import { fmt } from '@/utils/fmt'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/router'
import { UserCategory, UserInfoRes } from '@/api/user/types'
import { Routes } from '@/routes'
import { ConnectWallet } from '../../connect-wallet'
import { NavAccountPopover } from './nav-account-pop'
import { useDynamicContext } from '@dynamic-labs/sdk-react-core'
import { defaultAgentLogo, defaultUserLogo } from '@/config/link'
import { useUserStore } from '@/stores/use-user-store'
import { staticUrl } from '@/config/url'

export const NavAccount = ({
  isCollapsed,
}: {
  userInfo: UserInfoRes | null
  isCollapsed: boolean
}) => {
  const { pathname, ...router } = useRouter()
  const { t } = useTranslation()
  const { userInfo } = useUserStore()
  const { primaryWallet } = useDynamicContext()

  const avatar = '/images/logo.png'

  const userInfoIsCollapsed = () => {
    // TODO: wait api
    // if (userInfo) {
    const { primaryWallet } = useDynamicContext()

    if (isCollapsed) {
      return (
        <NavAccountPopover>
          <Avatar
            src={userInfo?.logo ? `${staticUrl}${userInfo?.logo}` : avatar}
            className="rounded-full w-10 h-10"
          />
        </NavAccountPopover>
      )
    }

    return (
      <div className="w-full flex items-center justify-between">
        <div
          className="flex items-end cursor-pointer mr-2"
          onClick={() =>
            router.push(
              `${Routes.Account}/${userInfo?.user_id}?t=${UserCategory.User}`
            )
          }
        >
          <Avatar
            src={
              userInfo?.logo ? `${staticUrl}${userInfo?.logo}` : defaultUserLogo
            }
            className="rounded-full w-12 h-12"
          />
          <div className="flex flex-col space-y-1">
            <div className="text-sm ml-2 font-semibold line-clamp-1 break-all">
              {userInfo?.name || primaryWallet?.address.slice(0, 4) || '--'}
            </div>
            <span className="text-xs ml-2 text-gray-500">
              {fmt.addr(primaryWallet?.address)}
            </span>
          </div>
        </div>

        <NavAccountPopover>
          <IoIosMore className="cursor-pointer" size={20} />
        </NavAccountPopover>
      </div>
    )
  }
  // }

  return (
    <ConnectWallet
      // shadow={'none'}
      className={cn(
        !isCollapsed && 'w-52',
        isCollapsed && 'absolute -left-4 bottom-4 p-0 !border-8'
      )}
      text={isCollapsed ? t('connect') : undefined}
    >
      {userInfoIsCollapsed()}
    </ConnectWallet>
  )
}

export default NavAccount
