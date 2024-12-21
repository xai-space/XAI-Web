import { api } from '..'
import { qs } from '@/utils/qs'
import type { ApiResponse, PaginationRes } from '../types'
import type {
  UserLoginReq,
  UserLoginRes,
  UserInfoRes,
  UserUpdateReq,
  UserListReq,
  UserListRes,
  UserListType,
  UserUpdateFollowReq,
  UserFollowsReq,
  FollowItem,
  UserNotificationRes,
  NoticeParams,
  NoticeAtion,
  Count,
  ReadNoticesBody,
} from './types'

export const userApi = {
  getInfo: (userId: string) => {
    return api.GET<ApiResponse<UserInfoRes>>(
      `/agent/v1/playground/user/info/${userId}`
    )
  },

  login: (req: UserLoginReq) => {
    return Promise.reject({} as UserLoginRes)
    return api.POST<ApiResponse<UserLoginRes>>('/api/v1/user/users/', {
      body: req,
    })
  },

  getOtherInfo: (addr: string) => {
    return api.GET<ApiResponse<UserInfoRes>>(`/api/v1/user/users/${addr}/`)
  },

  list: <T extends UserListType>(addr: string, req: UserListReq) => {
    return api.GET<ApiResponse<PaginationRes<UserListRes[T]>>>(
      `/api/v1/user/infolist/${addr}/${qs.stringify(req)}`
    )
  },

  updateInfo: (req: UserUpdateReq) => {
    return api.PUT<ApiResponse<UserInfoRes>>(
      '/agent/v1/playground/user/update',
      {
        body: req,
      }
    )
  },

  getFollows: (req: UserFollowsReq) => {
    return api.GET<ApiResponse<FollowItem[]>>(
      `/agent/v1/playground/user/follow${qs.stringify(req)}`
    )
  },

  getFollowers: (req: UserFollowsReq) => {
    return api.GET<ApiResponse<FollowItem[]>>(
      `/agent/v1/playground/user/follower${qs.stringify(req)}`
    )
  },
  postFollow: (req: UserUpdateFollowReq) => {
    return api.POST<ApiResponse>(`/agent/v1/playground/user/follow`, {
      body: req,
    })
  },
  follow: (addr: string) => {
    return api.POST<ApiResponse<UserInfoRes>>(
      `/api/v1/user/users/${addr}/followers/`
    )
  },
  unfollow: (id: string) => {
    return api.DELETE<ApiResponse<UserInfoRes>>(
      `/api/v1/user/users/${id}/followers/`
    )
  },

  getNotifications: (params: NoticeParams) => {
    return api.GET<ApiResponse<UserNotificationRes>>(
      `/agent/v1/playground/notification/list` + qs.stringify(params)
    )
  },
  // getUnreadNotices: () => {
  //   return api.GET<ApiResponse<Count>>(`/v1/playground/notification/unread`)
  // },
}

export const getUnreadNotices = (params: { aticon?: NoticeAtion }) => {
  return api.GET<ApiResponse<Count>>(
    `/agent/v1/playground/notification/unread` + qs.stringify(params)
  )
}

export const putReadNotices = (params: ReadNoticesBody) => {
  return api.PUT<object>(`/agent/v1/playground/notification/read`, {
    body: params,
  })
}
