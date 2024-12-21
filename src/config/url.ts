import { dotenv } from '@/utils/env'

const prod = {
  xai: 'https://api.xai.space/develop',
  ws: 'wss://api.xai.space/develop/ws',
  assets: 'https://static.xai.space',
}

const dev = {
  xai: 'https://api.xai.space/develop',
  ws: 'wss://api.xai.space/develop/ws',
  assets: 'https://static.xai.space',
}

export const staticUrl = 'https://static.xai.space/'


export const apiUrl = dotenv.isDev ? dev : prod
