import {
  FALLBACK_AESTHETIC_BG_COLOR,
  FALLBACK_AESTHETIC_COLOR,
} from "@data/Constants";
import { SpotifyID } from "@data/sdk/types/common";
import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

export const selectCurrentlyPlaying = createSelector(
  [(state: RootState) => state.player],
  (player) => {
    const current = player.currentlyPlaying.track;
    const artistsDescription = current?.item?.artists
      .map((a) => a.name)
      .join(",");
    const image = current?.item?.album.images.at(0);

    return {
      trackId: player.currentlyPlaying.track?.item?.id,
      isPlaying: player.currentlyPlaying.isPlaying ?? false,
      title: player.currentlyPlaying.track?.item?.name,
      author: artistsDescription,
      progressMs: current?.progress_ms ?? 0,
      totalMs: current?.item?.duration_ms ?? 0,
      image,
    };
  }
);

export const selectCurrentTrackProgress = createSelector(
  [(state: RootState) => state.player.currentlyPlaying],
  (state) => {
    const currentMs = state.progress.currentMs ?? 0;
    const totalMs = state.progress.totalMs ?? 0;

    return {
      seekerAnimationDuration: totalMs - currentMs,
      currentMs,
      totalMs,
    };
  }
);

export const selectAestheticColorsFor = createSelector(
  [
    (state: RootState) => state.player,
    (_1, trackId: SpotifyID | undefined) => trackId,
  ],
  (playerState, trackId) => {
    if (
      trackId &&
      playerState.currentlyPlaying.aestheticColors.ids.includes(trackId)
    ) {
      const colorValues =
        playerState.currentlyPlaying.aestheticColors.values[trackId];
      return colorValues;
    }

    return {
      primary: FALLBACK_AESTHETIC_COLOR,
      secondary: FALLBACK_AESTHETIC_COLOR,
      background: FALLBACK_AESTHETIC_BG_COLOR,
    };
  }
);
