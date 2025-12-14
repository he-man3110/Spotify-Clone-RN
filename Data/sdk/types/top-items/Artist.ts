import { ExternalUrls, SpotifyURI, TotalInfo } from "../common";
import { SptImage } from "../SptImage";

export interface Artist {
  external_urls: ExternalUrls;
  followers: TotalInfo;
  genres: string[];
  href: string;
  id: string;
  images: Array<SptImage>;
  name: string;
  popularity: number;
  type: "artist";
  uri: SpotifyURI;
}

export interface SimplifiedArtist {
  external_urls: ExternalUrls;
  href: string;
  id: string;
  name: string;
  type: "artist";
  uri: SpotifyURI;
}

export function isArtist(value: object): value is Artist {
  return "type" in value && value.type === "artist";
}
