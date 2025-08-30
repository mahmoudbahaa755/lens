import { LensAdapter, WatcherTypeEnum, lensUtils, lensContext, getContextQueries, } from '@lens/core';
import * as path from 'path';
import { parseDuration, shouldIgnoreLogging } from './utils/index.js';
import string from '@adonisjs/core/helpers/string';
export default class AdonisAdapter extends LensAdapter {
    app;
    router;
    emitter;
    isRequestWatcherEnabled = false;
    queryWatcher;
    config;
    constructor({ app }) {
        super();
        this.app = app;
    }
    setup() {
        this.app.booted(async () => {
            this.router = await this.app.container.make('router');
            this.emitter = await this.app.container.make('emitter');
            for (const watcher of this.getWatchers()) {
                switch (watcher.name) {
                    case WatcherTypeEnum.REQUEST:
                        this.isRequestWatcherEnabled = true;
                        this.watchRequests(watcher);
                        break;
                    case WatcherTypeEnum.QUERY:
                        this.queryWatcher = watcher;
                        await this.watchQueries(watcher);
                        break;
                }
            }
        });
    }
    setConfig(config) {
        this.config = config;
        return this;
    }
    registerRoutes(routes) {
        this.app.booted(async () => {
            routes.forEach((route) => {
                this.router[route.method.toLowerCase()](route.path, async (ctx) => {
                    const data = await route.handler({ params: ctx.params, qs: ctx.request.qs() });
                    return ctx.response.json(data);
                });
            });
        });
    }
    watchRequests(requestWatcher) {
        const self = this;
        if (shouldIgnoreLogging(this.app) || !self.isRequestWatcherEnabled)
            return;
        this.emitter.on('http:request_completed', async function (event) {
            if (self.shouldIgnorePath(event.ctx.request.url(false)))
                return;
            if (!event.ctx.request.lensEntry?.requestId) {
                throw new Error('requestId mest be defined in lens middleware');
            }
            const request = event.ctx.request;
            const requestQueries = event.ctx.request.lensEntry?.queries ?? [];
            const requestId = event.ctx.request.lensEntry.requestId;
            const logPayload = {
                request: {
                    id: requestId,
                    method: request.method(),
                    duration: string.prettyHrTime(event.duration),
                    path: request.url(true),
                    headers: request.headers(),
                    body: request.hasBody() ? request.body() : {},
                    status: event.ctx.response.response.statusCode,
                    ip: request.ip(),
                    createdAt: lensUtils.nowISO(),
                },
                response: {
                    json: event.ctx.response.getBody(),
                    headers: event.ctx.response.getHeaders(),
                },
                user: await self.getUserFromContext(event.ctx),
            };
            logPayload.totalQueriesDuration = self.calculateQueriesDuration(requestQueries);
            await requestWatcher.log(logPayload);
            for (const query of requestQueries) {
                await self.queryWatcher?.log({
                    data: query,
                    requestId,
                });
            }
        });
    }
    async watchQueries(queryWatcher) {
        const self = this;
        this.app.booted(async () => {
            if (shouldIgnoreLogging(self.app))
                return;
            // @ts-ignore
            this.emitter.on('db:query', async function (query) {
                const duration = query.duration ? string.prettyHrTime(query.duration) : '0 ms';
                const payload = {
                    query: lensUtils.formatSqlQuery(lensUtils.interpolateQuery(query.sql, query.bindings), self.config.watchers.queries.provider),
                    duration,
                    createdAt: lensUtils.sqlDateTime(),
                    type: query.type,
                };
                try {
                    const queries = getContextQueries();
                    if (queries === undefined || !self.isRequestWatcherEnabled) {
                        throw new Error('queries container not found');
                    }
                    lensContext.getStore()?.lensEntry?.queries.push(payload);
                }
                catch (e) {
                    await queryWatcher.log({
                        data: payload,
                    });
                }
            });
        });
    }
    serveUI(uiPath, spaRoute, _dataToInject) {
        this.app.booted(async () => {
            this.router.get(`/${spaRoute}/favicon.svg`, (ctx) => {
                return ctx.response.download(path.join(uiPath, 'favicon.svg'));
            });
            this.router.get(`/${spaRoute}`, (ctx) => {
                return ctx.response.redirect(`/${spaRoute}/requests`);
            });
            this.router.get(`/${spaRoute}/*`, (ctx) => {
                if (lensUtils.isStaticFile(ctx.params['*'])) {
                    return this.matchStaticFiles(ctx, uiPath, lensUtils.stripBeforeAssetsPath(ctx.params['*'].join('/')));
                }
                const htmlPath = path.join(uiPath, 'index.html');
                return ctx.response.download(htmlPath, true);
            });
        });
    }
    matchStaticFiles(ctx, uiPath, subPath) {
        const assetPath = path.join(uiPath, subPath);
        return ctx.response.download(assetPath);
    }
    calculateQueriesDuration(requestQueries) {
        let totalQueriesDuration = 0;
        for (const query of requestQueries) {
            totalQueriesDuration = parseDuration(query.duration);
        }
        return `${totalQueriesDuration} ms`;
    }
    async getUserFromContext(ctx) {
        return (await this.config.isAuthenticated?.(ctx)) && this.config.getUser
            ? await this.config.getUser?.(ctx)
            : null;
    }
}
