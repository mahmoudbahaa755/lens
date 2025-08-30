import { Env } from '@adonisjs/core/env';
export default await Env.create(new URL('../', import.meta.url), {
    NODE_ENV: Env.schema.enum(['development', 'production', 'test']),
    PORT: Env.schema.number(),
    APP_KEY: Env.schema.string(),
    HOST: Env.schema.string({ format: 'host' }),
    LOG_LEVEL: Env.schema.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']),
    LENS_BASE_PATH: Env.schema.string.optional(),
    LENS_ENABLED: Env.schema.boolean.optional(),
    LENS_ENABLE_QUERY_WATCHER: Env.schema.boolean.optional(),
    LENS_ENABLE_REQUEST_WATCHER: Env.schema.boolean.optional()
});
//# sourceMappingURL=env.js.map