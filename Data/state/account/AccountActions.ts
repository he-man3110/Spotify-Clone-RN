import SpotSdk from "@data/sdk/DataSource";
import Logger from "@utils/log/Log";
import { createAppAsyncThunk } from "../withTypes";

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
  async (_, thunkAPI) => {
    try {
      const isAuthenticated = await SpotSdk.isUserAuthenticated();
      if (isAuthenticated) {
        await thunkAPI.dispatch(loadUserProfile()).unwrap();
      }
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
      const response = await SpotSdk.getUserProfile({ refreshCache: true });
      return response;
    } catch (error) {
      throw error;
    }
  }
);
