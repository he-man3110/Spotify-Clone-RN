import type { ExpoConfig } from "expo/config";

const config: ExpoConfig = {
  name: "Spotify",
  slug: "spotify-clone",
  version: "1.0.0",
  orientation: "portrait",
  scheme: "spotify-clone",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,

  icon: "./assets/images/icon.png",

  ios: {
    icon: "./assets/images/spotify-clone.icon",
    supportsTablet: true,
    bundleIdentifier: "com.anonymous.spotifyclone",
  },

  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#181818",
    },
    package: "com.anonymous.spotifyclone",
  },

  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },

  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        backgroundColor: "#181818",
        image: "./assets/images/splash-icon.png",
        resizeMode: "contain",
        imageWidth: 120,
      },
    ],
    [
      "expo-font",
      {
        fonts: [
          "./assets/fonts/SpaceMono-Regular.ttf",
          "./assets/fonts/SpotifyMixUITitleVar.ttf",
        ],
      },
    ],
    "expo-video",
  ],

  experiments: {
    typedRoutes: true,
  },
};

export default config;
