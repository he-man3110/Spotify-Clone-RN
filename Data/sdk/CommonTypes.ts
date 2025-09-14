export type AuthResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

export type ExplicitContent = {
  filter_enabled: boolean;
  filter_locked: boolean;
};

export type ExternalUrls = {
  spotify: string;
};

export type Followers = {
  href: string;
  total: number;
};

export type Image = {
  url: string;
  height: number;
  width: number;
};

export type UserProfile = {
  country: string;
  display_name: string;
  email: string;
  explicit_content: ExplicitContent;
  external_urls: ExternalUrls;
  followers: Followers;
  href: string;
  id: string;
  images: Image[];
  product: string;
  type: string;
  uri: string;
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

export type TopItemResponse = {
  limit: number;
  offset: number;
  total: number;
  items: Array<TopItem>;
};

export type TopItemType = "artists" | "tracks";
