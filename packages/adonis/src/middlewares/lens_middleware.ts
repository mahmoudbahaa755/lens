import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { asyncContext, QueryType } from '@lens/core'

declare module '@adonisjs/core/http' {
  interface Request {
    lensEntry?: {
      queries: { query: string; duration: string; createdAt: string, type: QueryType}[]
    }
  }
}

export default class LensMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const lensEntry = {
      queries: [],
    }

    return asyncContext.run({ lensEntry }, async () => {
      ctx.request.lensEntry = lensEntry
      return await next()
    })
  }
}
