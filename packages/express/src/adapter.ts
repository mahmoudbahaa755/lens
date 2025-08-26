import {
  LensAdapter,
  lensUtils,
  QueryWatcher,
  RequestWatcher,
  RouteDefinition,
  WatcherTypeEnum,
  RouteHttpMethod,
} from "@lens/core";
import { RequiredExpressAdapterConfig } from "./types";
import { Express, Request, Response } from "express";
import * as path from "path";
import express from "express";

export default class ExpressAdapter extends LensAdapter {
  protected app!: Express;
  protected config!: RequiredExpressAdapterConfig;

  constructor({ app }: { app: Express }) {
    super();
    this.app = app;
  }

  public setConfig(config: RequiredExpressAdapterConfig) {
    this.config = config;
    return this;
  }

  override async setup() {
    for (const watcher of this.getWatchers()) {
      switch (watcher.name) {
        case WatcherTypeEnum.REQUEST:
          this.watchRequests(watcher);
          break;
        case WatcherTypeEnum.QUERY:
          await this.watchQueries(watcher);
          break;
      }
    }
  }

  protected async watchQueries(queryWatcher: QueryWatcher) {
    if (!this.config.queryWatcher.enabled) return;

    const handler = this.config.queryWatcher.handler;

    await handler({
      onQuery: async (query) => {
        query.query = lensUtils.formatSqlQuery(query.query);
        console.log("query", query);
        await queryWatcher.log({
          data: query,
        });
        // try {
        //   const queries = getContextQueries();
        //
        //   if (queries === undefined) {
        //     throw new Error("queries container not found");
        //   }
        //
        //   asyncContext.getStore()?.lensEntry?.queries.push(query);
        // } catch (e) {
        //   await queryWatcher.log({
        //     data: query,
        //   });
        // }
      },
    });
  }

  protected async watchRequests(_requestWatcher: RequestWatcher) {
    this.app.on("finish", async () => {});
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
}
