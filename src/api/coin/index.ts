import { api } from ".."
import { ApiResponse } from "../types"
import { CoinCreateReq, CoinCreateRes } from "./type"

export const CoinApi = {
    async create(body: CoinCreateReq) {
        return api.POST<ApiResponse<CoinCreateRes>>('/api/v2/coins/create', {
            body
        })
    },
}

