import { describe, it, expect, vi, beforeEach } from "vitest";
import ExpressAdapter from "../src/adapter";
import { Lens, RequestWatcher, CacheWatcher, QueryWatcher } from "@lensjs/core";
import { lens } from "../src";

vi.mock("../src/adapter", () => {
  const mockExpressAdapterInstance = {
    setConfig: vi.fn().mockReturnThis(),
    setIgnoredPaths: vi.fn().mockReturnThis(),
    setOnlyPaths: vi.fn().mockReturnThis(),
    setup: vi.fn(),
    registerRoutes: vi.fn(),
    serveUI: vi.fn(),
  };
  return {
    default: vi.fn(() => mockExpressAdapterInstance),
  };
});
vi.mock("@lensjs/core", async () => {
  const actual = await vi.importActual<typeof import("@lensjs/core")>("@lensjs/core");
  return {
    ...actual,
    Lens: {
      setAdapter: vi.fn().mockReturnThis(),
      setWatchers: vi.fn().mockReturnThis(),
      start: vi.fn().mockResolvedValue(undefined),
    },
    RequestWatcher: vi.fn(function() {
      this.name = "request";
      this.log = vi.fn();
    }),
    CacheWatcher: vi.fn(function() {
      this.name = "cache";
      this.log = vi.fn();
    }),
    QueryWatcher: vi.fn(function() {
      this.name = "query";
      this.log = vi.fn();
    }),
    lensUtils: {
      ...actual.lensUtils,
      prepareIgnoredPaths: vi.fn().mockReturnValue({
        ignoredPaths: ["/health"],
        normalizedPath: "/lens",
      }),
    },
    lensEmitter: { emit: vi.fn() },
  };
});

describe("lens()", () => {
  let mockApp: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockApp = { use: vi.fn() };
  });

  it("merges config and starts Lens with defaults", async () => {
    await lens({ app: mockApp });

    expect(ExpressAdapter).toHaveBeenCalledWith({ app: mockApp });
    expect(Lens.setAdapter).toHaveBeenCalled();
    expect(Lens.setWatchers).toHaveBeenCalledWith([expect.any(RequestWatcher)]);
    expect(Lens.start).toHaveBeenCalledWith({
      appName: "Lens",
      enabled: true,
      basePath: "/lens",
    });
  });

  it("enables cache watcher when configured", async () => {
    await lens({ app: mockApp, cacheWatcherEnabled: true });

    // CacheWatcher should be instantiated
    expect(CacheWatcher).toHaveBeenCalled();
  });

  it("enables query watcher if queryWatcher.enabled = true", async () => {
    await lens({
      app: mockApp,
      queryWatcher: {
        enabled: true,
        handler: vi.fn(),
      },
    });

    expect(QueryWatcher).toHaveBeenCalled();
  });
});
