import { configProvider } from '@adonisjs/core';
export function defineConfig(config) {
    return configProvider.create(async () => {
        return config;
    });
}
