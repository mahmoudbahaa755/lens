import Emittery from "emittery";

export const createEmittery = <T extends Record<string, any>>() => {
  return new Emittery<T>();
};
