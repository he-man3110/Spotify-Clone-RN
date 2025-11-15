import axios from "axios";
import { Buffer } from "buffer";
import * as Crypto from "expo-crypto";
import AppCredentials from "../../app.credentials.json";
import { apiCache } from "../storage/SDKCacheManager";
import { CacheKeys } from "./CacheKeys";
import { TopItemType } from "./CommonTypes";
import { AccessTokenResponse } from "./types/AccessTokenResponse";
import { TopItemResponse } from "./types/TopItemResponse";
import { UserProfile } from "./types/UserProfileResponse";

export type AuthorizationCode = string;

class SpotifySDK {
  private client_id: string;
  private client_secret: string;
  private redirect_uri = "https://www.google.com";

  private accessToken: string | undefined = undefined;

  constructor() {
    this.client_id = AppCredentials["SPOTIFY_CLIENT_ID"];
    this.client_secret = AppCredentials["SPOTIFY_CLIENT_SECRET"];
  }

  async initialize() {}

  private getAuthorizationHeader() {
    return {
      Authorization: `Bearer ${this.accessToken}`,
    };
  }

  private hasExpired(timestamp: number): boolean {
    return Date.now() > timestamp;
  }

  private async refreshAccessToken(refreshToken: string) {
    const url = "https://accounts.spotify.com/api/token";
    const params = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: this.client_id,
    });

    try {
      const response = await axios.post<AccessTokenResponse>(url, params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      if (response.status === 200) {
        return response.data;
      } else {
        throw response.statusText;
      }
    } catch (error) {
      console.error("Error refreshing access token:", error);
      throw error;
    }
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
    const scope = "user-read-private user-read-email";
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

  async renewUserSession() {
    try {
      await this.getAccessToken();
      return true;
    } catch (error) {
      return false;
    }
  }

  async getAccessToken(
    args:
      | { authorizationCode: string; codeVerifier: string }
      | undefined = undefined
  ) {
    if (args) {
      try {
        // If not, proceed to get a new token using the code
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
          apiCache.set<AccessTokenResponse>(
            CacheKeys.AuthData,
            response.data,
            0
          );
          return response.data.access_token;
        } else {
          throw response.statusText;
        }
      } catch (error) {
        console.error("Error fetching access token:", error);
        throw error;
      }
    } else {
      const cacheValue = await apiCache.get<AccessTokenResponse>(
        CacheKeys.AuthData
      );
      if (cacheValue && !this.hasExpired(cacheValue.expires_in)) {
        return cacheValue.access_token;
      } else if (cacheValue) {
        const newData = await this.refreshAccessToken(cacheValue.refresh_token);
        await apiCache.set(CacheKeys.AuthData, newData);
        return newData.access_token;
      } else {
        throw "No Auth Data in Cache";
      }
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

    const url = "https://api.spotify.com/v1/me";
    const response = await axios.get<UserProfile>(url, {
      headers: this.getAuthorizationHeader(),
    });

    if (response.status === 200) {
      apiCache.set(CacheKeys.UserProfile, response.data);
      return response.data;
    } else {
      throw response.statusText;
    }
  }

  async getUsersTopItem({
    type,
    offset,
    refreshCache,
  }: {
    type: TopItemType;
    offset?: number;
    refreshCache?: boolean;
  }) {
    const cacheKey =
      CacheKeys.TopItems + ":" + type + (offset ? `:${offset}` : "");
    if (!refreshCache) {
      const cached = await apiCache.get<TopItemResponse>(cacheKey);
      if (cached) {
        return cached;
      }
    }

    const url = `https://api.spotify.com/v1/me/top/${type}`;
    const response = await axios.get<TopItemResponse>(url, {
      headers: this.getAuthorizationHeader(),
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
