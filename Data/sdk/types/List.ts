export interface List<T> {
  limit: number;
  offset: number;
  total: number;
  items: Array<T>;
}
