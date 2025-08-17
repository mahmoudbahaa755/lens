import type Watcher from "../core/watcher";
import type { RouteDefinition } from "../types";

export default abstract class Adapter {
  private watchers: Watcher[] = [];
  protected ignoredPaths: RegExp[] = [];
  protected onlyPaths: RegExp[] = [];

  abstract setup(): void;

  setWatchers(watchers: Watcher[]) {
    this.watchers = watchers;
    return this;
  }

  setIgnoredPaths(paths: RegExp[]) {
    this.ignoredPaths = paths;
    return this;
  }

  setOnlyPaths(paths: RegExp[]) {
    this.onlyPaths = paths;
    return this;
  }

  getWatchers() {
    return this.watchers;
  }

  abstract registerRoutes(routes: RouteDefinition[]): void;
  abstract serveUI(
    uiPath: string,
    spaRoute: string,
    dataToInject: Record<string, any>,
  ): void;
}
