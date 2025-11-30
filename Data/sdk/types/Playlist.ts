import { ExternalUrls, SpotifyURI, TotalInfo } from "./common";
import { Owner } from "./Owner";
import { SptImage } from "./SptImage";

export interface PlayList {
  collaborative: boolean;
  description?: string;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  images: Array<SptImage>;
  name: string;
  owner: Owner;
  public: boolean;
  snapshot_id: string;
  tracks: TotalInfo;
  type: "playlist";
  uri: SpotifyURI;
}
