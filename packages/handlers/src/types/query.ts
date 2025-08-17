import { QueryEntry } from "@lens/core";
import { queryHandlers } from "../query";

export type QueryWatcherHandler = (args: {
  onQuery: (query: QueryEntry["data"]) => Promise<void>;
}) => Promise<void>;

export type QueryHandlerKey = keyof typeof queryHandlers;
export type QueryHandlerMap = {
  [K in keyof typeof queryHandlers]: ReturnType<(typeof queryHandlers)[K]>;
};

type MatchedQueryWatcherHandlerEntry = {
  [K in QueryHandlerKey]: {
    key: K;
    handler: QueryHandlerMap[K];
  };
}[QueryHandlerKey];

export type QueryWatcherHandlerEntry =
  | MatchedQueryWatcherHandlerEntry
  | {
      key?: undefined;
      handler: QueryWatcherHandler;
    };
