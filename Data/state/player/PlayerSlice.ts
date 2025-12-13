import { CurrentlyPlayingTrackResponse } from "@data/sdk/types/player/CurrentlyPlayingTrackResponse";
import { createSlice } from "@reduxjs/toolkit";
import { ContentStatus } from "../common/CommonTypes";
import { getCurrentlyPlaying } from "./PlayerActions";

export const PlayerSliceState = {
  playing: {
    current: undefined as CurrentlyPlayingTrackResponse | undefined,
    isPlaying: false as boolean,
    contentStatus: "unavailable" as ContentStatus,
  },
};

const playerSlice = createSlice({
  name: "PlayerSlice",
  initialState: PlayerSliceState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCurrentlyPlaying.pending, (state) => {
        state.playing.contentStatus = "loading";
      })
      .addCase(getCurrentlyPlaying.fulfilled, (state, action) => {
        state.playing.current = action.payload;
        state.playing.contentStatus = "available";
      })
      .addCase(getCurrentlyPlaying.rejected, (state) => {
        state.playing.contentStatus = "error";
      });
  },
});

export default playerSlice.reducer;
