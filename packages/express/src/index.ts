import {
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
};

export const lens = async (config: ExpressAdapterConfig) => {
  const adapter = new ExpressAdapter({ app: config.app });
  const watchers: LensWatcher[] = [];
  const mergedConfig = {
    ...config,
    ...defaultConfig,
  } as RequiredExpressAdapterConfig;

  if (mergedConfig.requestWatcherEnabled) {
    watchers.push(new RequestWatcher());
  }

  if (mergedConfig.queryWatcher?.enabled) {
    watchers.push(new QueryWatcher());
  }

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
