import { SpotifyID } from "@data/sdk/types/common";
import { CurrentlyPlayingTrackResponse } from "@data/sdk/types/player/CurrentlyPlayingTrackResponse";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Log from "@utils/log/Log";
import { ContentStatus, ImageColorAnalysisResult } from "../common/CommonTypes";
import {
  extractAestheticColor,
  getCurrentlyPlaying,
  setSeekerPosition,
} from "./PlayerActions";

export const PlayerSliceState = {
  currentlyPlaying: {
    track: undefined as CurrentlyPlayingTrackResponse | undefined,
    progress: {
      preemptive: undefined as
        | {
            capturedTimestamp: number;
            previousProgressMs: number;
          }
        | undefined,

      currentMs: undefined as number | undefined,
      totalMs: undefined as number | undefined,
    },
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
  reducers: {
    preemptivelyUpdateProgress(
      state,
      action: PayloadAction<{ value: number }>
    ) {
      const { value } = action.payload;
      if (state.currentlyPlaying.progress.currentMs) {
        state.currentlyPlaying.progress.preemptive = {
          capturedTimestamp: Date.now(),
          previousProgressMs: state.currentlyPlaying.progress.currentMs,
        };
        state.currentlyPlaying.progress.currentMs = value;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCurrentlyPlaying.pending, (state) => {
        state.currentlyPlaying.contentStatus = "loading";
      })
      .addCase(getCurrentlyPlaying.fulfilled, (state, action) => {
        state.currentlyPlaying.track = action.payload;
        state.currentlyPlaying.isPlaying = action.payload.is_playing;

        const shouldAdvanceProgress =
          state.currentlyPlaying.progress.preemptive === undefined;

        let progressMs = action.payload.progress_ms;
        // if (shouldAdvanceProgress && progressMs) {
        //   progressMs += 3_000;
        // }

        state.currentlyPlaying.progress = {
          currentMs: progressMs ?? undefined,
          preemptive: undefined,
          totalMs: action.payload.item?.duration_ms,
        };
        state.currentlyPlaying.contentStatus = "available";
      })
      .addCase(getCurrentlyPlaying.rejected, (state) => {
        state.currentlyPlaying.contentStatus = "error";
      })

      .addCase(setSeekerPosition.fulfilled, (state, action) => {
        if (action.payload) {
          state.currentlyPlaying.progress.preemptive = undefined;
        } else {
          if (
            state.currentlyPlaying.progress.preemptive &&
            state.currentlyPlaying.progress.preemptive.previousProgressMs
          ) {
            const timeElapsed =
              Date.now() -
              state.currentlyPlaying.progress.preemptive.capturedTimestamp;

            const previousProgress =
              state.currentlyPlaying.progress.preemptive.previousProgressMs;

            Log.d(
              "[MC]",
              `TimeElapsed: ${Math.round(timeElapsed / 1000)}s previousProgress: ${Math.round(previousProgress / 1000)}s`
            );
            state.currentlyPlaying.progress.currentMs =
              previousProgress + timeElapsed;
          }
        }
      })

      .addCase(extractAestheticColor.fulfilled, (state, action) => {
        if (action.payload) {
          const { trackId, extractedColors } = action.payload;
          if (
            !state.currentlyPlaying.aestheticColors.ids.includes(trackId) &&
            extractedColors
          ) {
            state.currentlyPlaying.aestheticColors.ids.push(trackId);
            state.currentlyPlaying.aestheticColors.values[trackId] =
              extractedColors;
          }
        }
      });
  },
});

export const { preemptivelyUpdateProgress } = playerSlice.actions;
export default playerSlice.reducer;
