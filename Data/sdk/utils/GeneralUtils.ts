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
