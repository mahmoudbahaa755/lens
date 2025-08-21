import {
  LensAdapter,
  lensUtils,
  QueryWatcher,
  RequestWatcher,
  RouteDefinition,
  WatcherTypeEnum,
  QueryEntry,
  RouteHttpMethod,
} from "@lens/core";
import { RequiredExpressAdapterConfig } from "./types";
import { Express, NextFunction, Request, Response } from "express";
import * as path from "path";
import express from "express";
import { AsyncLocalStorage } from "async_hooks";

const lensContext = new AsyncLocalStorage<{
  requestId: string;
  queries: QueryEntry["data"][];
}>();

export default class ExpressAdapter extends LensAdapter {
  protected app!: Express;
  protected config!: RequiredExpressAdapterConfig;
  protected queryWatcher?: QueryWatcher;
  protected isRequestWatcherEnabled = false;

  constructor({ app }: { app: Express }) {
    super();
    this.app = app;
  }

  public setConfig(config: RequiredExpressAdapterConfig) {
    this.config = config;
    return this;
  }

  setup(): void {
    for (const watcher of this.getWatchers()) {
      switch ((watcher as any).name) {
        case WatcherTypeEnum.REQUEST:
          this.isRequestWatcherEnabled = true;
          this.watchRequests(watcher as unknown as RequestWatcher);
          break;
        case WatcherTypeEnum.QUERY:
          this.queryWatcher = watcher as unknown as QueryWatcher;
          void this.watchQueries(watcher as unknown as QueryWatcher);
          break;
      }
    }
  }

  private async watchQueries(queryWatcher: QueryWatcher) {
    if (!this.config?.queryWatcher?.enabled) return;

    const handler = this.config.queryWatcher.handler;

    if (!handler) return;

    await handler({
      onQuery: async (query: QueryEntry["data"]) => {
        const queryPayload = {
          query: query.query,
          duration: query.duration || "0 ms",
          createdAt: lensUtils.sqlDateTime() as string,
          type: query.type,
        };

        if (lensContext.getStore() && this.config.requestWatcherEnabled) {
          lensContext.getStore()?.queries.push(queryPayload);
        } else {
          await queryWatcher.log({ data: queryPayload });
        }
      },
    });
  }

  private watchRequests(requestWatcher: RequestWatcher) {
    if (!this.isRequestWatcherEnabled) return;

    this.app.use((req: Request, res: Response, next: NextFunction) => {
      if (this.shouldIgnorePath(req.path)) {
        return next();
      }

      const context = {
        requestId: lensUtils.generateRandomUuid(),
        queries: [],
      };

      lensContext.run(context, () => {
        const start = process.hrtime();
        const originalJson = res.json.bind(res);
        const originalSend = res.send.bind(res);

        (res as any)._body = undefined;

        res.json = function (body?: any) {
          (res as any)._body = body;
          return originalJson(body);
        } as typeof res.json;

        res.send = function (body?: any) {
          try {
            (res as any)._body = body;
          } catch {}
          return originalSend(body);
        } as typeof res.send;

        res.on("finish", async () => {
          try {
            const store = lensContext.getStore();
            if (!store) return;

            const duration = lensUtils.prettyHrTime(process.hrtime(start));
            const logPayload = {
              request: {
                id: store.requestId,
                method: req.method as any,
                duration,
                path: req.originalUrl,
                headers: req.headers as Record<string, string>,
                body: req.body ?? {},
                status: res.statusCode,
                ip: (req.ip as string) ?? req.socket?.remoteAddress,
                createdAt: lensUtils.nowISO(),
              },
              response: {
                json: (res as any)._body ?? null,
                headers: (res.getHeaders ? res.getHeaders() : {}) as Record<
                  string,
                  string
                >,
              },
              user: (await this.config.isAuthenticated?.(req))
                ? await this.config.getUser?.(req)
                : null,
              totalQueriesDuration: this.sumQueryDurations(store.queries),
            };

            await requestWatcher.log(logPayload);

            for (const q of store.queries) {
              await this.queryWatcher?.log({
                data: q,
                requestId: store.requestId,
              });
            }
          } catch (err) {}
        });

        next();
      });
    });
  }

  registerRoutes(routes: RouteDefinition[]): void {
    routes.forEach((route) => {
      this.app[route.method.toLowerCase() as RouteHttpMethod](
        this.preparePath(route.path),
        async (req: Request, res: Response) => {
          return res.json(
            await route.handler({ params: req.params, qs: req.query }),
          );
        },
      );
    });
  }

  serveUI(
    uiPath: string,
    spaRoute: string,
    _dataToInject: Record<string, any>,
  ): void {
    this.app.use(this.preparePath(spaRoute), express.static(uiPath));
    this.app.get(
      this.preparePath(`${spaRoute}/favicon.svg`),
      (_: Request, res: Response) => {
        return res.sendFile(path.join(uiPath, "favicon.svg"));
      },
    );
    this.app.get(
      new RegExp(`^/${spaRoute}(?!/api)(/.*)?$`),
      (req: Request, res: Response) => {
        const reqPath = req.path;

        if (lensUtils.isStaticFile(reqPath.split("/"))) {
          return this.matchStaticFiles(
            res,
            uiPath,
            lensUtils.stripBeforeAssetsPath(reqPath),
          );
        }

        return res.sendFile(path.join(uiPath, "index.html"));
      },
    );
  }

  private matchStaticFiles(
    response: Response,
    uiPath: string,
    subPath: string,
  ) {
    const assetPath = path.join(uiPath, subPath);
    return response.download(assetPath);
  }

  private preparePath(path: string) {
    return path.startsWith("/") ? path : `/${path}`;
  }

  private sumQueryDurations(queries: { duration: string }[]) {
    let total = 0;

    queries.forEach((q) => {
      const durationValue = parseInt(q.duration.split(" ")[0] ?? "", 10);

      if (!isNaN(durationValue)) {
        total += durationValue;
      }
    });

    return `${total} ms`;
  }
}
