import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../store";

export const selectCurrentlyPlaying = createSelector(
  [(state: RootState) => state.player],
  (player) => {
    const current = player.playing.current;
    const artistsDescription = current?.item?.artists
      .map((a) => a.name)
      .join(",");
    const image = current?.item?.album.images.at(0);

    return {
      isPlaying: player.playing.current?.is_playing ?? false,
      title: player.playing.current?.item?.name,
      author: artistsDescription,
      progressMs: current?.progress_ms ?? 0,
      totalMs: current?.item?.duration_ms ?? 0,
      image,
    };
  }
);
