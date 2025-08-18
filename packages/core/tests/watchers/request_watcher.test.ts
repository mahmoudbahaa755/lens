import { describe, it, expect, vi } from "vitest";
import RequestWatcher from "../../src/watchers/request_watcher";
import { WatcherTypeEnum, type RequestEntry } from "../../src/types";
import Store from "../../src/abstracts/store";

const mockStore = {
  save: vi.fn(),
} as unknown as Store;

vi.mock("../../src/context/context", () => ({
  getStore: () => mockStore,
}));

describe("RequestWatcher", () => {
  it("should log a request entry to the store", async () => {
    const watcher = new RequestWatcher();
    const requestEntry: RequestEntry = {
      request: {
        body: {},
        id: "request-1",
        method: "GET",
        path: "/users",
        duration: "200 ms",
        createdAt: "2025-01-01T00:00:00.000Z",
        status: 200,
        ip: "127.0.0.1",
        headers: {},
      },
      user: { id: "user-1", name: "John Doe", email: "john@example.com" },
      response: {
        json: {},
        headers: {},
      },
    };

    await watcher.log(requestEntry);

    expect(mockStore.save).toHaveBeenCalledWith({
      id: "request-1",
      type: WatcherTypeEnum.REQUEST,
      minimal_data: {
        id: "request-1",
        method: "GET",
        path: "/users",
        duration: '200 ms',
        createdAt: "2025-01-01T00:00:00.000Z",
        status: 200,
      },
      data: {
        ...requestEntry.request,
        user: { id: "user-1", name: "John Doe", email: "john@example.com" },
        response: {
          json: {},
          headers: {},
        },
      },
    });
  });
});
