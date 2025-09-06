import { describe, it, expect } from "vitest";
import { defineConfig } from "../src/define-config";
import NestJSAdapter from "../src/adapter";

describe("NestJS Lens Package", () => {
  describe("defineConfig", () => {
    it("should return the provided config", () => {
      const config = {
        appName: "Test App",
        path: "lens",
        enabled: true,
        ignoredPaths: [],
        onlyPaths: [],
        watchers: {
          requests: true,
          cache: true,
          queries: {
            enabled: true,
            provider: "postgresql" as const,
          },
        },
      };

      const result = defineConfig(config);
      expect(result).toEqual(config);
    });
  });

  describe("NestJSAdapter", () => {
    it("should create an adapter instance", () => {
      const mockApp = {
        getHttpAdapter: () => ({
          get: () => {},
          post: () => {},
          put: () => {},
          delete: () => {},
        }),
      };

      const adapter = new NestJSAdapter({ app: mockApp });
      expect(adapter).toBeInstanceOf(NestJSAdapter);
    });

    it("should set config properly", () => {
      const mockApp = {
        getHttpAdapter: () => ({}),
      };
      const config = {
        appName: "Test App",
        path: "lens",
        enabled: true,
        ignoredPaths: [],
        onlyPaths: [],
        watchers: {
          requests: true,
          cache: true,
          queries: {
            enabled: true,
            provider: "postgresql" as const,
          },
        },
      };

      const adapter = new NestJSAdapter({ app: mockApp });
      const result = adapter.setConfig(config);
      expect(result).toBe(adapter); // Should return self for chaining
    });

    it("should generate unique request IDs", () => {
      const id1 = NestJSAdapter.generateRequestId();
      const id2 = NestJSAdapter.generateRequestId();

      expect(id1).toBeTruthy();
      expect(id2).toBeTruthy();
      expect(id1).not.toBe(id2);
    });

    it("should set and get request ID from request object", () => {
      const req = {};
      const requestId = "test-request-id";

      NestJSAdapter.setRequestId(req, requestId);
      const retrievedId = NestJSAdapter.getRequestId(req);

      expect(retrievedId).toBe(requestId);
    });
  });
});
