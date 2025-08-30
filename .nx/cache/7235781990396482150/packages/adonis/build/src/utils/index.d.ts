import type { ApplicationService } from '@adonisjs/core/types';
import { HttpContext } from '@adonisjs/core/http';
import { LensConfig } from '../define_config.js';
export declare const runningInConsole: (app: ApplicationService) => boolean;
export declare const getRunningCommand: () => string;
export declare function allowedCommands(): boolean;
export declare const shouldIgnoreLogging: (app: ApplicationService) => boolean;
export declare const resolveConfigFromContext: (ctx: HttpContext) => Promise<LensConfig>;
export declare function parseDuration(durationStr: string): number;
