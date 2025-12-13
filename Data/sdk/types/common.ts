export type SpotifyURI = string;
export type SpotifyID = string;

export type ExternalUrls = {
  spotify: SpotifyURI;
};

export type TotalInfo = {
  href: string;
  total: number;
};

export interface ExternalIds {
  isrc?: string;
  ean?: string;
  upc?: string;
}

export interface Restrictions {
  reason: string;
}

export interface Context {
  type: string;
  href: string;
  external_urls: ExternalUrls;
  uri: SpotifyURI;
}

export interface LinkedFrom {
  // This can be extended based on actual Spotify API response
  [key: string]: any;
}
