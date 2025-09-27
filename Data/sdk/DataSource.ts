import axios from "axios";
import { Buffer } from "buffer";
import * as Crypto from "expo-crypto";
import AppCredentials from "../../app.credentials.json";
import { TopItemResponse, TopItemType, UserProfile } from "./CommonTypes";

class SpotifySDK {
  private client_id: string;
  private client_secret: string;

  private authToken: string | undefined;

  constructor() {
    this.client_id = AppCredentials["SPOTIFY_CLIENT_ID"];
    this.client_secret = AppCredentials["SPOTIFY_CLIENT_SECRET"];
  }

  initialize() {
    this.authenticate();
  }

  async authenticate() {
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
      redirect_uri: "https://www.google.com",
    };
    const urlParams = new URLSearchParams(params).toString();
    url.search = urlParams;

    return { url, codeVerifier };
  }

  async getUserProfile() {
    const url = "https://api.spotify.com/v1/me";

    const response = await axios.get<UserProfile>(url, {
      headers: this.getAuthorizationHeader(),
    });

    if (response.status === 200) {
      return response.data;
    } else {
      throw response.statusText;
    }
  }

  async getUsersTopItem({ type }: { type: TopItemType }) {
    const url = `https://api.spotify.com/v1/me/top/${type}`;

    console.log("Calling getUsersTopItem ", this.authToken);
    const response = await axios.get<TopItemResponse>(url, {
      headers: this.getAuthorizationHeader(),
    });

    console.log("RESPONSE : ", JSON.stringify(response));
    if (response.status === 200) {
      return response.data;
    } else {
      throw response.statusText;
    }
  }

  private getAuthorizationHeader() {
    return {
      Authorization: `Bearer ${this.authToken}`,
    };
  }
}

const sdk = new SpotifySDK();
export default sdk;
