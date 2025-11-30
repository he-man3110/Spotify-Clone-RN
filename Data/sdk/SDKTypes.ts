export type SDKRequest<T = {}> = T & {
  refreshCache?: boolean;
};

export type SDKListRange<T = unknown> = T & {
  offset?: number;
  limit?: number;
};
