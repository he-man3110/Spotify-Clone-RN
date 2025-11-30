import { SDKListRange } from "./SDKTypes";

export enum CacheKeys {
  UserProfile = "user_profile",
  UserSettings = "user_settings",
  AppConfig = "app_config",
  RecentPlaylists = "recent_playlists",
  AuthData = "auth_data",
  TopItems = "top_items",
  UserPlaylists = "user_playlists",
}

export function getKeyForListRange(key: string, range: SDKListRange) {
  return (
    key +
    (range.offset ? `:${range.offset}` : "") +
    (range.limit ? `:${range.limit}` : "")
  );
}
