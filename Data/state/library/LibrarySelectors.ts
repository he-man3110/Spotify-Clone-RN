import { SptImage } from "@data/sdk/types/SptImage";
import { createSelector } from "@reduxjs/toolkit";
import { ContentStatus } from "../common/CommonTypes";
import { RootState } from "../store";

export const selectUsersHomeItems = createSelector(
  [(state: RootState) => state.library],
  (library) => {
    const list: Array<{ title: string; image: SptImage }> = [];

    if (library.playlists.contentStatus === "available") {
      list.push({
        title: "Liked Songs",
        image: {
          url: "https://misc.scdn.co/liked-songs/liked-songs-640.jpg",
          width: 20,
          height: 20,
        } as SptImage,
      });

      const playList = library.playlists.list.at(0);
      if (playList) {
        list.push({
          title: playList.name,
          image: playList.images.at(0)!,
        });
      }

      if (library.artists.top.contentStatus === "available") {
        library.artists.top.list.slice(0, 2).forEach((i) => {
          list.push({
            title: i.name,
            image: i.images.at(0)!,
          });
        });
      }

      if (library.tracks.top.contentStatus === "available") {
        library.tracks.top.list.slice(0, 2).forEach((i) => {
          list.push({
            title: i.name,
            image: i.album.images.at(0)!,
          });
        });
      }
    }

    const dependentContentStatuses = [
      library.artists.top.contentStatus,
      library.tracks.top.contentStatus,
      library.playlists.contentStatus,
    ];

    const contentStatus: ContentStatus = ContentStatus.requireAll(
      dependentContentStatuses
    );

    return {
      list,
      contentStatus,
    };
  }
);
