import { QueryWatcherHandlerEntry } from "@lens/watcher-handlers";
import { Express, Request} from "express";
import { UserEntry } from "@lens/core";

export type ExpressAdapterConfig = {
  app: Express;
  appName?: string;
  enabled?: boolean;
  path?: string;
  ignoredPaths?: RegExp[];
  onlyPaths?: RegExp[];
  requestWatcherEnabled?: boolean;
  queryWatcher: {
    enabled: boolean;
  } & QueryWatcherHandlerEntry;
};

export type RequiredExpressAdapterConfig = Required<ExpressAdapterConfig> & {
    isAuthenticated?: (request: Request) => Promise<boolean>;
    getUser?: (request: Request) => Promise<UserEntry>;
};
