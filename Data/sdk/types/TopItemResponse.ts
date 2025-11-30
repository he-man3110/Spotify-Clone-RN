import { SptImage } from "./SptImage";

export type TopItemResponse = {
  limit: number;
  offset: number;
  total: number;
  items: Array<TopItem>;
};

export type TopItem = {
  followers: {
    total: number;
  };
  genres: Array<string>;
  id: string;
  images: Array<SptImage>;
  name: string;
  popularity: number;
  type: string;
  uri: string;
};
