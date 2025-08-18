import { lensUtils } from "@lens/core";
import { QueryWatcherHandler } from "../types";
import { watcherEmitter } from "../utils/emitter";

function normalizeSql(sql: string) {
  return sql.replace(/^Executed \(default\):\s*/, "");
}

export function createSequelizeHandler(): QueryWatcherHandler {
  return async ({ onQuery }) => {
    watcherEmitter.on("sequelizeQuery", async (payload) => {
      if (typeof payload.sql !== "string") {
        throw new Error("payload.sql must be a string");
      }

      if (typeof payload.timing !== "number") {
        throw new Error("payload.timing must be a number");
      }

      const queryWithParams = normalizeSql(payload.sql);
      const hasParams = queryWithParams.includes(";");
      const sql = hasParams
        ? queryWithParams.substring(0, queryWithParams.indexOf(";"))
        : queryWithParams;
      const params = hasParams
        ? queryWithParams.substring(queryWithParams.indexOf(";") + 1).split(",").map(item => JSON.parse(item))
        : [];

      await onQuery({
        query: lensUtils.formatSqlQuery(
          lensUtils.interpolateQuery(sql, params),
        ),
        duration: `${payload.timing.toFixed(1)} ms`,
        type: "sql",
        createdAt: `${new Date().toISOString()}`,
      });
    });
  };
}
