# Express Adapter

The **Express adapter** integrates LensJS into your Express app.

---

## 1. Install Packages

Install the Express adapter:

```bash
npm install @lensjs/express
```

👉 If you want to use pre-built watcher handlers (e.g., Prisma), also install:

```bash
npm install @lensjs/watchers
```

---

## 2. Minimal Setup (with Prisma Query Watcher)

Since the query watcher is required, here’s a minimal setup using Prisma:

```ts
import { lens } from "@lensjs/express";
import express from "express";

const app = express();
const port = 3000;

await lens({ app });

app.get("/hello-world", async (_req, res) => {
  res.send("Hello world!");
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
```

### ✅ Try it out
1. Start your app.  
2. Visit `http://localhost:3000/hello-world` → logs a request + query.  
3. Visit `http://localhost:3000/lens` → open the Lens dashboard.  

---

## 3. Next Steps

- Explore more options in the [Configuration Guide](./configuration.md)  
