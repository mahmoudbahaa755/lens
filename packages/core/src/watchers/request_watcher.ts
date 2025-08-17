import { getStore } from "../context/context";
import Watcher from "../core/watcher";
import { WatcherTypeEnum, type RequestEntry } from "../types/index";

export default class RequestWatcher extends Watcher {
  name = WatcherTypeEnum.REQUEST;

  async log(data: RequestEntry) {
    await getStore().save({
      id: data.request.id,
      type: this.name,
      minimal_data: {
        id: data.request.id,
        method: data.request.method,
        path: data.request.path,
        duration: data.request.duration,
        createdAt: data.request.createdAt,
        status: data.request.status,
      },
      data: {
        ...data.request,
        user: data.user,
        response: data.response,
        totalQueriesDurations: data.totalQueriesDuration,
      },
    });
  }
}
