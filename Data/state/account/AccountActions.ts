import SpotSdk from "@data/sdk/DataSource";
import { createAppAsyncThunk } from "../withTypes";
import Logger from "@utils/log/Log";

const Log = Logger.createTaggedLogger("AccountActions");

export const login = createAppAsyncThunk(
  "AccountSlice/login",
  async (props: { authorizationCode: string; codeVerifier: string }) => {
    try {
      return await SpotSdk.login(props);
    } catch (error) {
      throw error;
    }
  }
);

export const loadAuthenticationStatus = createAppAsyncThunk(
  "AccountSlice/loadAuthenticationStatus",
  async () => {
    try {
      const isAuthenticated = await SpotSdk.isUserAuthenticated();
      Log.d(`Authentication Check : ${isAuthenticated}`);
      return isAuthenticated;
    } catch (error) {
      throw error;
    }
  }
);

export const loadUserProfile = createAppAsyncThunk(
  "AccountSlice/loadUserProfile",
  async () => {
    try {
      const response = await SpotSdk.getUserProfile();
      return response;
    } catch (error) {
      throw error;
    }
  }
);
