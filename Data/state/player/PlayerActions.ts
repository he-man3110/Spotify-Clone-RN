import SpotifySDK from "@data/sdk/DataSource";
import { createAppAsyncThunk } from "../withTypes";

export const getCurrentlyPlaying = createAppAsyncThunk(
  "LibrarySlice/getCurrentlyPlaying",
  async (_, thunkAPI) => {
    try {
      const result = await SpotifySDK.getCurrentlyPlayingTrack();
      return result;
    } catch (error) {
      throw error;
    }
  }
);
