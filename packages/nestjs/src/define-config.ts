// Define types locally to avoid core dependency issues during build
type QueryType =
  | "postgresql"
  | "mysql"
  | "sqlite"
  | "mariadb"
  | "plsql"
  | "transactsql"
  | "mongodb";

type UserEntry = {
  id: string | number;
  name?: string;
  email?: string;
  [key: string]: any;
};

type NestJSQueryType = Extract<
  QueryType,
  | "postgresql"
  | "sqlite"
  | "mysql"
  | "mariadb"
  | "plsql"
  | "transactsql"
  | "mongodb"
>;

export type LensConfig = {
  appName: string;
  path: string;
  enabled: boolean;
  ignoredPaths: RegExp[];
  onlyPaths: RegExp[];
  watchers: {
    queries: {
      enabled: boolean;
      provider: NestJSQueryType;
    };
    cache: boolean;
    requests: boolean;
  };
  isAuthenticated?: (context: any) => Promise<boolean>;
  getUser?: (context: any) => Promise<UserEntry>;
};

export function defineConfig(config: LensConfig): LensConfig {
  return config;
}
