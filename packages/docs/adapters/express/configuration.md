# Express Adapter Configuration

The `lens` function accepts a single configuration object that controls how Lens integrates with your Express app.  
This guide provides a clear reference and practical examples to help you set it up quickly.

## Example: Prisma Query Watcher

Here’s how to enable query watching with **Prisma**:

```ts
import { lens } from "@lens/express-adapter";
import { createPrismaHandler } from "@lens/watcher-handlers";
import { PrismaClient } from "@prisma/client";
import express from "express";

const app = express();
const prisma = new PrismaClient({ log: ["query"] });

await lens({
  app,
  path: "/lens", // Dashboard available at http://localhost:3000/lens
  appName: "My Express App",
  queryWatcher: {
    enabled: true, // Enable query watching
    handler: createPrismaHandler({
      prisma,
      provider: "mysql"
  },
});
```

---

## Complete Example: Full Configuration

This snippet shows **all available options**, with inline comments:

```ts
import express from "express";
import { lens } from "@lens/express-adapter";
import { createPrismaHandler } from "@lens/watcher-handlers";
import { PrismaClient } from "@prisma/client";
import { DefaultDatabaseStore } from "@lens/store"; // Example store implementation

const app = express();
const prisma = new PrismaClient({ log: ["query"] });

await lens({
  // (Required) Your Express app instance
  app,

  // (Required) Query watcher configuration
  queryWatcher: {
    enabled: true, // Enable query watching
    handler: createPrismaHandler({
      prisma,
      provider: "mysql",
    }),
  },
  // (Optional) Enable request watcher (default: true)
  requestWatcherEnabled: true,

  // (Optional) Path for the Lens dashboard
  path: "/lens", // Default: "/lens"

  // (Optional) Display name for your app in the dashboard
  appName: "My Express App", // Default: "Lens"

  // (Optional) Store implementation (default: BetterSqliteStore)
  store: new DefaultDatabaseStore(),

  // (Optional) Paths to ignore
  ignoredPaths: [/^\/health/, /^\/metrics/],

  // (Optional) Paths to exclusively watch
  onlyPaths: [/^\/api/],

  // (Optional) Authentication check before accessing Lens
  isAuthenticated: async (req) => {
    const jwtToken = req.headers["authorization"]?.split(" ")[1];
    return jwtToken === getValidJwtToken(jwtToken, jwtSecret);
  },

  // (Optional) Attach user information to Lens events/logs
  getUser: async (req) => {
    return {
      id: "123",
      name: "Jane Doe",
      email: "jane@example.com",
    };
  },
});
```
