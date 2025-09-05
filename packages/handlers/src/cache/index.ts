import { CacheEntry, lensContext, lensEmitter } from "@lensjs/core";
import { nowISO } from "@lensjs/date";

export const emitCacheEvent = (data: Omit<CacheEntry, "requestId" | 'createdAt'>) => {
  lensEmitter.emit("cache", {
    action: data.action,
    createdAt: nowISO(),
    data: "value" in data ? (data.value as any) : {},
    requestId: lensContext.getStore()?.requestId,
  });
};
