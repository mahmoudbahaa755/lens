# @lensjs/nestjs

NestJS adapter for Lens. This package provides a module and interceptor to seamlessly integrate the Lens monitoring and debugging tool into your NestJS applications. It enables automatic logging of requests, database queries, and cache events within the NestJS ecosystem.

## Features

- **`LensModule`**: A NestJS module that registers the Lens configuration and initializes the Lens core with NestJS-specific adapters and watchers during the application bootstrap process.
- **`NestJSAdapter` class**: Extends `LensAdapter` from `@lensjs/core`, providing NestJS-specific implementations for handling HTTP requests, route registration, and serving the Lens UI.
- **`defineConfig` function**: A helper to define the Lens configuration, ensuring type safety and proper resolution.
- **`LensInterceptor`**: A NestJS interceptor that generates a unique `requestId` for each incoming HTTP request, allowing all subsequent events (queries, cache) within that request's lifecycle to be correlated.
- **Request Watching**: Captures detailed information about HTTP requests, including method, URL, headers, body, status code, duration, and associated user (if configured).
- **Query Watching**: Can be configured to monitor database queries (implementation depends on your ORM choice: TypeORM, Prisma, etc.).
- **Cache Watching**: Can be configured to monitor cache operations (implementation depends on your cache manager choice).

## Installation

```bash
npm install @lensjs/nestjs @lensjs/core
# or
yarn add @lensjs/nestjs @lensjs/core
# or
pnpm add @lensjs/nestjs @lensjs/core
```

## Usage

### 1. Create Lens Configuration

Create a lens configuration file (e.g., `src/config/lens.config.ts`):

```typescript
import { defineConfig } from "@lensjs/nestjs";

export const lensConfig = defineConfig({
  appName: "My NestJS App",
  enabled: process.env.NODE_ENV !== "production",
  path: "lens",
  ignoredPaths: [/\/health$/, /\/metrics$/],
  onlyPaths: [],
  watchers: {
    requests: true,
    cache: true,
    queries: {
      enabled: true,
      provider: "postgresql", // or 'mysql', 'sqlite', etc.
    },
  },
  // Optional: Authenticate users for the Lens dashboard
  isAuthenticated: async (context) => {
    // Implementation depends on your auth system
    return true;
  },
  // Optional: Get user information for request logging
  getUser: async (context) => {
    // Implementation depends on your auth system
    return {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
    };
  },
});
```

### 2. Register the Lens Module

In your `app.module.ts`:

```typescript
import { Module } from "@nestjs/common";
import { LensModule } from "@lensjs/nestjs";
import { lensConfig } from "./config/lens.config";

@Module({
  imports: [
    LensModule.forRoot({
      config: lensConfig,
      global: true, // Optional: makes Lens available globally
    }),
    // ... other modules
  ],
})
export class AppModule {}
```

### 3. Apply the Lens Interceptor (Optional)

For automatic request logging, apply the `LensInterceptor` globally in your `main.ts`:

```typescript
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { LensInterceptor } from "@lensjs/nestjs";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Apply Lens interceptor globally
  app.useGlobalInterceptors(new LensInterceptor());

  await app.listen(3000);
}
bootstrap();
```

### 4. Initialize Lens

In your `main.ts`, after creating the NestJS application:

```typescript
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Lens, RequestWatcher, QueryWatcher, CacheWatcher } from "@lensjs/core";
import { NestJSAdapter } from "@lensjs/nestjs";
import { lensConfig } from "./config/lens.config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Initialize Lens
  const adapter = new NestJSAdapter({ app }).setConfig(lensConfig);

  const watchers = [];
  if (lensConfig.watchers.requests) {
    watchers.push(new RequestWatcher());
  }
  if (lensConfig.watchers.queries.enabled) {
    watchers.push(new QueryWatcher());
  }
  if (lensConfig.watchers.cache) {
    watchers.push(new CacheWatcher());
  }

  await Lens.setWatchers(watchers).setAdapter(adapter).start({
    basePath: lensConfig.path,
    enabled: lensConfig.enabled,
    appName: lensConfig.appName,
  });

  await app.listen(3000);
}
bootstrap();
```

## Configuration Options

The `defineConfig` function accepts a configuration object with the following properties:

- **`appName`** (string): The name of your application displayed in the Lens dashboard.
- **`enabled`** (boolean): Whether Lens monitoring is enabled.
- **`path`** (string): The base path where the Lens dashboard will be served (e.g., `lens` makes it available at `/lens`).
- **`ignoredPaths`** (RegExp[]): Array of regex patterns for paths that should be ignored by Lens.
- **`onlyPaths`** (RegExp[]): Array of regex patterns for paths that should be monitored by Lens (if specified, only these paths will be monitored).
- **`watchers`**: Configuration for different types of watchers:
  - **`requests`** (boolean): Enable/disable HTTP request monitoring.
  - **`queries`**: Database query monitoring configuration:
    - **`enabled`** (boolean): Enable/disable query monitoring.
    - **`provider`** (string): Database type (`postgresql`, `mysql`, `sqlite`, `mongodb`, etc.).
  - **`cache`** (boolean): Enable/disable cache operation monitoring.
- **`isAuthenticated`** (function, optional): Async function that determines if a user is authenticated for accessing the Lens dashboard.
- **`getUser`** (function, optional): Async function that returns user information for request logging.

## Database Query Monitoring

Query monitoring depends on your ORM choice. Here are examples for popular ORMs:

### TypeORM

```typescript
// In your TypeORM configuration
import { QueryWatcher } from "@lensjs/core";

// You'll need to implement query logging in your TypeORM configuration
// This is a conceptual example - implementation may vary
```

### Prisma

```typescript
// Using Prisma's middleware
import { PrismaClient } from "@prisma/client";
import { QueryWatcher } from "@lensjs/core";

const prisma = new PrismaClient();

prisma.$use(async (params, next) => {
  const start = Date.now();
  const result = await next(params);
  const duration = Date.now() - start;

  // Log query to Lens (implementation needed)

  return result;
});
```

## Cache Monitoring

Cache monitoring implementation depends on your cache manager:

```typescript
// Example with @nestjs/cache-manager
import { CacheWatcher } from "@lensjs/core";

// You'll need to implement cache event logging in your cache configuration
```

## Accessing the Dashboard

Once configured, the Lens dashboard will be available at:

- `http://localhost:3000/lens` (or whatever base path you configured)

The dashboard provides:

- **Requests**: View all HTTP requests with details like duration, status, headers, and body
- **Queries**: Monitor database queries with execution time and query details
- **Cache**: Track cache operations (hits, misses, writes, deletes)

## Examples

Check out the complete examples in the [examples directory](./examples) for different NestJS setups:

- Basic NestJS application
- NestJS with TypeORM
- NestJS with Prisma
- NestJS with authentication

## Contributing

Contributions are welcome! Please read our [contributing guide](../../CONTRIBUTING.md) for details.

## License

MIT License - see [LICENSE](./LICENSE.md) for details.
