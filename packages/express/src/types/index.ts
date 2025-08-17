import { QueryWatcherHandlerEntry } from "@lens/watcher-handlers";
import { Express } from "express";

export type ExpressAdapterConfig = {
  app: Express;
  appName?: string;
  enabled?: boolean;
  path?: string;
  ignoredPaths?: RegExp[];
  onlyPaths?: RegExp[];
  queryWatcher: {
    enabled: boolean;
  } & QueryWatcherHandlerEntry;
};

export type RequiredExpressAdapterConfig = Required<ExpressAdapterConfig>;
