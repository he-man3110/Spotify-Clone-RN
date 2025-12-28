import { Theme } from "./Theme.interface";

const theme: Theme = {
  typography: {
    title: {
      small: {
        fontSize: 12,
        fontFamily: "SpotifyMixUITitleVar-Regular",
      },
      medium: {
        fontSize: 14,
        fontFamily: "SpotifyMixUITitleVar-Regular",
      },
      large: {
        fontSize: 16,
        fontFamily: "SpotifyMixUITitleVar-Regular",
      },
    },
    heading: {
      small: {
        fontSize: 12,
        fontFamily: "",
      },
      medium: {
        fontSize: 14,
        fontFamily: "",
      },
      large: {
        fontSize: 16,
        fontFamily: "",
      },
    },
    subtitle: {
      small: {
        fontSize: 12,
        fontFamily: "",
      },
      medium: {
        fontSize: 14,
        fontFamily: "",
      },
      large: {
        fontSize: 16,
        fontFamily: "",
      },
    },
    body: {
      small: {
        fontSize: 12,
        fontFamily: "",
      },
      medium: {
        fontSize: 14,
        fontFamily: "",
      },
      large: {
        fontSize: 16,
        fontFamily: "",
      },
    },
    caption: {
      small: {
        fontSize: 8,
        fontFamily: "SpotifyMixUITitleVar-NarrowRegular",
      },
      medium: {
        fontSize: 10,
        fontFamily: "SpotifyMixUITitleVar-NarrowRegular",
      },
      large: {
        fontSize: 12,
        fontFamily: "SpotifyMixUITitleVar-NarrowRegular",
      },
    },
    footnote: {
      small: {
        fontSize: 12,
        fontFamily: "",
      },
      medium: {
        fontSize: 14,
        fontFamily: "",
      },
      large: {
        fontSize: 16,
        fontFamily: "",
      },
    },
  },
  colors: {
    primary: "",
    primaryLight: "",
    primaryDark: "",

    secondary: "",
    secondaryLight: "",
    secondaryDark: "",

    background: "#181818",
    backgroundElevated: "",

    surface: "#343333",
    surfaceVariant: "#515151",

    textPrimary: "#FFFFFF",
    textSecondary: "#FCFCFC",
    textDisabled: "#B3B3B3",

    border: "",
    borderLight: "",

    error: "",
    warning: "",
    success: "",
    info: "",
    white: "",
    black: "",
    transparent: "",
  },
  shadows: {
    none: {
      shadowColor: "#00000000",
      shadowRadius: 0,
      shadowOffset: undefined,
      shadowOpacity: 0,
      elevation: 0,
    },
    small: {
      shadowColor: "#00000083",
      shadowRadius: 12,
      shadowOffset: { width: 2, height: 2 },
      shadowOpacity: 1,
      elevation: 8,
    },
    medium: {
      shadowColor: "#00000083",
      shadowRadius: 12,
      shadowOffset: { width: 8, height: 8 },
      shadowOpacity: 1,
      elevation: 12,
    },
    large: {
      shadowColor: "#00000083",
      shadowRadius: 16,
      shadowOffset: { width: 16, height: 16 },
      shadowOpacity: 1,
      elevation: 16,
    },
    extraLarge: {
      shadowColor: "#00000083",
      shadowRadius: 24,
      shadowOffset: { width: 20, height: 20 },
      shadowOpacity: 1,
      elevation: 20,
    },
  },
  shapes: {
    none: {
      borderRadius: 0,
    },
    xs: {
      borderRadius: 4,
    },
    sm: {
      borderRadius: 8,
    },
    md: {
      borderRadius: 12,
    },
    lg: {
      borderRadius: 16,
    },
    xl: {
      borderRadius: 20,
    },
    full: {
      borderRadius: 24,
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
  },
};

const availableFonts = [
  "SpotifyMixUITitleVar-Black",
  "SpotifyMixUITitleVar-NarrowExtrabold",
  "SpotifyMixUITitleVar-Medium",
  "SpotifyMixUITitleVar-NarrowLight",
  "SpotifyMixUITitleVar-Thin",
  "SpotifyMixUITitleVar-Bold",
  "SpotifyMixUITitleVar-WideBlack",
  "SpotifyMixUITitleVar-NarrowMedium",
  "SpotifyMixUITitleVar-Light",
  "SpotifyMixUITitleVar-NarrowBlack",
  "SpotifyMixUITitleVar-NarrowThin",
  "SpotifyMixUITitleVar-NarrowRegular",
  "SpotifyMixUITitleVar-WideRegular",
  "SpotifyMixUITitleVar-WideExtrabold",
  "SpotifyMixUITitleVar-WideBold",
  "SpaceMono-Regular",
  "SpotRegular",
  "SpotifyMixUITitleVar-NarrowBold",
  "SpotifyMixUITitleVar-WideMedium",
  "SpotifyMixUITitleVar-Regular",
  "SpotifyMixUITitleVar-Ultra",
  "SpotifyMixUITitleVar-WideUltra",
  "SpotifyMixUITitleVar-Extrabold",
  "SpaceMono",
  "SpotifyMixUITitleVar-NarrowUltra",
  "SpotifyMixUITitleVar-WideThin",
  "SpotifyMixUITitleVar-WideLight",
];

export default theme;
