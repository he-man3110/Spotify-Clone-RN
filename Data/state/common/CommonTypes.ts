import { ColorValue } from "react-native";

export type ContentStatus =
  | "unavailable"
  | "loading"
  | "refreshing"
  | "available"
  | "error";

export namespace ContentStatus {
  export function requireAll(list: Array<ContentStatus>): ContentStatus {
    if (list.some(isLoading)) return "loading";
    else if (list.some(isNotAvailable)) return "unavailable";
    else return "available";
  }

  export const isLoading = (status: ContentStatus) => status === "loading";

  export const isRefreshing = (status: ContentStatus) =>
    status === "refreshing";
  export const isAvailable = (status: ContentStatus) =>
    status === "available" || status === "refreshing";
  export const isNotAvailable = (status: ContentStatus) =>
    status === "unavailable" || status === "error";
}

export type ImageColorAnalysisResult = {
  primary: ColorValue;
  secondary: ColorValue;
  background: ColorValue;
};
