import { AsyncLocalStorage } from "node:async_hooks";
import { QueryEntry } from "../types";

export type LensALS = {
  lensEntry: {
    requestId: string;
    queries: QueryEntry["data"][];
  };
};

export const lensContext = new AsyncLocalStorage<LensALS>();
export const getContextQueries = () => {
  const context = lensContext.getStore();
  return context?.lensEntry?.queries;
};
