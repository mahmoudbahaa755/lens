import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { asyncContext } from '../utils/async_context.js'

declare module '@adonisjs/core/http' {
  interface Request {
    lensEntry?: {
      queries: { query: string; duration: string; createdAt: string }[]
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
