import { qs } from '@/utils/qs'
import { api } from '..'
import { ApiResponse } from '../types'
import {
  CommentDel,
  CommentUpdate,
  FeedCommitCreate,
  FeedCommitCreateRes,
  FeedCreate,
  FeedCreateRes,
  FeedEdit,
  FeedList,
  FeedListItem,
  FeedListRes,
} from './types'

export const feedApi = {
  getList: (query: FeedList) => {
    return api.GET<ApiResponse<FeedListRes>>(
      '/agent/v1/playground/article/list' + qs.stringify(query)
    )
  },

  getDetail: (id: string) => {
    return api.GET<ApiResponse<FeedListItem>>(
      `/agent/v1/playground/article/detail/${id}`
    )
  },

  createFeed: async (data: FeedCreate) => {
    return api.POST<ApiResponse<FeedCreateRes>>(
      '/agent/v1/playground/article/publish',
      {
        body: data,
      }
    )
  },

  updatePost: async (data: FeedEdit) => {
    return api.PUT<ApiResponse<FeedCreateRes>>(
      '/agent/v1/playground/article/update',
      {
        body: data,
      }
    )
  },

  createComment: async (data: FeedCommitCreate) => {
    return api.POST<ApiResponse<FeedCommitCreateRes>>(
      '/agent/v1/playground/article/comment/commit',
      {
        body: data,
      }
    )
  },

  delPost: async (data: FeedCreateRes) => {
    return api.POST<ApiResponse>(
      '/agent/v1/playground/article/delete',
      {
        body: data,
      }
    )
  },

  updateComment: async (data: CommentUpdate) => {
    return api.PUT<ApiResponse<FeedCommitCreateRes>>(
      '/agent/v1/playground/article/comment/update',
      {
        body: data,
      }
    )
  },

  delComment: async (data: CommentDel) => {
    return api.POST<ApiResponse<FeedCommitCreateRes>>(
      '/agent/v1/playground/article/comment/delete',
      {
        body: data,
      }
    )
  },
}
