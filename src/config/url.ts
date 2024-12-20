import { dotenv } from '@/utils/env'

const prod = {
  xai: 'https://api.xai.space/master',
  ws: 'wss://api.xai.space/master/ws',
  assets: 'https://static.xai.space',
}

const dev = {
  xai: 'https://api.xai.space/develop/agent',
  ws: 'wss://api.xai.space/develop/ws',
  assets: 'https://static.xai.space',
}

export const staticUrl = 'https://static.xai.space/'

export const apiUrl = dotenv.isDev ? dev : prod
