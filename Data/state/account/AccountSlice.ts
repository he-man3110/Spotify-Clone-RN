import { TopItemType } from "@/Data/sdk/CommonTypes";
import sdk from "@/Data/sdk/DataSource";
import { TopItem } from "@/Data/sdk/types/TopItemResponse";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

type Size = { height: number; width: number };

const accountSlice = createSlice({
  name: "AccountSlice",
  initialState: {
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
  },
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

export const login = createAsyncThunk(
  "AccountSlice/login",
  async (props: { authorizationCode: string; codeVerifier: string }) => {
    try {
      return await sdk.login(props);
    } catch (error) {
      throw error;
    }
  }
);

export const loadAuthenticationStatus = createAsyncThunk(
  "AccountSlice/loadAuthenticationStatus",
  async () => {
    try {
      const isAuthenticated = await sdk.isUserAuthenticated();
      return isAuthenticated;
    } catch (error) {
      throw error;
    }
  }
);

export const loadUserProfile = createAsyncThunk(
  "AccountSlice/loadUserProfile",
  async () => {
    try {
      const response = await sdk.getUserProfile();
      return response;
    } catch (error) {
      throw error;
    }
  }
);

export const loadUsersTopItems = createAsyncThunk(
  "AccountSlice/loadUsersTopItems",
  async (arg: { type: TopItemType }) => {
    try {
      const result = await sdk.getUsersTopItem(arg);
      console.log("Top items loaded:", result);
      return result;
    } catch (error) {
      throw error;
    }
  }
);

export default accountSlice.reducer;
