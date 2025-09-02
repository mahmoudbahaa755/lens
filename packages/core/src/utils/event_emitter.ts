import Emittery from "emittery";
import { CacheEntry } from "../types";

export const createEmittery = <T extends Record<string, any>>() => {
  return new Emittery<T>();
};

export const lensEmitter = createEmittery<{
    cache: CacheEntry
}>()
