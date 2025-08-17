import { QueryEntry } from '@lens/core'
import { AsyncLocalStorage } from 'node:async_hooks'

export type LensEntryContext = {
  lensEntry?: {
    queries: QueryEntry['data'][]
  }
}

export const asyncContext = new AsyncLocalStorage<LensEntryContext>()

export const getContextQueries = () => {
  const context = asyncContext.getStore()
  return context?.lensEntry?.queries
}
