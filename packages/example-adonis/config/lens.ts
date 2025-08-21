import env from '#start/env'
import { defineConfig } from '@lens/adonis-adapter'

const lensConfig = defineConfig({
  appName: env.get('APP_NAME', 'Zeppy'),
  enabled: env.get('LENS_ENABLED', true),
  path: env.get('LENS_BASE_PATH', 'lens'),
  ignoredPaths: [],
  onlyPaths: [],
  watchers: {
    requests: env.get('LENS_ENABLE_REQUEST_WATCHER', true),
    queries: {
      enabled: env.get('LENS_ENABLE_QUERY_WATCHER', true),
      provider: 'sqlite', // Change to your database provider
    }
  },
  // Optional
  isAuthenticated: async (ctx) => {
    return await ctx.auth?.check()
  },
  // Optional
  getUser: async (ctx) => {
    const user = ctx.auth?.user

    if (!user) {
      return null
    }

    return {
      id: user.$primaryKeyValue,
      name: user.name,
      email: user.email,
    }
  },
})

export default lensConfig
