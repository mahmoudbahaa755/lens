import { lensUtils } from "@lens/core";
import { watcherEmitter } from "../utils/emitter";
import { KyselyQueryType, QueryWatcherHandler } from "../types";
import { LogEvent } from "kysely";

function getQueryObject({
  provider,
  payload,
}: {
  provider: KyselyQueryType;
  payload: LogEvent;
}) {
  const sql = lensUtils.interpolateQuery(
    payload.query.sql,
    payload.query.parameters,
  );

  return {
    query: lensUtils.formatSqlQuery(sql, provider),
    duration: `${payload.queryDurationMillis.toFixed(1)} ms`,
    type: provider,
    createdAt: lensUtils.nowISO(),
  };
}

export function createKyselyHandler({
  provider,
  logQueryErrorsToConsole = true,
}: {
  provider: KyselyQueryType;
  logQueryErrorsToConsole?: boolean;
}): QueryWatcherHandler {
  return async ({ onQuery }) => {
    watcherEmitter.on("kyselyQuery", (payload) => {
      if (payload.level === "error") {
        if (logQueryErrorsToConsole) {
          console.error({
            error: payload.error,
            ...getQueryObject({ provider, payload }),
          });
        }

        return;
      }

      onQuery(getQueryObject({ provider, payload }));
    });
  };
}
