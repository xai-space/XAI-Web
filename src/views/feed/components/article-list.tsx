import { FeedListItem } from '@/api/feed/types'
import { Card } from '@/components/ui/card'
import { memo } from 'react'
import ArticleCard from './article-card'

const ArticleList = ({ articles }: { articles: FeedListItem[] }) => {
  if (articles.length === 0) {
    return <Card>Card</Card>
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {articles.map((article) => (
        <ArticleCard article={article} key={article.article_id} />
      ))}
    </div>
  )
}

export default memo(ArticleList)
