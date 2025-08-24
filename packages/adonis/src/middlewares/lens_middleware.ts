import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import { LensALS, lensContext, lensUtils} from '@lens/core'

declare module '@adonisjs/core/http' {
  interface Request {
    lensEntry?: LensALS['lensEntry']
  }
}

export default class LensMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    const lensEntry = {
      queries: [],
      requestId: lensUtils.generateRandomUuid(),
    }

    return lensContext.run({ lensEntry }, async () => {
      ctx.request.lensEntry = lensEntry
      return await next()
    })
  }
}
