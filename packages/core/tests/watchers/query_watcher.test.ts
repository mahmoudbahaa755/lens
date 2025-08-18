import { describe, it, expect, vi } from 'vitest';
import QueryWatcher from '../../src/watchers/query_watcher';
import { WatcherTypeEnum, type QueryEntry } from '../../src/types';
import Store from '../../src/abstracts/store';

const mockStore = {
  save: vi.fn(),
} as unknown as Store;

vi.mock('../../src/context/context', () => ({
  getStore: () => mockStore,
}));

describe('QueryWatcher', () => {
  it('should log a query entry to the store', async () => {
    const watcher = new QueryWatcher();
    const queryEntry: QueryEntry = {
      data: {
        type: 'sql',
        duration: '10 ms',
        query: 'SELECT * FROM users',
        createdAt: '2025-01-01T00:00:00.000Z',
      },
      requestId: 'request-1',
    };

    await watcher.log(queryEntry);

    expect(mockStore.save).toHaveBeenCalledWith({
      type: WatcherTypeEnum.QUERY,
      data: queryEntry.data,
      requestId: 'request-1',
    });
  });
});
