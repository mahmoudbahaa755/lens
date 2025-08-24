import { LensALS, QueryType, SqlQueryType } from "@lens/core";

type ListenerCallback = (store?: LensALS) => void;

export type WatcherHandler = {
  listen: ListenerCallback;
  clean: ListenerCallback;
};

export type QueryWatcherHandler = WatcherHandler;
export type PrismaProvider = QueryType;
export type SequelizeQueryType = Extract<
  SqlQueryType,
  "mysql" | "postgresql" | "sqlite" | "mariadb"
>
export type KyselyQueryType = Extract<
  SqlQueryType,
  "mysql" | "postgresql" | "sqlite" | "mssql"
>;
