import { RouteDefinition, LensAdapter, RequestWatcher, QueryWatcher } from '@lens/core';
import type { ApplicationService, EmitterService, HttpRouterService } from '@adonisjs/core/types';
import { LensConfig } from './define_config.js';
export default class AdonisAdapter extends LensAdapter {
    protected app: ApplicationService;
    protected router: HttpRouterService;
    protected emitter: EmitterService;
    protected isRequestWatcherEnabled: boolean;
    protected queryWatcher?: QueryWatcher;
    protected config: LensConfig;
    constructor({ app }: {
        app: ApplicationService;
    });
    setup(): void;
    setConfig(config: LensConfig): this;
    registerRoutes(routes: RouteDefinition[]): void;
    protected watchRequests(requestWatcher: RequestWatcher): void;
    protected watchQueries(queryWatcher: QueryWatcher): Promise<void>;
    serveUI(uiPath: string, spaRoute: string, _dataToInject: Record<string, any>): void;
    private matchStaticFiles;
    private calculateQueriesDuration;
    private getUserFromContext;
}
