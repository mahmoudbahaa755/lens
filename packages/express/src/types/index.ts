import { Express } from "express";
import { QueryWatcherHandler } from "@lens/watcher-handlers";
import { UserEntry } from "@lens/core";
import { Request } from "express";

export type ExpressAdapterConfig = {
  app: Express;
  appName?: string;
  enabled?: boolean;
  path?: string;
  ignoredPaths?: RegExp[];
  onlyPaths?: RegExp[];
  requestWatcherEnabled?: boolean;
  queryWatcher?: {
    enabled: boolean;
    handler: QueryWatcherHandler;
  };
  isAuthenticated?: (request: Request) => Promise<boolean>;
  getUser?: (request: Request) => Promise<UserEntry>;
};

export type RequiredExpressAdapterConfig = Required<ExpressAdapterConfig> & {
  queryWatcher?: ExpressAdapterConfig["queryWatcher"];
  isAuthenticated?: ExpressAdapterConfig["isAuthenticated"];
  getUser?: ExpressAdapterConfig["getUser"];
};
