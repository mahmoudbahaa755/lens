import {
  CacheWatcher,
  Lens,
  lensUtils,
  LensWatcher,
  QueryWatcher,
  RequestWatcher,
} from "@lensjs/core";
import { ExpressAdapterConfig, RequiredExpressAdapterConfig } from "./types";
import ExpressAdapter from "./adapter";

const defaultConfig = {
  appName: "Lens",
  enabled: true,
  path: "/lens",
  ignoredPaths: [],
  onlyPaths: [],
  requestWatcherEnabled: true,
  cacheWatcherEnabled: false,
};

export const lens = async (config: ExpressAdapterConfig) => {
  const adapter = new ExpressAdapter({ app: config.app });
  const watchers: LensWatcher[] = [];
  const mergedConfig = {
    ...defaultConfig,
    ...config,
  } as RequiredExpressAdapterConfig;

  const defaultWatchers = [
    {
      enabled: mergedConfig.requestWatcherEnabled,
      watcher: new RequestWatcher(),
    },
    {
      enabled: mergedConfig.cacheWatcherEnabled,
      watcher: new CacheWatcher(),
    },
    {
      enabled: mergedConfig.queryWatcher?.enabled,
      watcher: new QueryWatcher(),
    },
  ];

  defaultWatchers.forEach((watcher) => {
    if (watcher.enabled) {
      watchers.push(watcher.watcher);
    }
  });

    console.log('currentWatchers', watchers)

  const { ignoredPaths, normalizedPath } = lensUtils.prepareIgnoredPaths(
    mergedConfig.path,
    mergedConfig.ignoredPaths,
  );

  adapter
    .setConfig(mergedConfig)
    .setIgnoredPaths(ignoredPaths)
    .setOnlyPaths(mergedConfig.onlyPaths);

  await Lens.setAdapter(adapter).setWatchers(watchers).start({
    appName: mergedConfig.appName,
    enabled: mergedConfig.enabled,
    basePath: normalizedPath,
  });
};
