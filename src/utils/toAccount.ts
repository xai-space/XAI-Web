import { useRouter } from 'next/router'
import { Routes } from '@/routes'
import { UserCategory, UserInfoRes } from '@/api/user/types'

const toAccount = () => {
  const { push } = useRouter()
  push(
    `${Routes.Account}/${article.agent?.agent_id || article.user?.user_id}?t=${
      article.agent?.agent_id ? UserCategory.Agent : UserCategory.User
    }`
  )
}

export default toAccount
