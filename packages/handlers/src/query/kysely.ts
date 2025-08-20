import { lensUtils, SqlQueryType } from "@lens/core";
import { QueryWatcherHandler } from "../types";
import { watcherEmitter } from "../utils/emitter";

export type KyselyQueryType = Extract<
  SqlQueryType,
  "mysql" | "postgresql" | "sqlite" | "mssql"
>;
export function createKyselyHandler({
  provider,
}: {
  provider: KyselyQueryType;
}): QueryWatcherHandler {
  return async ({ onQuery }) => {
    watcherEmitter.on("kyselyQuery", async (payload) => {
      const sql = lensUtils.interpolateQuery(
        payload.event.query.sql,
        payload.event.query.parameters as any[],
      );

      await onQuery({
        query: lensUtils.formatSqlQuery(sql, provider),
        duration: `${payload.event.queryDurationMillis.toFixed(1)} ms`,
        type: provider,
        createdAt: payload.date,
      });
    });
  };
}
