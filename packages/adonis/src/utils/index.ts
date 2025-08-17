import type { ApplicationService } from '@adonisjs/core/types'
import { HttpContext } from '@adonisjs/core/http'
import { LensConfig } from '../define_config.js'

export const runningInConsole = (app: ApplicationService) => {
  return ['console', 'repl', 'test'].includes(app.getEnvironment())
}

export const getRunningCommand = () => {
  const cmd = process.env.ACE_CLI_COMMAND

  if (!cmd) {
    throw new Error(
      "Could not determine running command, please set ACE_CLI_COMMAND environment variable in 'start/server.ts file'"
    )
  }

  return cmd
}

export function allowedCommands() {
  const command = getRunningCommand()

  return ['queue:listen', 'schedule:work'].includes(command ?? 'WRONG')
}

export const shouldIgnoreLogging = (app: ApplicationService) => {
  return runningInConsole(app) && !allowedCommands()
}

export const resolveConfigFromContext = async (ctx: HttpContext): Promise<LensConfig> => {
  return await ctx.containerResolver.make('lensConfig')
}

export const shouldIgnoreCurrentPath = async (ctx: HttpContext) => {
  const config = await resolveConfigFromContext(ctx)
  const ignoredPaths: RegExp[] = config.ignoredPaths ?? []
  const onlyPaths: RegExp[] = config.onlyPaths ?? []
  const currentPath = ctx.request.url(false) // e.g. "/lens/requests"

  if (onlyPaths.length > 0) {
    return !onlyPaths.some((pattern) => pattern.test(currentPath))
  }

  return ignoredPaths.some((pattern) => pattern.test(currentPath))
}

export function parseDuration(durationStr: string): number {
  const [value, unit] = durationStr.trim().split(' ')
  const num = parseFloat(value)

  switch (unit) {
    case 'ms':
      return num
    case 's':
      return num * 1000
    case 'μs':
    case 'µs':
      return num / 1000
    case 'ns':
      return num / 1_000_000
    case 'min':
      return num * 60_000
    default:
      return 0
  }
}
