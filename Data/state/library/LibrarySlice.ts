import { PlayList } from "@data/sdk/types/Playlist";
import { Artist } from "@data/sdk/types/top-items/Artist";
import { Track } from "@data/sdk/types/top-items/Track";
import { createSlice } from "@reduxjs/toolkit";
import { ContentStatus } from "../common/CommonTypes";
import { loadUsersPlaylists, loadUsersTopItems } from "./LibraryActions";

export const LibrarySliceState = {
  playlists: {
    list: [] as Array<PlayList>,
    contentStatus: "unavailable" as ContentStatus,
  },
  tracks: {
    top: {
      list: [] as Array<Track>,
      contentStatus: "unavailable" as ContentStatus,
    },
  },
  artists: {
    top: {
      list: [] as Array<Artist>,
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
        const list = action.payload.items;
        if (action.meta.arg.type === "artists") {
          state.artists.top.list = list as Array<Artist>;
          state.artists.top.contentStatus = "available";
        } else {
          state.tracks.top.list = list as Array<Track>;
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
        state.playlists.contentStatus = "available";
      })
      .addCase(loadUsersPlaylists.rejected, (state, action) => {
        if (!action.meta.aborted) {
          state.playlists.contentStatus = "error";
        }
      });
  },
});

export default librarySlice.reducer;
