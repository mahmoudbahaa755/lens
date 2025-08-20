import { configProvider } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { QueryType, UserEntry } from '../../core/dist/types/index.js'

type AdonisQueryType = Extract<
  QueryType,
  "postgresql" | "sqlite" | "mysql" | "mariadb" | "plsql" | "transactsql"
>;

export type LensConfig = {
  appName: string
  path: string
  enabled: boolean
  ignoredPaths: RegExp[]
  onlyPaths: RegExp[]
  watchers: {
    queries: {
      enabled: boolean
      provider: AdonisQueryType
    }
    requests: boolean
  },
  isAuthenticated?: (ctx: HttpContext) => Promise<boolean>,
  getUser?: (ctx: HttpContext) => Promise<UserEntry>,
}

export function defineConfig(config: LensConfig) {
  return configProvider.create(async () => {
    return config
  })
}
