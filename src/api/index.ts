import { apiUrl } from '@/config/url'
import { useFetch } from '@/hooks/use-fetch'
import { userApi } from '@/api/user'
export const api = useFetch(apiUrl.xai)

// export {userApi.getUnreadNotices as getUnreadNotices} from '@/api/user'
