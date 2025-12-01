import { createSlice } from "@reduxjs/toolkit";
import { ContentStatus } from "../common/CommonTypes";
import { TopItem } from "@data/sdk/types/TopItemResponse";
import { loadUsersPlaylists, loadUsersTopItems } from "./LibraryActions";
import { PlayList } from "@data/sdk/types/Playlist";

export const LibrarySliceState = {
  playlists: {
    list: [] as Array<PlayList>,
    contentStatus: "unavailable" as ContentStatus,
  },
  tracks: {
    top: {
      list: [] as Array<TopItem>,
      contentStatus: "unavailable" as ContentStatus,
    },
  },
  artists: {
    top: {
      list: [] as Array<TopItem>,
      contentStatus: "unavailable" as ContentStatus,
    },
  },
};

const librarySlice = createSlice({
  name: "LibrarySlice",
  initialState: LibrarySliceState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadUsersTopItems.pending, (state, action) => {
        const type = action.meta.arg.type;

        const initialStatus = state.artists.top.contentStatus;
        if (initialStatus === "unavailable" || initialStatus === "error") {
          if (type === "artists") {
            state.artists.top.contentStatus = "loading";
          } else {
            state.tracks.top.contentStatus = "loading";
          }
        } else {
          if (type === "artists") {
            state.artists.top.contentStatus = "refreshing";
          } else {
            state.tracks.top.contentStatus = "refreshing";
          }
        }
      })
      .addCase(loadUsersTopItems.fulfilled, (state, action) => {
        if (action.meta.arg.type === "artists") {
          state.artists.top.list = action.payload.items;
          state.artists.top.contentStatus = "available";
        } else {
          state.tracks.top.list = action.payload.items;
          state.tracks.top.contentStatus = "available";
        }
      })
      .addCase(loadUsersTopItems.rejected, (state, action) => {
        if (!action.meta.aborted) {
          if (action.meta.arg.type === "artists")
            state.artists.top.contentStatus = "error";
          else state.tracks.top.contentStatus = "error";
        }
      })

      .addCase(loadUsersPlaylists.pending, (state) => {
        state.playlists.contentStatus = "loading";
      })
      .addCase(loadUsersPlaylists.fulfilled, (state, action) => {
        state.playlists.list = action.payload.items;
      })
      .addCase(loadUsersPlaylists.rejected, (state, action) => {
        if (!action.meta.aborted) {
          state.playlists.contentStatus = "error";
        }
      });
  },
});

export default librarySlice.reducer;
