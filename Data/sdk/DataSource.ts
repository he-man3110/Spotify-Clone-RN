import { Log as Logger } from "@utils/log/Log";
import axios from "axios";
import { Buffer } from "buffer";
import * as Crypto from "expo-crypto";
import AppCredentials from "../../app.credentials.json";
import { apiCache } from "../storage/SDKCacheManager";
import { CacheExpiry } from "./CacheExpiry";
import { CacheKeys, getKeyForListRange } from "./CacheKeys";
import { SDKListRange, SDKRequest } from "./SDKTypes";
import { AccessTokenResponse } from "./types/AccessTokenResponse";
import { List } from "./types/List";
import { PlayList } from "./types/Playlist";
import { TopItemResponse } from "./types/top-items/TopItemResponse";
import { UsersTopItemRequest } from "./types/top-items/UsersTopItemRequest";
import { UserProfile } from "./types/UserProfileResponse";
import { addListRangeParams } from "./utils/GeneralUtils";

export type AuthorizationCode = string;

const Log = Logger.createTaggedLogger("[SDK]");

// TODO: Structure APIs, common base urls.
class SpotifySDK {
  private client_id: string;
  private client_secret: string;
  private redirect_uri = "https://www.google.com";

  private tokenRefreshTask: Promise<string> | undefined = undefined;

  constructor() {
    this.client_id = AppCredentials["SPOTIFY_CLIENT_ID"];
    this.client_secret = AppCredentials["SPOTIFY_CLIENT_SECRET"];
  }

  async initialize() {
    return;
  }

  private hasExpired(timestamp: number): boolean {
    return Date.now() > timestamp;
  }

  private async refreshAndGetToken() {
    if (this.tokenRefreshTask) {
      return await this.tokenRefreshTask;
    }

    const authData = await apiCache.get<AccessTokenResponse>(
      CacheKeys.AuthData
    );

    if (authData && this.hasExpired(authData.expires_in - 120_000)) {
      const refreshToken = authData.refresh_token;
      const url = "https://accounts.spotify.com/api/token";
      const params = new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
        client_id: this.client_id,
      });

