import { lensUtils } from "@lens/core";
import { QueryWatcherHandler } from "../types";
import { watcherEmitter } from "../utils/emitter";

export function createKyselyHandler(): QueryWatcherHandler {
  return async ({ onQuery }) => {
    watcherEmitter.on("kyselyQuery", async (payload) => {
      const sql = lensUtils.interpolateQuery(
        payload.event.query.sql,
        payload.event.query.parameters as any[],
      );

      await onQuery({
        query: lensUtils.formatSqlQuery(sql),
        duration: `${payload.event.queryDurationMillis.toFixed(1)} ms`,
        type: "sql",
        createdAt: payload.date,
      });
    });
  };
}
