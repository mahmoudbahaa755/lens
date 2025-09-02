import { configProvider } from '@adonisjs/core'
import { RuntimeException } from '@poppinss/utils'
import type { ApplicationService } from '@adonisjs/core/types'
import { LensConfig } from '../src/define_config.js'
import { QueryEntry, Lens, lensUtils, RequestWatcher, QueryWatcher, CacheWatcher } from '@lensjs/core'
import AdonisAdapter from '../src/adapter.js'

declare module '@adonisjs/core/types' {
  interface ContainerBindings {
    lensConfig: LensConfig
    queries?: QueryEntry['data'][]
  }
}

export default class LensServiceProvider {
  constructor(protected app: ApplicationService) {}

  async boot() {
    const lensConfigProvider = this.app.config.get<any>('lens')

    const config = await configProvider.resolve<LensConfig>(this.app, lensConfigProvider)

    if (!config) {
      throw new RuntimeException(
        'Invalid "config/lens.ts" file. Make sure you are using the "defineConfig" method'
      )
    }

    const { normalizedPath, ignoredPaths } = lensUtils.prepareIgnoredPaths(
      config.path,
      config.ignoredPaths
    )
    config.ignoredPaths = ignoredPaths

    this.app.container.bindValue('lensConfig', config)
    this.app.booted(async () => {
      const watchersMap = {
        requests: new RequestWatcher(),
        queries: new QueryWatcher(),
        cache: new CacheWatcher(),
      }

      const allowedWatchers = Object.keys(config.watchers)
        .filter((watcher) => config.watchers[watcher as keyof typeof config.watchers])
        .map((watcher) => watchersMap[watcher as keyof typeof watchersMap])
        .filter((watcher) => !!watcher)

      const adapter = new AdonisAdapter({ app: this.app })
        .setConfig(config)
        .setIgnoredPaths(ignoredPaths)
        .setOnlyPaths(config.onlyPaths)

      await Lens.setWatchers(allowedWatchers).setAdapter(adapter).start({
        basePath: normalizedPath,
        enabled: config.enabled,
        appName: config.appName,
      })
    })
  }
}
