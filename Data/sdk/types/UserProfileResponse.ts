import { ExternalUrls, TotalInfo } from "./common";
import { SptImage } from "./SptImage";

export type UserProfile = {
  country: string;
  display_name: string;
  email: string;
  explicit_content: ExplicitContent;
  external_urls: ExternalUrls;
  followers: TotalInfo;
  href: string;
  id: string;
  images: Array<SptImage>;
  product: string;
  type: string;
  uri: string;
};

export type ExplicitContent = {
  filter_enabled: boolean;
  filter_locked: boolean;
};
