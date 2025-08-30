export const runningInConsole = (app) => {
    return ['console', 'repl', 'test'].includes(app.getEnvironment());
};
export const getRunningCommand = () => {
    const cmd = process.env.ACE_CLI_COMMAND;
    if (!cmd) {
        throw new Error("Could not determine running command, please set ACE_CLI_COMMAND environment variable in 'start/server.ts file'");
    }
    return cmd;
};
export function allowedCommands() {
    const command = getRunningCommand();
    return ['queue:listen', 'schedule:work'].includes(command ?? 'WRONG');
}
export const shouldIgnoreLogging = (app) => {
    return runningInConsole(app) && !allowedCommands();
};
export const resolveConfigFromContext = async (ctx) => {
    return await ctx.containerResolver.make('lensConfig');
};
export function parseDuration(durationStr) {
    const [value, unit] = durationStr.trim().split(' ');
    const num = parseFloat(value);
    switch (unit) {
        case 'ms':
            return num;
        case 's':
            return num * 1000;
        case 'μs':
        case 'µs':
            return num / 1000;
        case 'ns':
            return num / 1_000_000;
        case 'min':
            return num * 60_000;
        default:
            return 0;
    }
}
