import { SqlLanguage } from "sql-formatter";

export type QueryType = Required<SqlLanguage | "mongodb">;
export type SqlQueryType = Exclude<QueryType, "mongodb">;
export type QueryEntry = {
  data: {
    query: string;
    duration: string;
    createdAt: string;
    type: QueryType;
  };
  requestId?: string;
};

export type UserEntry = {
  id: number | string;
  name: string;
  email: string;
};

export type RequestEntry = {
  request: {
    id: string;
    method: HttpMethod;
    duration: string;
    path: string;
    headers: Record<string, any>;
    body: Record<string, any>;
    status: number;
    ip: string;
    createdAt: string;
  };
  totalQueriesDuration?: string;
  response: {
    json: Record<string, any>;
    headers: Record<string, string>;
  };
  user?: UserEntry | null;
};

export type Entry =
  | { type: "query"; data: QueryEntry }
  | { type: "request"; data: RequestEntry };

export enum WatcherTypeEnum {
  REQUEST = "request",
  QUERY = "query",
}

export type LensConfig = {
  basePath: string;
  appName: string;
  enabled: boolean;
};

export type LensEntry = {
  id: string;
  minimal_data?: Record<string, any>;
  data: Record<string, any>;
  type: WatcherTypeEnum;
  created_at: string;
  lens_entry_id: string | null;
};

export type RouteDefinitionHandler = {
  params: Record<string, any>;
  qs?: Record<string, any>;
};
export type RouteDefinition = {
  method: "GET" | "POST" | "DELETE";
  path: string;
  handler: (data: RouteDefinitionHandler) => any;
};

export type PaginationParams = {
  page: number;
  perPage: number;
};

export type Paginator<T> = {
  meta: {
    total: number;
    lastPage: number;
    currentPage: number;
  };
  data: T;
};

export type ApiResponse<T> = {
  status: number;
  message: string;
  data: T | null;
  meta?: Paginator<T>["meta"];
};

export type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "DELETE"
  | "PATCH"
  | "HEAD"
  | "OPTIONS";
export type RouteHttpMethod = "get" | "post" | "put" | "delete" | "patch";
