import { ExternalUrls, SpotifyID, SpotifyURI } from "../common";
import { Album } from "./Album";

export interface Track {
  album: Album;
  artists: Array<TrackArtist>;
  available_markets: Array<string>;
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: object;
  external_urls: ExternalUrls;
  href: string;
  id: SpotifyID;
  is_playable: boolean;
  name: string;
  popularity: number;
  type: "track";
}

export interface TrackArtist {
  external_urls: ExternalUrls;
  href: string;
  id: SpotifyID;
  name: string;
  type: "artist";
  uri: SpotifyURI;
}

export function isTrack(value: object): value is Track {
  return "type" in value && value.type === "track";
}
