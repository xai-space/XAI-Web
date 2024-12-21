import { FeedListItem } from '@/api/feed/types'
import { create } from 'zustand'

interface ArticleInfoStore {
    article: FeedListItem | undefined
    feedList: FeedListItem[]

    setFeedList: (feedList: FeedListItem[]) => void
    setArticle: (article: FeedListItem) => void
}

export const useArticleStore = create<ArticleInfoStore>((set, get) => ({
    article: undefined,
    feedList: [],

    setFeedList: (feedList) => set({ feedList }),
    setArticle: (article) => set({ article })
}))
