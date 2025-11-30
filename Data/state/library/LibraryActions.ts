import { UsersTopItemRequest } from "@Data/sdk/types/request/UsersTopItemRequest";
import { createAppAsyncThunk } from "../withTypes";
import Logger from "@utils/log/Log";
import SpotSdk from "@/Data/sdk/DataSource";
import { SDKListRange } from "@Data/sdk/SDKTypes";

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
  async (arg: SDKListRange | undefined = {}) => {
    try {
      const result = await SpotSdk.getUsersPlaylists(arg);
      Log.v(`Users Playlists : ${result}`);
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
      thunkAPI.dispatch(loadUsersPlaylists());
    } catch (error) {
      throw error;
    }
  }
);
