import { QueryEntry, QueryType, SqlQueryType } from "@lens/core";

export type QueryWatcherHandler = (args: {
  onQuery: (query: QueryEntry["data"]) => Promise<void>;
}) => Promise<void>;

export type PrismaProvider = QueryType;
export type SequelizeQueryType = Extract<
  SqlQueryType,
  "mysql" | "postgresql" | "sqlite" | "mariadb"
>;
export type KyselyQueryType = Extract<
  SqlQueryType,
  "mysql" | "postgresql" | "sqlite" | "mssql"
>;
