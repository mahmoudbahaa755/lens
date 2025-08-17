import type {
  PaginationParams,
  Paginator,
  LensEntry,
  WatcherTypeEnum,
} from "../types";

export default abstract class Store {
  abstract initialize(): Promise<void>;
  abstract save(entry: {
    id?: string;
    data: Record<string, any>;
    minimal_data?: Record<string, any>;
    type: WatcherTypeEnum;
    timestamp?: string;
    requestId?: string;
  }): Promise<void>;
  abstract getAllRequests(
    paginationParams: PaginationParams,
  ): Promise<Paginator<Omit<LensEntry, "data">[]>>;
  abstract getAllQueries(
    paginationParams: PaginationParams,
  ): Promise<Paginator<LensEntry[]>>;
  abstract allByRequestId(
    requestId: string,
    type: WatcherTypeEnum,
  ): Promise<LensEntry[]>;
  abstract find(type: WatcherTypeEnum, id: string): Promise<LensEntry|null>;
  abstract truncate(): Promise<void>;
  abstract paginate<T>(
    type: WatcherTypeEnum,
    pagination: PaginationParams,
  ): Promise<Paginator<T>>;

  abstract count(type: WatcherTypeEnum): Promise<number>;
}
