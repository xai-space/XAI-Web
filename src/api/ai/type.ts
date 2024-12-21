export interface AIMemeInfo {
  name?: string
  description?: string
  symbol?: string
  image?: string
  chainName?: string
  background?: string
}

export interface AgentInfoData {
  agent_id: string
  description?: string
  logo: string
  name: string
  user_id: string
}

export interface AIMemeInfoQuery {
  input: string
  type?: 1 | 0
  background?: string
}

export interface AIMemeImageQuery extends AIMemeInfo { }

export interface AIMemePosterQuery extends AIMemeInfo {
  name?: string
  description?: string
}

export interface AIEMemePosterData {
  poster1: string[]
  poster2: string[]
}

export interface AgentCreate {
  name: string
  logo: string
  description: string
  instructions: string[]
  greeting: string
  is_public: string
  logo_identify: string
  agent_id?: string
}

export interface Agent {
  name: string
  logo: string
  description: string
  instructions: string[]
  greeting: string
  user_id: string
  is_public: string
  logo_identify: string
}


export interface AgentResDataBase {
  agent_id: string
  name: string
}

export interface AgentListRes {
  list: AgentInfoResDataBase[]
  total: number
}

export interface AgentInfoResDataBase {
  agent_id: string
  name: string
  description: string
  logo: string
  user_id: string
  greeting: string
  is_public: string,
  is_followed: boolean
  logo_identify: string
}

export interface AgentCreateRes {
  message: string
  data: AgentResDataBase
}

export interface AgentUpadeRes {
  message: string
  data: AgentResDataBase
}

export interface AgentUpdate {
  user_id: string
  agent_id: string
  name: string
}

// search params
export interface AgentListReq {
  user_id?: string
  page: number
  limit: number
}
export interface AgentListResItem {
  name: string
  agent_id: string
  description: string
  logo: string
  greeting: string
  user_id: string
}

export interface AgentChat {
  agent_id: string
  message: string
  user_id?: string
  session_id: string | null
  stream: boolean
}

export interface AgentChatRes {
  content: string
  content_type: string
  run_id: string
  agent_id: string
  session_id: string
}

export interface AgentSessionsAll {
  agent_id: string
}

export interface AgentSessionsAllRes {
  title: string
  session_id: string
  session_name: any
  created_at: number
}

export interface AgentSessionsRename {
  name: string
  agent_id: string
  session_id: string
}

export interface AgentSessionsRenameRes {
  message: string
}

export interface AgentSessionsHistory {
  agent_id: string
}

export interface AgentSessionsHistoryRes {
  session_id: string
  agent_id: string
  user_id: string
  memory: AgentSessionsHistoryMemoryItem
  user_data: any
  session_data: AgentSessionsHistorySessionDataItem
  created_at: number
  updated_at: number
}

export interface AgentSessionsList {
  title: string
  session_id: string
  session_name: string,
  created_at: number
}

export interface AgentSessionsDelete {
  session_id: string
  agent_id: string
}

export interface AgentSessionsDeleteRes {
  message: string
}

interface AgentSessionsHistorySessionDataItem { }

interface AgentSessionsHistoryMemoryRunsMessageMetricsCompletionTokensDetailsItem {
  audio_tokens: number
  reasoning_tokens: number
  accepted_prediction_tokens: number
  rejected_prediction_tokens: number
}

interface AgentSessionsHistoryMemoryRunsMessageMetricsPromptTokensDetailsItem {
  audio_tokens: number
  cached_tokens: number
}

interface MetricsItem {
  time: string
  input_tokens: number
  total_tokens: number
  output_tokens: number
  prompt_tokens: number
  completion_tokens: number
  prompt_tokens_details: AgentSessionsHistoryMemoryRunsMessageMetricsPromptTokensDetailsItem
  completion_tokens_details: AgentSessionsHistoryMemoryRunsMessageMetricsCompletionTokensDetailsItem
}

interface AgentSessionsHistoryMemoryMessageItem {
  role: string
  content: string
  created_at: number
  metrics?: MetricsItem
}

interface MessageItem {
  role: string
  content: string
  created_at: number
  metrics?: MetricsItem
}

interface AgentSessionsHistoryMemoryRunsResponseItem {
  event: string
  model: string
  run_id: string
  content: string
  // metrics: MetricsItem
  agent_id: string
  // messages: MessageItem[]
  created_at: number
  session_id: string
  content_type: string
}

export interface AgentSessionsHistoryMemoryRunsItem {
  message: MessageItem
  response: AgentSessionsHistoryMemoryRunsResponseItem
}

export interface AgentSessionsHistoryMemoryItem {
  runs: AgentSessionsHistoryMemoryRunsItem[]
  messages: AgentSessionsHistoryMemoryMessageItem[]
  create_user_memories: boolean
  create_session_summary: boolean
  update_user_memories_after_run: boolean
  update_system_message_on_change: boolean
  update_session_summary_after_run: boolean
}
