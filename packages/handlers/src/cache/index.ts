import { CacheEntry, lensContext, lensEmitter } from "@lensjs/core";
import { nowISO } from "@lensjs/date";

export const emitCacheEvent = (payload: Omit<CacheEntry, "requestId" | 'createdAt'>) => {
  lensEmitter.emit("cache", {
    action: payload.action,
    createdAt: nowISO(),
    data: payload.data,
    requestId: lensContext.getStore()?.requestId,
  });
};
