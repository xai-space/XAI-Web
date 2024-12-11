export const storageNamespace = 'xai'

// Don't use `interface`
export type LocalStorage = {
  lang: string
  token: string
  area: string
  comment_trade_tab: string
  show_age: string
  chart_interval: string
  slippage: string
  only_graduated_checked: string
  clear_token: string
}

// Don't use `interface`
export type SessionStorage = {
  invite_code: string
}
