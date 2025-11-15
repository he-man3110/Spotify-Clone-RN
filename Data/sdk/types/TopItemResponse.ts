import { Image } from "./UserProfileResponse";

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
  images: Array<Image>;
  name: string;
  popularity: number;
  type: string;
  uri: string;
};
