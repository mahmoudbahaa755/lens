import { LogEvent } from "kysely";

export interface LensWatcherEvents {
  kyselyQuery: LogEvent;
  sequelizeQuery: { sql: string; timing?: number };
}

class TypedEventEmitter<Events extends Record<string, any>> {
  private listeners: {
    [K in keyof Events]?: ((payload: Events[K]) => void)[];
  } = {};

  on<K extends keyof Events>(
    event: K,
    listener: (payload: Events[K]) => void,
  ): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(listener);
  }

  off<K extends keyof Events>(
    event: K,
    listener: (payload: Events[K]) => void,
  ): void {
    this.listeners[event] = this.listeners[event]?.filter(
      (l) => l !== listener,
    );
  }

  emit<K extends keyof Events>(event: K, payload: Events[K]): void {
    this.listeners[event]?.forEach((listener) => listener(payload));
  }
}

export const watcherEmitter = new TypedEventEmitter<LensWatcherEvents>();
