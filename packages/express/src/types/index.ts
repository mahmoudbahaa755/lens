import { QueryWatcherHandler } from "@lens/watcher-handlers";
import { Express, Request } from "express";
import { UserEntry } from "@lens/core";

export type ExpressWatcherHandlers = {
  query?: {
    enabled?: boolean;
    handler?: QueryWatcherHandler;
  };
};

export type ExpressAdapterConfig = {
  app: Express;
  appName?: string;
  enabled?: boolean;
  path?: string;
  ignoredPaths?: RegExp[];
  onlyPaths?: RegExp[];
  requestWatcherEnabled?: boolean;
  handlers?: ExpressWatcherHandlers;
};

export type RequiredExpressAdapterConfig = Required<
  Omit<ExpressAdapterConfig, "handlers">
> & {
  isAuthenticated?: (request: Request) => Promise<boolean>;
  getUser?: (request: Request) => Promise<UserEntry>;
  handlers?: ExpressAdapterConfig["handlers"];
};
