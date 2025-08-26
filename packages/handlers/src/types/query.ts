import { QueryEntry } from "@lens/core";

export type QueryWatcherHandler = (args: {
  onQuery: (query: QueryEntry["data"]) => Promise<void>;
}) => Promise<void>;
