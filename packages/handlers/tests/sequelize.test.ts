import { describe, it, expect, vi, beforeEach, Mock} from 'vitest';
import { createSequelizeHandler } from '../src/query/sequelize';
import { watcherEmitter } from '../src/utils/emitter';
import { lensUtils } from '@lensjs/core';

// Mock dependencies
vi.mock('../src/utils/emitter', () => ({
  watcherEmitter: {
    on: vi.fn(),
    emit: vi.fn(),
  },
}));

vi.mock('@lensjs/core', () => ({
  lensUtils: {
    interpolateQuery: vi.fn((sql, params) => `interpolated(${sql}, ${JSON.stringify(params)})`),
    formatSqlQuery: vi.fn((sql, provider) => `formatted(${sql}, ${provider})`),
  },
}));

vi.mock('@lensjs/date', () => ({
  now: vi.fn(() => '2025-09-05T12:00:00.000Z'), // Mock now() to return a consistent string
}));

describe('createSequelizeHandler', () => {
  let onQueryMock: Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    onQueryMock = vi.fn();
  });

  it('should register a sequelizeQuery listener with watcherEmitter', async () => {
    const handler = createSequelizeHandler({ provider: 'sqlite' });
    await handler({ onQuery: onQueryMock });
    expect(watcherEmitter.on).toHaveBeenCalledTimes(1);
    expect(watcherEmitter.on).toHaveBeenCalledWith('sequelizeQuery', expect.any(Function));
  });

  it('should call onQuery with formatted data for a successful query', async () => {
    const handler = createSequelizeHandler({ provider: 'mysql' });
    await handler({ onQuery: onQueryMock });

    const sequelizeEvent = {
      sql: 'Executed (default): SELECT * FROM users WHERE id = 1;[1]',
      timing: 15.2,
    };

    // Manually trigger the registered listener
    const listener = (watcherEmitter.on as Mock).mock.calls[0][1];
    listener(sequelizeEvent);

    expect(lensUtils.interpolateQuery).toHaveBeenCalledWith(
      'SELECT * FROM users WHERE id = 1',
      [1],
    );
    expect(lensUtils.formatSqlQuery).toHaveBeenCalledWith(
      `interpolated(SELECT * FROM users WHERE id = 1, [1])`,
      'mysql',
    );
    expect(onQueryMock).toHaveBeenCalledTimes(1);
    expect(onQueryMock).toHaveBeenCalledWith({
      query: `formatted(interpolated(SELECT * FROM users WHERE id = 1, [1]), mysql)`,
      duration: '15.2 ms',
      type: 'mysql',
      createdAt: '2025-09-05T12:00:00.000Z',
    });
  });

  it('should handle queries without parameters', async () => {
    const handler = createSequelizeHandler({ provider: 'postgresql' });
    await handler({ onQuery: onQueryMock });

    const sequelizeEvent = {
      sql: 'Executed (default): SELECT COUNT(*) FROM posts;',
      timing: 5.0,
    };

    const listener = (watcherEmitter.on as Mock).mock.calls[0][1];
    listener(sequelizeEvent);

    expect(lensUtils.interpolateQuery).toHaveBeenCalledWith(
      'SELECT COUNT(*) FROM posts',
      [],
    );
    expect(onQueryMock).toHaveBeenCalledTimes(1);
    expect(onQueryMock).toHaveBeenCalledWith(expect.objectContaining({
      query: `formatted(interpolated(SELECT COUNT(*) FROM posts, []), postgresql)`,
      duration: '5.0 ms',
      type: 'postgresql',
    }));
  });

  it('should throw error if payload.sql is not a string', async () => {
    const handler = createSequelizeHandler({ provider: 'sqlite' });
    await handler({ onQuery: onQueryMock });

    const sequelizeEvent = {
      sql: 123, // Invalid type
      timing: 10,
    };

    const listener = (watcherEmitter.on as Mock).mock.calls[0][1];
    expect(() => listener(sequelizeEvent)).toThrow('payload.sql must be a string');
    expect(onQueryMock).not.toHaveBeenCalled();
  });

  it('should throw error if payload.timing is not a number', async () => {
    const handler = createSequelizeHandler({ provider: 'sqlite' });
    await handler({ onQuery: onQueryMock });

    const sequelizeEvent = {
      sql: 'SELECT 1',
      timing: 'abc', // Invalid type
    };

    const listener = (watcherEmitter.on as Mock).mock.calls[0][1];
    expect(() => listener(sequelizeEvent)).toThrow('payload.timing must be a number');
    expect(onQueryMock).not.toHaveBeenCalled();
  });

  it('should throw error for malformed parameter string', async () => {
    const handler = createSequelizeHandler({ provider: 'sqlite' });
    await handler({ onQuery: onQueryMock });

    const sequelizeEvent = {
      sql: 'Executed (default): SELECT * FROM users;{invalid json',
      timing: 10,
    };

    const listener = (watcherEmitter.on as Mock).mock.calls[0][1];
    expect(() => listener(sequelizeEvent)).toThrow('Failed to extract params from query');
    expect(onQueryMock).not.toHaveBeenCalled();
  });
});
