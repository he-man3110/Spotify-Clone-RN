import { TimeInMs } from "@components/AutoScrollingText";
import { SDKListRange } from "../SDKTypes";

export function addListRangeParams(url: URL, data: SDKListRange) {
  if (data.limit) {
    url.searchParams.set("limit", data.limit.toString());
  }
  if (data.offset) {
    url.searchParams.set("offset", data.offset.toString());
  }
  return url;
}

export function wait(timeInMS: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      resolve();
    }

    const timeoutTask = setTimeout(() => resolve(), timeInMS);

    signal?.addEventListener("abort", (e) => {
      clearTimeout(timeoutTask);
      resolve();
    });
  });
}

export function timeInSec(value: TimeInMs) {
  return `${Math.round(value / 1000)}s`;
}
