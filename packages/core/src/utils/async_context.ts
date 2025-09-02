import { AsyncLocalStorage } from "async_hooks";

type LensContext = {
    requestId: string
}

export const lensContext = new AsyncLocalStorage<LensContext>()
