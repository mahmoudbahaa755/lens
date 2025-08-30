import type { ApplicationService } from '@adonisjs/core/types';
import { LensConfig } from '../src/define_config.js';
import { QueryEntry } from '@lens/core';
declare module '@adonisjs/core/types' {
    interface ContainerBindings {
        lensConfig: LensConfig;
        queries?: QueryEntry['data'][];
    }
}
export default class LensServiceProvider {
    protected app: ApplicationService;
    constructor(app: ApplicationService);
    boot(): Promise<void>;
}
