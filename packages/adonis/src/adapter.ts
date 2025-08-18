import {
  RouteDefinition,
  LensAdapter,
  WatcherTypeEnum,
  lensUtils,
  RequestWatcher,
  RequestEntry,
  QueryWatcher,
  asyncContext,
  getContextQueries,
  RouteHttpMethod,
  QueryEntry,
} from '@lens/core'
import * as path from 'path'
import type { ApplicationService, EmitterService, HttpRouterService } from '@adonisjs/core/types'
import {
  parseDuration,
  resolveConfigFromContext,
  shouldIgnoreCurrentPath,
  shouldIgnoreLogging,
} from './utils/index.js'
import string from '@adonisjs/core/helpers/string'
import { HttpContext } from '@adonisjs/core/http'

export default class AdonisAdapter extends LensAdapter {
  protected app: ApplicationService
  protected router!: HttpRouterService
  protected emitter!: EmitterService
  protected isRequestWatcherEnabled = false
  protected queryWatcher?: QueryWatcher

  constructor({ app }: { app: ApplicationService }) {
    super()
    this.app = app
  }

  override setup(): void {
    this.app.booted(async () => {
      this.router = await this.app.container.make('router')
      this.emitter = await this.app.container.make('emitter')

      for (const watcher of this.getWatchers()) {
        switch (watcher.name) {
          case WatcherTypeEnum.REQUEST:
            this.isRequestWatcherEnabled = true
            this.watchRequests(watcher)
            break
          case WatcherTypeEnum.QUERY:
            this.queryWatcher = watcher as unknown as QueryWatcher
            await this.watchQueries(watcher)
            break
        }
      }
    })
  }

  registerRoutes(routes: RouteDefinition[]): void {
    this.app.booted(async () => {
      routes.forEach((route) => {
        this.router[route.method.toLowerCase() as RouteHttpMethod](route.path, async (ctx: any) => {
          const data = await route.handler({ params: ctx.params, qs: ctx.request.qs() })
          return ctx.response.json(data)
        })
      })
    })
  }

  protected watchRequests(requestWatcher: RequestWatcher): void {
    const self = this
    if (shouldIgnoreLogging(this.app) || !self.isRequestWatcherEnabled) return
    this.emitter.on('http:request_completed', async function (event) {
      if (await shouldIgnoreCurrentPath(event.ctx)) return

      const request = event.ctx.request
      const requestId = lensUtils.generateRandomUuid()
      const requestQueries = event.ctx.request.lensEntry?.queries ?? []
      const logPayload: RequestEntry = {
        request: {
          id: requestId,
          method: request.method() as any,
          duration: string.prettyHrTime(event.duration),
          path: request.url(true),
          headers: request.headers() as Record<string, string>,
          body: request.hasBody() ? request.body() : {},
          status: event.ctx.response.response.statusCode,
          ip: request.ip(),
          createdAt: lensUtils.now().toISO({
            includeOffset: false,
          }),
        },
        response: {
          json: event.ctx.response.getBody(),
          headers: event.ctx.response.getHeaders() as Record<string, string>,
        },
        user: await self.getUserFromContext(event.ctx),
      }

      logPayload.totalQueriesDuration = `${self.calculateQueriesDuration(requestQueries)}`

      await requestWatcher.log(logPayload)

      for (const query of requestQueries) {
        await self.queryWatcher?.log({
          data: query,
          requestId,
        })
      }
    })
  }

  protected async watchQueries(queryWatcher: QueryWatcher): Promise<void> {
    const self = this

    this.app.booted(async () => {
      if (shouldIgnoreLogging(self.app)) return

      // @ts-ignore
      this.emitter.on('db:query', async function (query: any) {
        const duration: string = query.duration ? string.prettyHrTime(query.duration) : '0 ms'

        const payload: QueryEntry['data'] = {
          query: lensUtils.formatSqlQuery(
            lensUtils.interpolateQuery(query.sql, query.bindings as string[])
          ),
          duration,
          createdAt: lensUtils.sqlDateTime(),
          type: query.type,
        }

        try {
          const queries = getContextQueries()

          if (queries === undefined || ! self.isRequestWatcherEnabled) {
            throw new Error('queries container not found')
          }

          asyncContext.getStore()?.lensEntry?.queries.push(payload)
        } catch (e) {
          await queryWatcher.log({
            data: payload,
          })
        }
      })
    })
  }

  serveUI(uiPath: string, spaRoute: string, _dataToInject: Record<string, any>): void {
    this.app.booted(async () => {
      this.router.get(`/${spaRoute}/favicon.svg`, (ctx: HttpContext) => {
        return ctx.response.download(path.join(uiPath, 'favicon.svg'))
      })

      this.router.get(`/${spaRoute}`, (ctx: HttpContext) => {
        return ctx.response.redirect(`/${spaRoute}/requests`)
      })

      this.router.get(`/${spaRoute}/*`, (ctx: HttpContext) => {
        if (lensUtils.isStaticFile(ctx.params['*'])) {
          return this.matchStaticFiles(
            ctx,
            uiPath,
            lensUtils.stripBeforeAssetsPath(ctx.params['*'].join('/'))
          )
        }

        const htmlPath = path.join(uiPath, 'index.html')
        return ctx.response.download(htmlPath, true)
      })
    })
  }

  private matchStaticFiles(ctx: HttpContext, uiPath: string, subPath: string) {
    const assetPath = path.join(uiPath, subPath)

    return ctx.response.download(assetPath)
  }

  private calculateQueriesDuration(requestQueries: QueryEntry['data'][]) {
    let totalQueriesDuration = 0

    for (const query of requestQueries) {
      totalQueriesDuration = parseDuration(query.duration)
    }

    return totalQueriesDuration
  }

  private async getUserFromContext(ctx: HttpContext) {
    const config = await resolveConfigFromContext(ctx)

    return (await config.isAuthenticated?.(ctx)) && config.getUser
      ? await config.getUser?.(ctx)
      : null
  }
}
