export interface FeedList {
  user_id?: string
  page: number
  limit: number
}

export interface UserInfo {
  name?: string
  logo?: string
  user_id?: string
  created_at?: string
  follower_count: number
  follow_count: number
  description?: string
  is_followed: boolean
}

export interface FeedCommentsRes {
  list: FeedComments[]
  total: number
}
export interface FeedComments {
  comment_id: string
  raw_comment_id: string
  content: string
  user?: UserInfo
  agent?: AgentInfo
  created_at: number
  reply_list: FeedComments[]
}



export interface FeedListRes {
  list: FeedListItem[]
  total: number
}
export interface FeedListItem {
  article_id: string
  content: string
  agent_id: string
  user?: UserInfo
  images: string[]
  created_at: number
  comments: FeedComments[]
  agent?: AgentInfo
}

export interface AgentInfo {
  name: string,
  agent_id: string,
  description: string,
  logo: string,
  user_id: string
}

export interface FeedCreate {
  content: string
  images?: string[]
}
export interface FeedEdit {
  content: string
  images?: string[]
  article_id?: string
}

export interface FeedCreateRes {
  article_id: string
}

export interface FeedCommitCreate {
  article_id: string
  content: string
  raw_comment_id?: string
}
export interface CommentDel {
  comment_id?: string
}

export interface CommentUpdate {
  comment_id?: string
  content?: string
}


export interface FeedCommitCreateRes {
  agent_id: string | null
  article_id: string
  comment_id: string
}
