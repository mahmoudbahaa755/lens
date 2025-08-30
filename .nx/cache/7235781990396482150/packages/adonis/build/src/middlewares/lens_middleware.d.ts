import type { HttpContext } from '@adonisjs/core/http';
import type { NextFn } from '@adonisjs/core/types/http';
import { LensALS } from '@lens/core';
declare module '@adonisjs/core/http' {
    interface Request {
        lensEntry?: LensALS['lensEntry'];
    }
}
export default class LensMiddleware {
    handle(ctx: HttpContext, next: NextFn): Promise<any>;
}
