import { LensConfig } from "./define-config.js";
import * as path from "node:path";
import * as fs from "node:fs";
import {
  LensAdapter,
  WatcherTypeEnum,
  RouteDefinition,
  RequestWatcher,
  QueryWatcher,
  CacheWatcher,
  lensUtils,
  lensContext,
  lensEmitter,
  RequestEntry,
  QueryEntry,
  RouteHttpMethod
} from "@lensjs/core";
import { nowISO } from "@lensjs/date";

// Use any types for NestJS and Express since they're peer dependencies
type INestApplication = any;
type Request = any;
type Response = any;

export default class NestJSAdapter extends LensAdapter {
  protected app!: INestApplication;
  protected config!: LensConfig;

  constructor({ app }: { app: INestApplication }) {
    super();
    this.app = app;
  }

  public setConfig(config: LensConfig) {
    this.config = config;
    return this;
  }

  setup(): void {
    for (const watcher of this.getWatchers()) {
      switch ((watcher as any).name) {
        case WatcherTypeEnum.REQUEST:
          if (this.config.watchers.requests) {
            this.watchRequests(watcher as RequestWatcher);
          }
          break;
        case WatcherTypeEnum.QUERY:
          if (this.config.watchers.queries.enabled) {
            void this.watchQueries(watcher as QueryWatcher);
          }
          break;
        case WatcherTypeEnum.CACHE:
          if (this.config.watchers.cache) {
            void this.watchCache(watcher as CacheWatcher);
          }
          break;
      }
    }
  }

  registerRoutes(routes: RouteDefinition[]): void {
    const httpAdapter = this.app.getHttpAdapter();

    routes.forEach((route) => {
      const method = route.method.toLowerCase();

      httpAdapter[method](route.path, async (req: Request, res: Response) => {
        try {
          const data = await route.handler({
            params: req.params,
            qs: req.query,
          });
          res.json(data);
        } catch (error) {
          res.status(500).json({ error: "Internal server error" });
        }
      });
    });
  }

  serveUI(
    uiPath: string,
    spaRoute: string,
    _dataToInject: Record<string, any>
  ): void {
    const httpAdapter = this.app.getHttpAdapter();

    // Serve favicon
    httpAdapter.get(
      `/${spaRoute}/favicon.ico`,
      (req: Request, res: Response) => {
        const faviconPath = path.join(uiPath, "favicon.ico");
        if (fs.existsSync(faviconPath)) {
          res.sendFile(faviconPath);
        } else {
          res.status(404).end();
        }
      }
    );

    // Redirect root to /requests
    httpAdapter.get(`/${spaRoute}`, (req: Request, res: Response) => {
      res.redirect(`/${spaRoute}/requests`);
    });

    // Serve static assets and SPA
    httpAdapter.get(`/${spaRoute}/*`, (req: Request, res: Response) => {
      const subPath = req.params[0];

      if (this.isStaticFile(subPath)) {
        const assetPath = path.join(
          uiPath,
          this.stripBeforeAssetsPath(subPath)
        );
        if (fs.existsSync(assetPath)) {
          res.sendFile(assetPath);
        } else {
          res.status(404).end();
        }
      } else {
        // Serve the main HTML file for SPA routes
        const htmlPath = path.join(uiPath, "index.html");
        if (fs.existsSync(htmlPath)) {
          res.sendFile(htmlPath);
        } else {
          res.status(404).end();
        }
      }
    });
  }

  protected watchRequests(requestWatcher: RequestWatcher): void {
    // This will be handled by the LensInterceptor
    // The interceptor will capture request data and call requestWatcher.log()
  }

  protected async watchQueries(queryWatcher: QueryWatcher): Promise<void> {
    // Query watching would depend on the ORM/database library being used
    // This is a placeholder - implementation would vary based on TypeORM, Prisma, etc.
    // Users would need to implement query logging in their ORM configuration
  }

  protected async watchCache(cacheWatcher: CacheWatcher): Promise<void> {
    // Cache watching would depend on the caching library being used
    // This is a placeholder - implementation would vary based on the cache manager
    // Users would need to implement cache event logging in their cache configuration
  }

  // Utility methods
  private isStaticFile(path: string): boolean {
    const staticExtensions = [
      ".js",
      ".css",
      ".png",
      ".jpg",
      ".jpeg",
      ".gif",
      ".svg",
      ".ico",
      ".woff",
      ".woff2",
      ".ttf",
      ".eot",
    ];
    return staticExtensions.some((ext) => path.endsWith(ext));
  }

  private stripBeforeAssetsPath(path: string): string {
    const assetsIndex = path.indexOf("assets/");
    return assetsIndex !== -1 ? path.substring(assetsIndex) : path;
  }

  // Utility method to get request ID from NestJS request
  public static getRequestId(req: any): string | undefined {
    return req.lensEntry?.requestId;
  }

  // Utility method to set request ID on NestJS request
  public static setRequestId(req: any, requestId: string): void {
    if (!req.lensEntry) {
      req.lensEntry = {};
    }
    req.lensEntry.requestId = requestId;
  }

  // Utility method to generate request ID
  public static generateRequestId(): string {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }
}
