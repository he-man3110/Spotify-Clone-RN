import { ExternalUrls, SpotifyID, SpotifyURI } from "../common";
import { SptImage } from "../SptImage";
import { Artist } from "./Artist";

export interface Album {
  album_type: "album" | "single" | "compilation";
  total_tracks: number;
  available_markets: Array<string>;
  images: Array<SptImage>;
  name: string;
  release_date: string;
  type: "album";
  uri: SpotifyURI;
  id: SpotifyID;
  href: string;
  external_urls: ExternalUrls;
  artists: Array<Artist>;
}
