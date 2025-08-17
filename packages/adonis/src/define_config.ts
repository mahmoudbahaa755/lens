import { configProvider } from '@adonisjs/core'
import { LensWatcher } from '@lens/core'

export type LensConfig = {
  appName: string
  path: string
  enabled: boolean
  ignoredPaths: RegExp[]
  onlyPaths: RegExp[]
  watchers: {
    enabled: boolean
    class: LensWatcher
  }[]
}

export function defineConfig(config: LensConfig) {
  return configProvider.create(async () => {
    return config
  })
}
