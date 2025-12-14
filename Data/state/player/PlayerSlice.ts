import { SpotifyID } from "@data/sdk/types/common";
import { CurrentlyPlayingTrackResponse } from "@data/sdk/types/player/CurrentlyPlayingTrackResponse";
import { createSlice } from "@reduxjs/toolkit";
import { ContentStatus, ImageColorAnalysisResult } from "../common/CommonTypes";
import { extractAestheticColor, getCurrentlyPlaying } from "./PlayerActions";

export const PlayerSliceState = {
  playing: {
    current: undefined as CurrentlyPlayingTrackResponse | undefined,
    isPlaying: false as boolean,
    contentStatus: "unavailable" as ContentStatus,
    aestheticColors: {
      values: {} as Record<SpotifyID, ImageColorAnalysisResult>,
      ids: [] as Array<SpotifyID>,
    },
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
      })

      .addCase(extractAestheticColor.fulfilled, (state, action) => {
        if (action.payload) {
          const { trackId, extractedColors } = action.payload;
          if (
            !state.playing.aestheticColors.ids.includes(trackId) &&
            extractedColors
          ) {
            state.playing.aestheticColors.ids.push(trackId);
            state.playing.aestheticColors.values[trackId] = extractedColors;
          }
        }
      });
  },
});

export default playerSlice.reducer;
