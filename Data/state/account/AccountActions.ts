import SpotSdk from "@/Data/sdk/DataSource";
import { TopItemType } from "@Data/sdk/CommonTypes";
import { createAppAsyncThunk } from "../withTypes";
import { createAsyncThunk } from "@node_modules/@reduxjs/toolkit/dist/index.mjs";
import Log from "@utils/log/Log";

export const login = createAppAsyncThunk(
  "AccountSlice/login",
  async (props: { authorizationCode: string; codeVerifier: string }) => {
    try {
      return await SpotSdk.login(props);
    } catch (error) {
      throw error;
    }
  },
  {}
);

export const loadAuthenticationStatus = createAppAsyncThunk(
  "AccountSlice/loadAuthenticationStatus",
  async () => {
    try {
      const isAuthenticated = await SpotSdk.isUserAuthenticated();
      Log.d("[AUTH]", `Authentication Check : ${isAuthenticated}`);
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

export const loadUsersTopItems = createAppAsyncThunk(
  "AccountSlice/loadUsersTopItems",
  async (arg: { type: TopItemType }) => {
    try {
      const result = await SpotSdk.getUsersTopItem(arg);
      console.log("Top items loaded:", result);
      return result;
    } catch (error) {
      throw error;
    }
  }
);
