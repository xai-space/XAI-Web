import { api } from '..'

import { CommonHeaders, ContentType } from '@/hooks/use-fetch'
import { ApiResponse } from '../types'
import { GetContractRes } from './types'

export interface UploadImageRes { url: string, filename: string }

export const otherApi = {
  uploadImage: (formData: FormData) => {
    return api.POST<ApiResponse<UploadImageRes | UploadImageRes[]>>('/agent/v1/playground/upload', {
      body: formData,
      headers: {
        [CommonHeaders.ContentType]: ContentType.FormData,
      },
    })
  },
  uploadImages: (formData: FormData) => {
    return api.POST<ApiResponse<UploadImageRes[] | UploadImageRes>>('/agent/v1/playground/batch/upload', {
      body: formData,
      headers: {
        [CommonHeaders.ContentType]: ContentType.FormData,
      },
    })
  },
  getContracts: () => {
    return api.GET<ApiResponse<GetContractRes>>('/api/v1/contract/')
  },
}
