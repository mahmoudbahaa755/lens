import { lensUtils } from "@lens/core";
import { watcherEmitter } from "../utils/emitter";
import { KyselyQueryType, QueryWatcherHandler } from "../types";

export function createKyselyHandler({
  provider,
}: {
  provider: KyselyQueryType;
}): QueryWatcherHandler {
  return async ({ onQuery }) => {
    watcherEmitter.on("kyselyQuery", (payload) => {
      const sql = lensUtils.interpolateQuery(
        payload.query.sql,
        payload.query.parameters as any[],
      );

      onQuery({
        query: lensUtils.formatSqlQuery(sql, provider),
        duration: `${payload.queryDurationMillis.toFixed(1)} ms`,
        type: provider,
        createdAt: lensUtils.nowISO(),
      });
    });
  };
}
