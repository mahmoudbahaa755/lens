import {
  LensAdapter,
  lensUtils,
  QueryWatcher,
  RequestWatcher,
  RouteDefinition,
  WatcherTypeEnum,
  QueryEntry,
  RouteHttpMethod,
  lensEmitter,
} from "@lens/core";
import { RequiredExpressAdapterConfig } from "./types";
import { Express, Request, Response } from "express";
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
          this.watchRequests(watcher as RequestWatcher);
          break;
        case WatcherTypeEnum.QUERY:
          this.queryWatcher = watcher as QueryWatcher;
          void this.watchQueries();
          break;
      }
    }
  }

  registerRoutes(routes: RouteDefinition[]): void {
    routes.forEach((route) => {
      this.app[route.method.toLowerCase() as RouteHttpMethod](
        this.normalizePath(route.path),
        async (req: Request, res: Response) => {
          const result = await route.handler({
            params: req.params,
            qs: req.query,
          });
          return res.json(result);
        },
      );
    });
  }

  serveUI(
    uiPath: string,
    spaRoute: string,
    _dataToInject: Record<string, any>,
  ): void {
    this.app.use(this.normalizePath(spaRoute), express.static(uiPath));

    this.app.get(
      this.normalizePath(`${spaRoute}/favicon.svg`),
      (_: Request, res: Response) => res.sendFile(path.join(uiPath, "favicon.svg")),
    );

    this.app.get(new RegExp(`^/${spaRoute}(?!/api)(/.*)?$`), (req, res) => {
      if (lensUtils.isStaticFile(req.path.split("/"))) {
        return res.download(path.join(uiPath, lensUtils.stripBeforeAssetsPath(req.path)));
      }
      return res.sendFile(path.join(uiPath, "index.html"));
    });
  }

  private async watchQueries() {
    if (!this.config?.queryWatcher?.enabled) return;
    if (this.config.queryWatcher.handler) {
      try {
        await this.config.queryWatcher.handler();
      } catch (e) {
        console.error("Failed to start query handler:", e);
      }
    }

    lensEmitter.on("query", async (q: QueryEntry["data"]) => {
      const store = lensContext.getStore();
      if (store) {
        // If a store exists, it's being handled by the request-specific listener.
        return;
      }

      // Otherwise, log it as a background query.
      const normalized = {
        query: q.query,
        duration: q.duration || "0 ms",
        createdAt: q.createdAt || (lensUtils.sqlDateTime() as string),
        type: q.type,
      };

      if (this.queryWatcher) {
        await this.queryWatcher.log({ data: normalized });
      }
    });
  }

  private watchRequests(requestWatcher: RequestWatcher) {
    if (!this.isRequestWatcherEnabled) return;

    this.app.use((req, res, next) => {
      if (this.shouldIgnorePath(req.path)) return next();

      const context = { requestId: lensUtils.generateRandomUuid(), queries: [] };
      lensContext.run(context, () => {
        const store = lensContext.getStore();
        if (!store) return next();

        const start = process.hrtime();

        const onQuery = (q: QueryEntry["data"]) => {
          const normalized = {
            query: q.query,
            duration: q.duration || "0 ms",
            createdAt: q.createdAt || (lensUtils.sqlDateTime() as string),
            type: q.type,
          };
          store.queries.push(normalized);
        };

        lensEmitter.on("query", onQuery);

        const cleanup = () => lensEmitter.off("query", onQuery);
        res.on("finish", cleanup);
        res.on("close", cleanup);
        res.on("error", cleanup as any);

        this.patchResponseMethods(res);

        res.on("finish", async () => {
          await this.finalizeRequestLog(req, res, requestWatcher, store, start);
        });

        next();
      });
    });
  }

  private patchResponseMethods(res: Response) {
    const originalJson = res.json.bind(res);
    const originalSend = res.send.bind(res);
    (res as any)._body = undefined;

    res.json = function (body?: any) {
      (res as any)._body = body;
      return originalJson(body);
    } as typeof res.json;

    res.send = function (body?: any) {
      (res as any)._body = body;
      return originalSend(body);
    } as typeof res.send;
  }

  private async finalizeRequestLog(
    req: Request,
    res: Response,
    requestWatcher: RequestWatcher,
    store: { requestId: string; queries: QueryEntry["data"][] },
    start: [number, number],
  ) {
    try {
      const duration = lensUtils.prettyHrTime(process.hrtime(start));
      const logPayload = {
        request: {
          id: store.requestId,
          method: req.method as any,
          duration,
          path: req.originalUrl,
          headers: req.headers,
          body: req.body ?? {},
          status: res.statusCode,
          ip: req.socket?.remoteAddress ?? '',
          createdAt: lensUtils.nowISO(),
        },
        response: {
          json: (res as any)._body ?? null,
          headers: res.getHeaders?.() as Record<string, string>,
        },
        user: (await this.config.isAuthenticated?.(req))
          ? await this.config.getUser?.(req)
          : null,
        totalQueriesDuration: this.sumQueryDurations(store.queries),
      };

      await requestWatcher.log(logPayload);

      for (const q of store.queries) {
        await this.queryWatcher?.log({ data: q, requestId: store.requestId });
      }
    } catch (err) {
      console.error("Error finalizing request log:", err);
    }
  }

  private normalizePath(pathStr: string) {
    return pathStr.startsWith("/") ? pathStr : `/${pathStr}`;
  }

  private sumQueryDurations(queries: { duration: string }[]) {
    return (
      queries.reduce((acc, q) => {
        const n = parseFloat((q.duration || "").split(" ")[0] ?? '0');
        return isNaN(n) ? acc : acc + n;
      }, 0) + " ms"
    );
  }
}
