import { TopItem, TopItemType } from "@/Data/sdk/CommonTypes";
import sdk from "@/Data/sdk/DataSource";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

type Size = { height: number; width: number };

const accountSlice = createSlice({
  name: "AccountSlice",
  initialState: {
    auth: {
      token: undefined as string | undefined,
      isAuthenticated: true as boolean,
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
      .addCase(loadAccountDetails.pending, (state) => {
        if (state.details.isAvailable) {
          state.details.isRefreshing = true;
        } else {
          state.details.isLoading = true;
        }
      })
      .addCase(loadAccountDetails.fulfilled, (state, action) => {
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
      .addCase(loadAccountDetails.rejected, (state, action) => {
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

export const loadAccountDetails = createAsyncThunk(
  "AccountSlice/loadAccountDetails",
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
      return await sdk.getUsersTopItem(arg);
    } catch (error) {
      throw error;
    }
  }
);

export default accountSlice.reducer;
