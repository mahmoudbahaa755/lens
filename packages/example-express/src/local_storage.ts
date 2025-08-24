import { AsyncLocalStorage, AsyncResource } from "node:async_hooks";
import { EventEmitter } from "node:events";

const asyncLocalStorage = new AsyncLocalStorage<{ requestId: string }>();

class ContextEmitter extends EventEmitter {
  emit(event: string | symbol, ...args: any[]): boolean {
    console.log("emit", event, args);
    return super.emit(event, ...args); // ✅ return boolean
  }
}

// Create an instance
const emitter = new ContextEmitter();

// Listener that reads ALS context
emitter.on("foo", () => {
  const context = asyncLocalStorage.getStore();
  console.log("RequestId inside EventEmitter:", context?.requestId);
});
