# Contributing to lens

First off, thank you for considering contributing to lens! It's people like you that make lens such a great tool.

## How Can I Contribute?

### Reporting Bugs

If you find a bug, please open an issue on our [GitHub repository](https://github.com/MohammedElattar/lens/issues). Please include as much detail as possible, including:

- A clear and descriptive title.
- A step-by-step description of how to reproduce the bug.
- The expected behavior and what actually happened.
- Your environment details (Node.js version, OS, etc.).

### Suggesting Enhancements

If you have an idea for a new feature or an improvement to an existing one, please open an issue on our [GitHub repository](https://github.com/MohammedElattar/lens/issues). Please provide a clear and detailed explanation of the feature you're suggesting and why it would be useful.

### Code Contributions

We love pull requests! If you'd like to contribute code, please follow these steps:

1.  Fork the repository and create your branch from `main`.
2.  Set up the development environment (see below).
3.  Make your changes and ensure that the tests pass.
4.  Create a pull request with a clear description of your changes.

## Development Setup

This project is a monorepo managed with Lerna and Bun. To get started with development, you'll need to have Node.js and Bun installed.

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/MohammedElattar/lens.git
    cd lens
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

    or

    ```bash
    bun install
    ```

3.  **Build all packages:**

    ```bash
    npm run build
    ```

4.  **Run the example applications:**

    To run the Express example:

    ```bash
    npm run dev
    ```

    To run the AdonisJS example, you'll need to configure it first.

## Commit Message Guidelines

We use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) for our commit messages. This allows us to automatically generate changelogs and release notes. Please follow this convention for your commit messages.

We have a pre-commit hook that will check your commit message format.

## Code of Conduct

We have a Code of Conduct to ensure that our community is welcoming and inclusive for everyone. Please read it before contributing. (TODO: Add a Code of Conduct)
