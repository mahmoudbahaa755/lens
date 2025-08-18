import { configProvider } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import { UserEntry } from '../../core/dist/types/index.js'

export type LensConfig = {
  appName: string
  path: string
  enabled: boolean
  ignoredPaths: RegExp[]
  onlyPaths: RegExp[]
  watchers: {
    requests: boolean
    queries: boolean
  },
  isAuthenticated?: (ctx: HttpContext) => Promise<boolean>,
  getUser?: (ctx: HttpContext) => Promise<UserEntry>,
}

export function defineConfig(config: LensConfig) {
  return configProvider.create(async () => {
    return config
  })
}
