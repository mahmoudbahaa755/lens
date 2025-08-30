import { lensContext, lensUtils } from '@lens/core';
export default class LensMiddleware {
    async handle(ctx, next) {
        const lensEntry = {
            queries: [],
            requestId: lensUtils.generateRandomUuid(),
        };
        return lensContext.run({ lensEntry }, async () => {
            ctx.request.lensEntry = lensEntry;
            return await next();
        });
    }
}