      Log.d("Refreshing Auth Token");
      try {
        this.tokenRefreshTask = new Promise((resolve, reject) => {
          axios
            .post<AccessTokenResponse>(url, params, {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
            })
            .then((response) => {
              if (response.status === 200) {
                const expiryTime = response.data.expires_in * 1000 + Date.now();
                apiCache.set(
                  CacheKeys.AuthData,
                  { ...response.data, expires_in: expiryTime },
                  CacheExpiry.ONE_MONTH
                );
                resolve(response.data.access_token);
              } else {
                reject(response.statusText);
              }
            });
        });

        return await this.tokenRefreshTask;
      } catch (error) {
        Log.e(`Error while refreshing access token: ${error}`);
        throw error;
      }
    } else if (!authData) {
      // TODO: Throw a uniform error.
      throw "Session Expired";
    }
    return authData.access_token;
  }

  async getAuthURL() {
    const base64encode = (input: string) => {
      return input.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    };

    const _randomBytes = await Crypto.getRandomBytesAsync(64);
    const randomBytes = Buffer.from(_randomBytes).toString("base64");
    const codeVerifier = base64encode(randomBytes);
    const hashed = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      codeVerifier,
      { encoding: Crypto.CryptoEncoding.BASE64 }
    );
    const codeChallenge = base64encode(hashed);

    const url = new URL("https://accounts.spotify.com/authorize");
    const scope =
      "user-read-private user-read-email user-read-playback-state user-modify-playback-state user-read-currently-playing app-remote-control user-follow-read user-follow-modify user-read-playback-position user-top-read user-read-recently-played playlist-read-private playlist-read-collaborative";
    const params = {
      response_type: "code",
      client_id: this.client_id,
      scope,
      code_challenge_method: "S256",
      code_challenge: codeChallenge,
      redirect_uri: this.redirect_uri,
    };
    const urlParams = new URLSearchParams(params).toString();
    url.search = urlParams;

    return { url, codeVerifier };
  }

  async isUserAuthenticated() {
    return await apiCache.has(CacheKeys.AuthData);
  }

  async getAccessToken() {
    try {
      const authData = await apiCache.get<AccessTokenResponse>(
        CacheKeys.AuthData
      );
      if (authData) {
        return authData.access_token;
      }
    } catch (error) {
      throw error;
    }
  }

  async getRefreshToken() {
    try {
      const authData = await apiCache.get<AccessTokenResponse>(
        CacheKeys.AuthData
      );
      if (authData) {
        return authData.refresh_token;
      }
    } catch (error) {
      throw error;
    }
  }

  // --------------------- APIs ---------------------

  async login(args: { authorizationCode: string; codeVerifier: string }) {
    const url = "https://accounts.spotify.com/api/token";
    const params = new URLSearchParams({
      grant_type: "authorization_code",
      code: args.authorizationCode,
      redirect_uri: this.redirect_uri,
      client_id: this.client_id,
      code_verifier: args.codeVerifier,
    });
    const response = await axios.post<AccessTokenResponse>(url, params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    if (response.status === 200) {
      const expiryTime = response.data.expires_in * 1000 + Date.now();
      apiCache.set<AccessTokenResponse>(
        CacheKeys.AuthData,
        { ...response.data, expires_in: expiryTime },
        CacheExpiry.ONE_MONTH
      );
      return response.data.access_token;
    } else {
      throw response.statusText;
    }
  }

  async logOut() {
    return await apiCache.remove(CacheKeys.AuthData);
  }

  async getUserProfile({ refreshCache }: { refreshCache?: boolean } = {}) {
    if (!refreshCache) {
      const cached = await apiCache.get<UserProfile>(CacheKeys.UserProfile);
      if (cached) {
        return cached;
      }
    }

    const token = await this.refreshAndGetToken();

    const url = "https://api.spotify.com/v1/me";
    const response = await axios.get<UserProfile>(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      apiCache.set(CacheKeys.UserProfile, response.data, CacheExpiry.ONE_MONTH);
      return response.data;
    } else {
      throw response.statusText;
    }
  }

  async getUsersTopItem({
    type,
    refreshCache,
    ...listRange
  }: SDKRequest<SDKListRange<UsersTopItemRequest>>) {
    const cacheKey = getKeyForListRange(
      CacheKeys.TopItems + ":" + type,
      listRange
    );
    if (!refreshCache) {
      const cached = await apiCache.get<TopItemResponse>(cacheKey);
      if (cached) {
        return cached;
      }
    }

    const token = await this.refreshAndGetToken();
    const url = new URL(`https://api.spotify.com/v1/me/top/${type}`);
    addListRangeParams(url, listRange);

    const response = await axios.get<TopItemResponse>(url.href, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      apiCache.set(cacheKey, response.data);
      return response.data;
    } else {
      throw response.statusText;
    }
  }

  async getUsersPlaylists({
    refreshCache,
    ...listRange
  }: SDKRequest<SDKListRange>): Promise<List<PlayList>> {
    const cacheKey = getKeyForListRange(CacheKeys.UserPlaylists, listRange);
    if (!refreshCache) {
      const cache = await apiCache.get<List<PlayList>>(cacheKey);
      if (cache) {
        return cache;
      }
    }

    const userData = await apiCache.get<UserProfile>(CacheKeys.UserProfile);
    const userId = userData?.id;

    const url = new URL(`https://api.spotify.com/v1/users/${userId}/playlists`);
    addListRangeParams(url, listRange);

    const token = await this.refreshAndGetToken();
    const response = await axios.get<List<PlayList>>(url.href, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 200) {
      apiCache.set(cacheKey, response.data);
      return response.data;
    } else {
      throw response.statusText;
    }
  }
}

const sdk = new SpotifySDK();
export default sdk;
