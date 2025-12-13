import {
  ExternalIds,
  ExternalUrls,
  LinkedFrom,
  Restrictions,
  SpotifyID,
  SpotifyURI,
} from "../common";
import { Album } from "./Album";
import { SimplifiedArtist } from "./Artist";

export interface Track {
  album: Album;
  artists: Array<SimplifiedArtist>;
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: ExternalIds;
  external_urls: ExternalUrls;
  href: string;
  id: SpotifyID;
  is_playable?: boolean;
  linked_from?: LinkedFrom;
  restrictions?: Restrictions;
  name: string;
  popularity: number;
  preview_url: string | null;
  track_number: number;
  type: "track";
  uri: SpotifyURI;
  is_local: boolean;
}

export function isTrack(value: object): value is Track {
  return "type" in value && value.type === "track";
}
