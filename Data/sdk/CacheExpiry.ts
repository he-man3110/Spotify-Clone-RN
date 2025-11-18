export namespace CacheExpiry {
  export const ONE_HOUR = 60 * 60 * 1000;
  export const ONE_DAY = 24 * 60 * 60 * 1000;
  export const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;
  export const ONE_MONTH = 30 * 24 * 60 * 60 * 1000;

  export const afterSeconds = (value: number) => {
    return value * 1000;
  };
}
