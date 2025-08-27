# lens

Lens is a powerful debugging tool for your Node.js applications. It provides a beautiful and intuitive UI to inspect requests, database queries, and more, right from your browser.

## Key Features

- **Framework Adapters:** Out-of-the-box support for Express and AdonisJS.
- **Request Inspection:** Inspect incoming requests, their headers, and bodies.
- **Query Monitoring:** Monitor database queries and their execution time.
- **Extensible:** Create your own watchers to monitor other aspects of your application.
- **Easy to Integrate:** Get started with a few lines of code.

## Packages

This repository is a monorepo managed with Lerna and contains the following packages:

| Package                  | Description                                                   |
| ------------------------ | ------------------------------------------------------------- |
| `@lens/core`             | The core package that provides the UI and main functionality. |
| `@lens/express-adapter`  | An adapter for Express applications.                          |
| `@lens/adonis-adapter`   | An adapter for AdonisJS applications.                         |
| `@lens/watcher-handlers` | Handlers for the watchers.                                    |
| `example-express`        | An example Express application using lens.                    |
| `example-adonis`         | An example AdonisJS application using lens.                   |

## Getting Started

To get started with the project, follow these steps:

1.  **Install dependencies:**

    ```bash
    npm install
    ```

    or if you are using bun

    ```bash
    bun install
    ```

2.  **Run in development mode:**

    ```bash
    npm run dev
    ```

## Documentation

You can find the official documentation [here](https://lensjs.vercel.app/).

## Contributing

We welcome contributions from the community! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) to learn how you can get involved.
