import { ContentStatus } from "@Data/state/common/CommonTypes";

export const isLoading = (status: ContentStatus) => status === "loading";
export const isRefreshing = (status: ContentStatus) => status === "refreshing";
export const isAvailable = (status: ContentStatus) =>
  status === "available" || status === "refreshing";
export const isNotAvailable = (status: ContentStatus) =>
  status === "unavailable" || status === "error";

export const isAllAvailable = (arr: Array<ContentStatus>) =>
  !arr.some((i) => i !== "available");
