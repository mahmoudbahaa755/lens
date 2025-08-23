import { AsyncResource } from "node:async_hooks";
import { QueryEntry } from "../types";
import { LensALS } from "./async_context";

interface CoreEvents {
  query: { query: QueryEntry["data"]; store?: LensALS };
}

class TypedCoreEventEmitter<Events extends Record<string, any>> {
  private listeners: {
    [K in keyof Events]?: ((payload: Events[K]) => void | Promise<void>)[];
  } = {};

  debug_id?: symbol;
  constructor() {
    this.debug_id = Symbol("TypedCoreEventEmitter");
  }

  on<K extends keyof Events>(
    event: K,
    listener: (payload: Events[K]) => void | Promise<void>,
  ): void {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event]!.push(listener);
  }

  off<K extends keyof Events>(
    event: K,
    listener: (payload: Events[K]) => void | Promise<void>,
  ): void {
    this.listeners[event] = this.listeners[event]?.filter(
      (l) => l !== listener,
    );
  }

  emit<K extends keyof Events>(event: K, payload: Events[K]) {
    if (!this.listeners[event]) return;

    for (const listener of this.listeners[event]!) {
      try {
        listener(payload);
      } catch (err) {
        console.error(
          `[lensEmitter] Error in listener for "${String(event)}":`,
          err,
        );
      }
    }
  }
}

export const lensResource = new AsyncResource("lens-emitter");
export const lensEmitter = new TypedCoreEventEmitter<CoreEvents>();
