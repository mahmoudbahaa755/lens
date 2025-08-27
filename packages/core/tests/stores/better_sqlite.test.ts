import { describe, it, expect, beforeEach } from "vitest";
import BetterSqliteStore from "../../src/stores/better_sqlite";
import { WatcherTypeEnum } from "../../src/types";
import Database from "libsql";

class TestBetterSqliteStore extends BetterSqliteStore {
  public override async initialize() {
    this.connection = new Database(":memory:");
    this.setupSchemaForTesting();
  }

  public setupSchemaForTesting() {
    const createTable = `
      CREATE TABLE IF NOT EXISTS lens_entries (
        id TEXT PRIMARY KEY,
        minimal_data TEXT,
        data TEXT NOT NULL,
        type TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT,
        lens_entry_id TEXT NULL
      );
    `;

    const createIndex = `
      CREATE INDEX IF NOT EXISTS lens_entries_id_type_index
      ON lens_entries (id, type);
    `;

    this.connection.exec(createTable);
    this.connection.exec(createIndex);
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe("BetterSqliteStore", () => {
  let store: TestBetterSqliteStore;

  beforeEach(async () => {
    store = new TestBetterSqliteStore();
    await store.initialize();
  });

  it("should save and find an entry", async () => {
    const entry = {
      id: "test-entry-1",
      type: WatcherTypeEnum.REQUEST,
      data: { message: "hello" },
      minimal_data: { message: "hello" },
    };
    await store.save(entry);

    const count = await store.count(WatcherTypeEnum.REQUEST);
    expect(count).toBe(1);
  });

  it("should truncate the database", async () => {
    const entry = {
      type: WatcherTypeEnum.REQUEST,
      data: { message: "hello" },
    };
    await store.save(entry);
    let count = await store.count(WatcherTypeEnum.REQUEST);
    expect(count).toBe(1);

    await store.truncate();
    count = await store.count(WatcherTypeEnum.REQUEST);
    expect(count).toBe(0);
  });

  it("should paginate requests", async () => {
    for (let i = 0; i < 15; i++) {
      await store.save({
        type: WatcherTypeEnum.REQUEST,
        data: { index: i },
        minimal_data: { index: i },
      });
      await sleep(1);
    }

    const paginator = await store.getAllRequests({ page: 2, perPage: 5 });
    expect(paginator.data.length).toBe(5);
    expect(paginator.meta.total).toBe(15);
    expect(paginator.meta.currentPage).toBe(2);
    expect(paginator.meta.lastPage).toBe(3);
    // Check that the full data is not included

    // @ts-ignore
    expect(paginator.data[0].data).toEqual({ index: 9 });
  });

  it("should paginate queries", async () => {
    for (let i = 0; i < 15; i++) {
      await store.save({
        type: WatcherTypeEnum.QUERY,
        data: { query: `SELECT ${i}` },
      });
      await sleep(1);
    }

    const paginator = await store.getAllQueries({ page: 1, perPage: 7 });
    expect(paginator.data.length).toBe(7);
    expect(paginator.meta.total).toBe(15);
    expect(paginator.meta.currentPage).toBe(1);
    expect(paginator.meta.lastPage).toBe(3);
    paginator.data[0] &&
      expect(paginator.data[0].data).toEqual({ query: "SELECT 14" });
  });

  it("should find an entry by id", async () => {
    const entry = {
      id: "test-id",
      type: WatcherTypeEnum.REQUEST,
      data: { message: "hello" },
    };
    await store.save(entry);

    const foundEntry = await store.find(WatcherTypeEnum.REQUEST, "test-id");
    expect(foundEntry).not.toBeNull();
    expect(foundEntry?.id).toBe("test-id");
    expect(foundEntry?.data).toEqual({ message: "hello" });
  });

  it("should return null if entry is not found", async () => {
    const foundEntry = await store.find(
      WatcherTypeEnum.REQUEST,
      "non-existent-id",
    );
    expect(foundEntry).toBeNull();
  });

  it("should retrieve all entries by request id", async () => {
    const requestId = "request-1";
    await store.save({
      id: requestId,
      type: WatcherTypeEnum.REQUEST,
      data: { url: "/users" },
    });
    await sleep(1);
    await store.save({
      requestId: requestId,
      type: WatcherTypeEnum.QUERY,
      data: { query: "SELECT * FROM users" },
    });
    await sleep(1);
    await store.save({
      requestId: requestId,
      type: WatcherTypeEnum.QUERY,
      data: { query: "SELECT * FROM posts" },
    });
    await sleep(1);
    await store.save({
      type: WatcherTypeEnum.REQUEST,
      data: { url: "/products" },
    });

    const entries = await store.allByRequestId(
      requestId,
      WatcherTypeEnum.QUERY,
    );
    expect(entries.length).toBe(2);
    entries[0] &&
      expect(entries[0].data).toEqual({ query: "SELECT * FROM posts" });
    entries[1] &&
      expect(entries[1].data).toEqual({ query: "SELECT * FROM users" });
  });
});
