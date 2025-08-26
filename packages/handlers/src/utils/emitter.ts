import { LogEvent } from "kysely";
import { createEmittery } from "@lens/core";

export interface LensWatcherEvents {
  kyselyQuery: LogEvent;
  sequelizeQuery: { sql: string; timing?: number };
}
export const watcherEmitter = createEmittery<LensWatcherEvents>();
