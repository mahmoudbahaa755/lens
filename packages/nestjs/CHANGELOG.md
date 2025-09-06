# Changelog

All notable changes to the `@lensjs/nestjs` package will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-09-06

### Added

- Initial release of the NestJS adapter for Lens
- `NestJSAdapter` class for integrating Lens with NestJS applications
- `LensModule` for dependency injection and configuration
- `LensInterceptor` for automatic request monitoring
- `defineConfig` function for type-safe configuration
- Support for HTTP request monitoring
- Support for database query monitoring (depends on ORM implementation)
- Support for cache operation monitoring (depends on cache manager implementation)
- Comprehensive documentation and examples
- TypeScript support with proper type definitions

### Features

- **Framework Integration**: Seamlessly integrates with NestJS using decorators and dependency injection
- **Request Monitoring**: Automatically captures HTTP request details including headers, body, duration, and response
- **Extensible**: Supports custom watchers for queries, cache, and other operations
- **Type Safe**: Full TypeScript support with proper type definitions
- **Configurable**: Flexible configuration options for different monitoring scenarios
- **Authentication Support**: Optional authentication and user identification for the Lens dashboard
- **Path Filtering**: Support for ignoring or including specific paths in monitoring

### Documentation

- Complete README with installation and usage instructions
- Examples for different NestJS setups (basic, TypeORM, Prisma)
- API documentation for all exported classes and functions
- Migration guide from other Lens adapters

### Dependencies

- `@lensjs/core`: Core Lens functionality
- `@lensjs/date`: Date utilities for Lens
- Peer dependencies: `@nestjs/common`, `@nestjs/core`, `reflect-metadata`, `rxjs`
