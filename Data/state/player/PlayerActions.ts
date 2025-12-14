import SpotifySDK from "@data/sdk/DataSource";
import { SpotifyID } from "@data/sdk/types/common";
import { ColorUtils } from "@utils/ColorUtils";
import Log from "@utils/log/Log";
import { getColors, ImageColorsResult } from "react-native-image-colors";
import { createAppAsyncThunk } from "../withTypes";

export const getCurrentlyPlaying = createAppAsyncThunk(
  "LibrarySlice/getCurrentlyPlaying",
  async (_, thunkAPI) => {
    try {
      const result = await SpotifySDK.getCurrentlyPlayingTrack();

      const trackId = result.item?.id;
      const uri = result.item?.album.images.at(0)?.url;

      if (trackId !== undefined && uri !== undefined) {
        thunkAPI.dispatch(extractAestheticColor({ trackId, uri }));
      }

      return result;
    } catch (error) {
      throw error;
    }
  }
);

export const extractAestheticColor = createAppAsyncThunk(
  "PlayerSlice/extractAestheticColor",
  async ({ uri, trackId }: { uri: string; trackId: SpotifyID }, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      if (state.player.playing.aestheticColors.ids.includes(trackId)) {
        thunkAPI.abort("value already present in state.");
        return;
      }

      const result = await getColors(uri, { cache: true, quality: "high" });
      let extractedColors;
      if (result.platform === "ios") {
        const iosResult = result as Extract<
          ImageColorsResult,
          { platform: "ios" }
        >;
        extractedColors = {
          primary: iosResult.primary,
          secondary: iosResult.secondary || iosResult.detail,
          background: ColorUtils.adjustColorForContrastHex(
            iosResult.detail || iosResult.detail,
            0.3
          ),
        };
      } else if (result.platform === "android") {
        const androidResult = result as Extract<
          ImageColorsResult,
          { platform: "android" }
        >;

        extractedColors = {
          primary: androidResult.vibrant || androidResult.dominant,
          secondary: androidResult.lightVibrant || androidResult.lightMuted,
          background: ColorUtils.adjustColorForContrastHex(
            androidResult.vibrant || androidResult.dominant,
            0.3
          ),
        };
      }

      return { extractedColors, trackId };
    } catch (error) {
      Log.d("PlayerAction", "Failed to extract colors from album art.");
    }
  }
);
