import axios from "axios";
import Aes from "react-native-aes-crypto";
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
      return btoa(input)
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");
    };

    const codeVerifier = await Aes.randomKey(64);
    const hashed = await Aes.sha256(codeVerifier);
    const codeChallenge = base64encode(hashed);

    const scope = "user-read-private user-read-email";
    const params = {
      response_type: "code",
      client_id: this.client_id,
      scope,
      code_challenge_method: "S256",
      code_challenge: codeChallenge,
      redirect_uri: "https://www.google.com",
    };

    const url = "https://accounts.spotify.com/authoriz";
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
