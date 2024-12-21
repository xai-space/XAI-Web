import type { Address } from 'viem'
import type { PaginationReq } from '../types'
import type { TokenCommentListRes, TokenListItem } from '../token/types'
import { UserInfo } from '../feed/types'

export interface UserLoginReq {
  name?: string
  logo?: string
  description?: string
  wallet_address: string
  chain_id: string
  sign: string
  timestamp: string
}

export interface UserLoginRes {
  token: string
  user: UserInfoRes
}

export interface UserUpdateReq {
  name?: string
  logo?: string
  description?: string
  wallet_address?: string
}

export interface UserInfoRes extends UserInfo {}
export interface UserMyInfoFollow {
  id: number
  name: string
  logo: string
  follower_count: number
}

export interface UserMyInfoNotify {
  id: number
  content: string
  user: {
    id: number
    name: string
    logo: string
  }
  coin: number
  img: string
  related_comments: number[]
  created_at: string
  likes_count: number
  is_liked: boolean
}

export enum UserListType {
  CoinsCreated = 1,
  Comments,
  Mentions,
  Followers,
  Following,
  CoinsHeld,
  PublishedPosts,
  PublishedComments,
  Agent,
}

export interface UserListReq extends PaginationReq {
  type: UserListType
}

export interface UserListRes {
  [UserListType.CoinsHeld]: UserCoinsHeld
  [UserListType.CoinsCreated]: UserCoinsCreated
  [UserListType.Comments]: TokenCommentListRes
  [UserListType.Mentions]: UserNotification
  [UserListType.Followers]: UserFollow
  [UserListType.Following]: UserFollow
}

export interface FollowItem {
  user_id?: string
  agent_id?: string
  name?: string
  logo?: string
  description?: string
  is_followed?: boolean
}
export interface FollowerItem {
  user_id?: string
  agent_id?: string
  name?: string
  logo?: string
  description?: string
  is_followed?: boolean
}

export enum UserCategory {
  Agent = 'agent',
  User = 'user',
}

export interface UserFollowsReq {
  category: UserCategory
  user_id?: string
  limit?: number
  page?: number
}

export interface UserUpdateFollowReq {
  category: UserCategory
  target_id: string
  status: 0 | 1
}

interface User {
  id: number
  name: string
  logo: string
  description: string
  wallet_address: string
  like_count: number
  mention_count: number
}

export interface Chain {
  id: string | number
  name: string
  displayName: string
  logo: string
  native: {
    decimals: number
    name: string
    symbol: string
  }
  explorer: string
  explorer_tx: string
}

export interface UserCoinsCreated extends TokenListItem {
  image: string
  address: string
  ticker: string
  creator: User
  name: string
  desc: string
  market_cap: number
  total_replies: number
  status: number
  // Custom prop
  poolAddr?: Address
}

export interface UserReplies {
  id: number
  content: string
  user: User
  coin: number
  images: string[]
  related_comments: number[]
  created_at: string
  likes_count: number
  is_liked: boolean
}

export interface UserNotification {
  id: number
  content: string
  user: User
  coin: number
  img: string
  related_comments: number[]
  created_at: string
  likes_count: number
  is_liked: boolean
}

export interface UserFollow {
  id: number
  name: string
  logo: string
  follower_count: number
  user: User
  is_follower: boolean
}

export interface UserCoinsHeld {
  id: number
  coin_version: string
  airdrop_version: string
  hold_amount: number
  created_at: string
  updated_at: string
  chain: string
  network: string
  hash: string
  name: string
  symbol: string
  description: string
  image_url: string
  poster_urls: string[]
  twitter_url: string
  telegram_url: string
  website_url: string
  creator_address: string
  factory_address: string
  contract_address: string
  airdrop_address: string
  airdrop_index: number
  airdrop_supply: string
  max_supply: string
  total_supply: string
  start_price: string
  start_usd_price: string
  coin_type: number
  airdrop_type: number
  is_active: boolean
  is_graduated: boolean
  graduated_at: null | string
  graduated_pool: null | string
  graduated_token: null | string
  graduated_master: null | string
}

export enum UserNotificationAction {
  Follow = 'follow',
  Like = 'like',
  Mention = 'mention',
}
export interface UserNotificationItem {
  is_read: number
  action: UserNotificationAction
  id: string
  data: {
    status: boolean
    id: string
    from_user: {
      logo: string
      name: string
      id: string
    }
  }
  created_at: number
}

export interface UserNotificationRes {
  list: UserNotificationList[]
  total: number
}

export interface UserNotificationList {
  /**
   * 消息类型，data 会根据类型变化，枚举：follow
   */
  action: string
  created_at: number
  data: UserNotificationData
  id: string
  /**
   * 是否已读
   */
  is_read: number
  /**
   * 当前用户id
   */
  user_id: string
  [property: string]: any
}

export interface UserNotificationData {
  /**
   * 来源用户
   */
  from_user: FromUser
  /**
   * 关注状态，1:关注；0:取关
   */
  status: boolean
  /**
   * 目标用户，被关注/取关的对象
   */
  user_id: string
  [property: string]: any
}

export interface FromUser {
  logo: string
  name: string
  user_id: string
  [property: string]: any
}

// export enum NoticeAtion {
//   All = 'all',
//   Follow = 'follow',
//   Like = 'like',
//   Comment = 'comment',
//   Reply = 'reply',
// }

export interface NoticeParams {
  page: number
  limit: number
  action: NoticeAtion
}

export type NoticeAtion = 'all' | 'follow' | 'like' | 'comment' | 'reply'

export interface Count {
  count: number
}

export interface ReadNoticesBody {
  action: string
  notification_id: string
  [property: string]: any
}
