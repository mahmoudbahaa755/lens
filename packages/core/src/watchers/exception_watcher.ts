import { getStore } from "../context/context";
import Watcher from "../core/watcher";
import { ExceptionEntry, WatcherTypeEnum } from "../types";
import { generateRandomUuid } from "../utils";

export default class ExceptionWatcher extends Watcher {
  name = WatcherTypeEnum.EXCEPTION;

  async log(payload: ExceptionEntry) {
    console.dir(
      {
        id: generateRandomUuid(),
        type: WatcherTypeEnum.EXCEPTION,
        requestId: payload.requestId,
        timestamp: payload.createdAt,
        data: payload,
        minimal_data: {
          name: payload.name,
          message: payload.message,
          createdAt: payload.createdAt,
        },
      },
      { depth: null },
    );
    await getStore().save({
      id: generateRandomUuid(),
      type: WatcherTypeEnum.EXCEPTION,
      requestId: payload.requestId,
      timestamp: payload.createdAt,
      data: payload,
      minimal_data: {
        name: payload.name,
        message: payload.message,
        createdAt: payload.createdAt,
      },
    });
  }
}
