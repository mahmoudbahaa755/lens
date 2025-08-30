import { configProvider } from '@adonisjs/core';
import { RuntimeException } from '@poppinss/utils';
import { Lens, lensUtils, RequestWatcher, QueryWatcher } from '@lens/core';
import AdonisAdapter from '../src/adapter.js';
export default class LensServiceProvider {
    app;
    constructor(app) {
        this.app = app;
    }
    async boot() {
        const lensConfigProvider = this.app.config.get('lens');
        const config = await configProvider.resolve(this.app, lensConfigProvider);
        if (!config) {
            throw new RuntimeException('Invalid "config/lens.ts" file. Make sure you are using the "defineConfig" method');
        }
        const { normalizedPath, ignoredPaths } = lensUtils.prepareIgnoredPaths(config.path, config.ignoredPaths);
        config.ignoredPaths = ignoredPaths;
        this.app.container.bindValue('lensConfig', config);
        this.app.booted(async () => {
            const watchersMap = {
                requests: new RequestWatcher(),
                queries: new QueryWatcher(),
            };
            const allowedWatchers = Object.keys(config.watchers)
                .filter((watcher) => config.watchers[watcher])
                .map((watcher) => watchersMap[watcher])
                .filter((watcher) => !!watcher);
            const adapter = new AdonisAdapter({ app: this.app })
                .setConfig(config)
                .setIgnoredPaths(ignoredPaths)
                .setOnlyPaths(config.onlyPaths);
            await Lens.setWatchers(allowedWatchers).setAdapter(adapter).start({
                basePath: normalizedPath,
                enabled: config.enabled,
                appName: config.appName,
            });
        });
    }
}
