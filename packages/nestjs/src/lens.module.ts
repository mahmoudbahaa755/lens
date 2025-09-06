// This file provides a NestJS module for Lens integration
// Users will need to implement this with proper NestJS decorators

export interface LensModuleInterface {
  configure?(consumer: any): void;
}

export interface LensModuleConfig {
  config: any; // LensConfig type
  global?: boolean;
}

export class LensModule implements LensModuleInterface {
  static forRoot(options: LensModuleConfig): any {
    // In a real implementation, this would use NestJS's DynamicModule
    return {
      module: LensModule,
      global: options.global || false,
      providers: [
        {
          provide: "LENS_CONFIG",
          useValue: options.config,
        },
        {
          provide: "LENS_ADAPTER",
          useFactory: (app: any) => {
            // This would be implemented with proper NestJS injection
            const adapter = new (require("./adapter.js").default)({ app });
            adapter.setConfig(options.config);
            return adapter;
          },
          inject: ["HTTP_ADAPTER_HOST"],
        },
      ],
      exports: ["LENS_CONFIG", "LENS_ADAPTER"],
    };
  }

  static forRootAsync(options: {
    imports?: any[];
    useFactory?: (...args: any[]) => Promise<any> | any;
    inject?: any[];
  }): any {
    // In a real implementation, this would use NestJS's DynamicModule
    return {
      module: LensModule,
      imports: options.imports || [],
      providers: [
        {
          provide: "LENS_CONFIG",
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
        {
          provide: "LENS_ADAPTER",
          useFactory: (config: any, app: any) => {
            const adapter = new (require("./adapter.js").default)({ app });
            adapter.setConfig(config);
            return adapter;
          },
          inject: ["LENS_CONFIG", "HTTP_ADAPTER_HOST"],
        },
      ],
      exports: ["LENS_CONFIG", "LENS_ADAPTER"],
    };
  }
}
