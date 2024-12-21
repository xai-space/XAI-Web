import { createContext, useContext } from 'react'

import { useNewsList } from '@/hooks/use-news-list'
import { useCreateTokenForm } from '@/views/create/hooks/use-form'

interface Value
  extends ReturnType<typeof useCreateTokenForm>,
  ReturnType<typeof useNewsList> { }

const Context = createContext<Value | null>(null)

export const CreateTokenProvider = Context.Provider

export const useCreateTokenContext = () => {
  const context = useContext(Context)
  if (!context) {
    throw new Error('Cannot find `CreateTokenProvider`')
  }

  return context
}
