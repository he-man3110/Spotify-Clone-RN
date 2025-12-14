import SpotSdk from "@data/sdk/DataSource";
import { SDKListRange, SDKRequest } from "@data/sdk/SDKTypes";
import { UsersTopItemRequest } from "@data/sdk/types/top-items/UsersTopItemRequest";
import Logger from "@utils/log/Log";
import { createAppAsyncThunk } from "../withTypes";

const Log = Logger.createTaggedLogger("LibraryActions");

export const loadUsersTopItems = createAppAsyncThunk(
  "LibrarySlice/loadUsersTopItems",
  async (arg: SDKListRange<UsersTopItemRequest>) => {
    try {
      const result = await SpotSdk.getUsersTopItem(arg);
      Log.v(`Users Top Items : ${result}`);
      return result;
    } catch (error) {
      throw error;
    }
  }
);

export const loadUsersPlaylists = createAppAsyncThunk(
  "LibrarySlice/loadUsersPlaylists",
  async (arg: SDKRequest<SDKListRange> | undefined = {}) => {
    try {
      const result = await SpotSdk.getUsersPlaylists(arg);
      Log.d(`Users Playlists : ${result}`);
      return result;
    } catch (error) {
      throw error;
    }
  }
);

export const loadTopHomeItems = createAppAsyncThunk(
  "AccountSlice/loadTopItems",
  async (_, thunkAPI) => {
    try {
      thunkAPI.dispatch(loadUsersTopItems({ type: "tracks", limit: 5 }));
      thunkAPI.dispatch(loadUsersTopItems({ type: "artists", limit: 5 }));
      thunkAPI.dispatch(loadUsersPlaylists({}));
    } catch (error) {
      throw error;
    }
  }
);
