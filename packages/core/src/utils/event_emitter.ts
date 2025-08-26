import { AsyncResource } from "node:async_hooks";
import { QueryEntry } from "../types";
import Emittery from "emittery";

interface CoreEvents {
  query: { query: QueryEntry["data"] };
}

export const createEmittery = <T extends Record<string, any>>() => {
  return new Emittery<T>();
};
export const lensResource = new AsyncResource("lens-emitter");
export const lensEmitter = new Emittery<CoreEvents>();
