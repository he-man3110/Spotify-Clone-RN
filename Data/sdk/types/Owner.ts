import { SpotifyURI } from "./common";

export interface Owner {
  external_urls: {
    spotify: SpotifyURI;
  };
  href: string;
  id: string;
  type: "user";
  uri: SpotifyURI;
  display_name: string;
}
