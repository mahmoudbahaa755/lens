import { LensALS, lensEmitter, lensUtils } from "@lens/core";
import { LensWatcherEvents, watcherEmitter } from "../utils/emitter";
import { KyselyQueryType, QueryWatcherHandler } from "../types";

export function createKyselyHandler({
  provider,
}: {
  provider: KyselyQueryType;
}): QueryWatcherHandler {
  const kyselyCallback = ({
    payload,
    store,
  }: {
    payload: LensWatcherEvents["kyselyQuery"];
    store?: LensALS;
  }) => {
    const sql = lensUtils.interpolateQuery(
      payload.query.sql,
      payload.query.parameters as any[],
    );

    lensEmitter.emit("query", {
      query: {
        query: lensUtils.formatSqlQuery(sql, provider),
        duration: `${payload.queryDurationMillis.toFixed(1)} ms`,
        type: provider,
        createdAt: lensUtils.nowISO(),
      },
      store,
    });
  };

  return {
    listen: (s) =>
      watcherEmitter.on("kyselyQuery", (payload) =>
        kyselyCallback({ payload, store: s }),
      ),
    clean: (s) =>
      watcherEmitter.off("kyselyQuery", (payload) =>
        kyselyCallback({ payload, store: s }),
      ),
  };
}
