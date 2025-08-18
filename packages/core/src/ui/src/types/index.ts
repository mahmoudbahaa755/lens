export type LensConfig = {
  appName: string;
  path: string;
  api: {
    requests: string;
    queries: string;
    truncate: string
  };
};

export type LensEntryType = "request" | "query";

export type PaginationParams = {
  page: number;
  perPage: number;
};

export type PaginatorMeta = {
  total: number;
  lastPage: number;
  currentPage: number;
};

export type Paginator<T> = {
  meta: PaginatorMeta;
  data: PaginatorData<T>;
};

export type PaginatorData<T> = T[];

export type ApiResponse<T> = {
  status: number;
  message: string;
  data: T | null;
  meta?: Paginator<T>["meta"];
};

export type QueryEntry = {
  id: string;
  type: LensEntryType;
  created_at: string;
  lens_entry_id: string | null;
  data: {
    query: string;
    duration: string;
    createdAt: string;
    type: QueryType;
  };
};

export type UserEntry = {
  id: number | string;
  name: string;
  email: string;
};

export type RequestEntry = {
  id: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS";
  duration: string;
  path: string;
  headers: Record<string, string>;
  body: Record<string, any>;
  status: number;
  ip: string;
  createdAt: string;
  totalQueriesDuration?: string;
  response: {
    json: Record<string, any>;
    headers: Record<string, string>;
  };
  user?: UserEntry | null;
};

export type RequestTableEntry = Omit<RequestEntry, "ip" | "headers" | "body">;
export type Queries = QueryEntry;
export type GenericLensEntry<T> = {
  id: string;
  type: LensEntryType;
  created_at: string;
  lens_entry_id: string | null;
  data: T;
  queries: QueryEntry[];
};

export type HasMoreType<T> = {
  data: T[];
  hasMore: boolean;
  loading: boolean;
  loadMore: () => Promise<void>;
};

export type RequestTableRow = GenericLensEntry<RequestTableEntry>;
export type OneRequest = GenericLensEntry<RequestEntry>;
export type QueryTableRow = QueryEntry;
export type OneQuery = GenericLensEntry<QueryEntry>;
export type QueryType = "sql" | "mongodb";
