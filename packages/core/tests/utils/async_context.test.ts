import { describe, it, expect } from "vitest";
import {
  lensContext,
  getContextQueries,
  LensALS,
} from "../../src/utils/async_context";
import { QueryEntry } from "../../src/types";

describe("async_context", () => {
  it("should return undefined when no context is set", () => {
    expect(getContextQueries()).toBeUndefined();
  });

  it("should return queries from the context when set", () => {
    const queries: QueryEntry["data"][] = [
      {
        type: "sql",
        duration: "10 ms",
        query: "SELECT * FROM users",
        createdAt: "2025-01-01T00:00:00.000Z",
      },
    ];

    const context: LensALS = {
      lensEntry: {
        queries,
        requestId: "123",
      },
    };

    lensContext.run(context, () => {
      expect(getContextQueries()).toEqual(queries);
    });
  });

  it("should return undefined for queries if lensEntry is missing", () => {
    const context: LensALS = {};

    lensContext.run(context, () => {
      expect(getContextQueries()).toBeUndefined();
    });
  });

  it("should return undefined for queries if queries array is missing", () => {
    const context: LensALS = {
      lensEntry: {
        queries: undefined as any,
        requestId: "123"
      },
    };

    lensContext.run(context, () => {
      expect(getContextQueries()).toBeUndefined();
    });
  });
});
