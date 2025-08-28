# Query Watcher Handlers

The `@lensjs/watchers` package provides **ready-to-use and customizable handlers** for capturing and processing database queries observed by [`@lensjs/core`](https://www.npmjs.com/package/@lensjs/core).  

These handlers let you **monitor queries (SQL, MongoDB, etc.)** and visualize them directly in the **Lens UI**.

---

## Installation

```bash
npm install @lensjs/watchers
```

---

## Built-in Handlers

This package supports popular ORMs out of the box.  
Pick your integration and plug it into the Lens ecosystem.

### 1. Prisma

Capture queries from **Prisma** with `createPrismaHandler`.

**Dependencies:**

```bash
npm install @prisma/client
```

**Usage Example (Express + Prisma):**

```ts
import express from "express";
import { lens } from "@lensjs/express";
import { createPrismaHandler } from "@lensjs/watchers";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient({ log: ["query"] });

await lens({
  app,
  queryWatcher: {
    enabled: true,
    handler: createPrismaHandler({
      prisma,
      provider: "mysql",
    }),
  },
});
```

---

### 2. Kysely

Capture queries from **Kysely** with `createKyselyHandler`.

**Dependencies:**

```bash
npm install kysely mysql2
```

**Usage Example (Express + Kysely):**

```ts
import express from "express";
import { lens } from "@lensjs/express";
import { Kysely, MysqlDialect } from "kysely";
import mysql from "mysql2";
import { createKyselyHandler, watcherEmitter } from "@lensjs/watchers";

const app = express();

await lens({
  app,
  queryWatcher: {
    enabled: true,
    handler: createKyselyHandler({ 
       provider: "mysql" ,
       logQueryErrorsToConsole: true, // Log query errors to the console, default is true
    }),
  },
});

interface Database {
  user: { name: string };
}

const db = new Kysely<Database>({
  dialect: new MysqlDialect({
    pool: mysql.createPool({
      host: "DB_HOST",
      user: "DB_USER",
      password: "DB_PASSWORD",
      database: "DB_NAME",
    }),
  }),
  log(event) {
    watcherEmitter.emit("kyselyQuery", event);
  },
});
```

---

### 3. Sequelize

Capture queries from **Sequelize** with `createSequelizeHandler`.

**Dependencies:**

```bash
npm install sequelize
```

**Usage Example (Express + Sequelize):**

```ts
import express from "express";
import { lens } from "@lensjs/express";
import { Sequelize } from "sequelize";
import { createSequelizeHandler, watcherEmitter } from "@lensjs/watchers";

const app = express();

await lens({
  app,
  queryWatcher: {
    enabled: true,
    handler: createSequelizeHandler({ provider: "mysql" }),
  },
});

const sequelize = new Sequelize("DB_NAME", "DB_USER", "DB_PASSWORD", {
  host: "localhost",
  dialect: "mysql",
  benchmark: true,
  logQueryParameters: true,
  logging: (sql: string, timing?: number) => {
    watcherEmitter.emit("sequelizeQuery", { sql, timing });
  },
});
```

---

## Custom Handlers

You can create your own handler for unsupported ORMs or raw query clients.

### Handler Essentials

A handler must:

- Return a `QueryWatcherHandler`
- Call `onQuery` whenever a query is captured
- Optionally use `lensUtils`:
  - `interpolateQuery(sql, params)` → inject parameters  
  - `formatSqlQuery(query)` → pretty-print SQL  
  - `now()` → timestamp  

---

### Example: Custom Kysely Handler

```ts
import express from "express";
import { lens } from "@lensjs/express";
import { type QueryWatcherHandler } from "@lensjs/watchers";
import { lensUtils } from "@lensjs/core";
import { Kysely, MysqlDialect } from "kysely";
import mysql from "mysql2";
import Emittery from "emittery";

const app = express();
const eventEmitter = new Emittery();

interface Database {
  users: { name: string };
}

const db = new Kysely<Database>({
  dialect: new MysqlDialect({
    pool: mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    }),
  }),
  log: (event) => {
    eventEmitter.emit("customQuery", event);
  },
});

function customQueryHandler(): QueryWatcherHandler {
  return async ({ onQuery }) => {
    const databaseType = "mysql";

    eventEmitter.on("customQuery", (payload) => {
      onQuery({
        query: lensUtils.formatSqlQuery(
          lensUtils.interpolateQuery(
            payload.query.sql,
            payload.query.parameters as any[],
          ),
          databaseType,
        ),
        duration: `${payload.queryDurationMillis ?? 0} ms`,
        type: databaseType,
        createdAt: lensUtils.nowISO(),
      });
    });
  };
}

await lens({
  app,
  queryWatcher: {
    enabled: true,
    handler: customQueryHandler(),
  },
});
```

---

## Summary

- Use **built-in handlers** for Prisma, Kysely, and Sequelize  
- Or build a **custom handler** for your ORM/client  
- All queries are automatically captured and displayed in the **Lens UI**
