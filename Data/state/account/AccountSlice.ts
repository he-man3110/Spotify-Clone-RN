import { TopItem } from "@/Data/sdk/types/TopItemResponse";
import { createSlice } from "@reduxjs/toolkit";
import {
  loadAuthenticationStatus,
  loadUserProfile,
  loadUsersTopItems,
  login,
} from "./AccountActions";
import Log from "@utils/log/Log";

type Size = { height: number; width: number };

export const AccountSliceState = {
  auth: {
    token: undefined as string | undefined,
    isAuthenticated: false as boolean,
  },
  details: {
    id: undefined as string | undefined,
    displayName: undefined as string | undefined,
    email: undefined as string | undefined,
    country: undefined as string | undefined,

    profileIcon: {
      uri: undefined as string | undefined,
      size: undefined as undefined | Size,
    },
    isPremiumAccount: false as boolean,
    isLoading: true as boolean,
    isAvailable: false as boolean,
    isRefreshing: false as boolean,
  },
  topArtists: {
    list: [] as Array<TopItem>,
    isLoading: true as boolean,
    isAvailable: false as boolean,
  },
};

const accountSlice = createSlice({
  name: "AccountSlice",
  initialState: AccountSliceState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(login.pending, (state) => {
        state.auth.isAuthenticated = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.auth.token = action.payload;
        state.auth.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.auth.token = undefined;
        state.auth.isAuthenticated = false;
      })

      .addCase(loadAuthenticationStatus.fulfilled, (state, action) => {
        state.auth.isAuthenticated = action.payload;
      })

      .addCase(loadUserProfile.pending, (state) => {
        if (state.details.isAvailable) {
          state.details.isRefreshing = true;
        } else {
          state.details.isLoading = true;
        }
      })
      .addCase(loadUserProfile.fulfilled, (state, action) => {
        const profileDetails = action.payload;

        state.details.displayName = profileDetails.display_name;
        state.details.country = profileDetails.country;
        state.details.email = profileDetails.email;
        state.details.id = profileDetails.id;
        state.details.isPremiumAccount = profileDetails.product === "premium";

        const profileIconDetail = profileDetails.images.at(0);

        state.details.profileIcon = {
          uri: profileIconDetail?.url,
          size: {
            height: profileIconDetail?.height ?? 0,
            width: profileIconDetail?.width ?? 0,
          },
        };

        state.details.isAvailable = true;
      })
      .addCase(loadUserProfile.rejected, (state, action) => {
        state.details.isAvailable = false;
      })

      .addCase(loadUsersTopItems.pending, (state, action) => {
        state.topArtists.isLoading = true;
      })
      .addCase(loadUsersTopItems.fulfilled, (state, action) => {
        state.topArtists.list = action.payload.items;
        state.topArtists.isLoading = false;
        state.topArtists.isAvailable = true;
      })
      .addCase(loadUsersTopItems.rejected, (state, action) => {
        state.topArtists.isLoading = false;
        state.topArtists.isAvailable = false;
      });
  },
});

export default accountSlice.reducer;
