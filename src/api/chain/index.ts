import { utilTime } from '@/utils/day'
import { api } from '..'
import { ApiResponse } from '../types'
import { ChainData } from './type'

export const chainApi = {
  async getChain() {
    return api.GET<ApiResponse<ChainData[]>>('/api/v2/utils/chains')
  },
}
