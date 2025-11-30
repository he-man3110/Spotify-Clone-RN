import { SptImage } from "@Data/sdk/types/SptImage";
import { ContentStatus } from "../common/CommonTypes";
import { RootState } from "../store";
import { isAllAvailable } from "@utils/CommonUtils";

export const selectUsersHomeItems = (state: RootState) => {
  const list: Array<{ title: string; image: SptImage }> = [];

  if (state.library.playlists.contentStatus === "available") {
    list.push({
      title: "Liked Songs",
      image: {
        url: "https://misc.scdn.co/liked-songs/liked-songs-640.jpg",
        width: 20,
        height: 20,
      } as SptImage,
    });

    const playList = state.library.playlists.list.at(0);
    if (playList) {
      list.push({
        title: playList.name,
        image: playList.images.at(0)!,
      });
    }

    if (state.library.artists.top.contentStatus === "available") {
      state.library.artists.top.list.splice(0, 2).forEach((i) => {
        list.push({
          title: i.name,
          image: i.images.at(0)!,
        });
      });
    }

    if (state.library.tracks.top.contentStatus === "available") {
      state.library.tracks.top.list.splice(0, 2).forEach((i) => {
        list.push({
          title: i.name,
          image: i.images.at(0)!,
        });
      });
    }
  }

  const contentStatus: ContentStatus = isAllAvailable([
    state.library.artists.top.contentStatus,
    state.library.tracks.top.contentStatus,
    state.library.playlists.contentStatus,
  ])
    ? "available"
    : "loading";

  return {
    list,
    contentStatus,
  };
};
