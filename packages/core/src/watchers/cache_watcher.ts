import { getStore } from "../context/context";
import Watcher from "../core/watcher";
import { CacheEntry, WatcherTypeEnum } from "../types";

export default class CacheWatcher extends Watcher {
  name = WatcherTypeEnum.CACHE;

  async log(data: CacheEntry) {
    const payload = {
      action: data.action,
      data: this.normalizePayload(data),
      requestId: data.requestId ?? "",
      createdAt: data.createdAt,
    };

    console.log("stored cache entry", {
      requestId: data.requestId ?? "",
      type: this.name,
      data: payload,
      minimal_data: {
        action: data.action,
        key: payload.data.key,
        createdAt: payload.createdAt,
      },
    });

    await getStore().save({
      requestId: data.requestId ?? "",
      type: this.name,
      data: payload,
      minimal_data: {
        action: data.action,
        key: payload.data.key,
        createdAt: payload.createdAt,
      },
    });
  }

  private normalizePayload(data: CacheEntry): { key: string; value: any } {
    let normalizedData: any =
      "data" in data
        ? data.data
        : {
            key: "",
            value: "",
          };

    if (
      !normalizedData ||
      (typeof normalizedData === "object" &&
        Object.keys(normalizedData).length === 0)
    ) {
      normalizedData = {
        key: "",
        value: "",
      };
    }


    if (! normalizedData["key"]) {
      normalizedData.key = "";
    }

    if (!normalizedData["value"]) {
      normalizedData["value"] = "";
    }

    return normalizedData;
  }
}
