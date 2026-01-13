import { TextStyle, ViewStyle } from "react-native";

export interface Typography {
  title: {
    small: TextStyle;
    medium: TextStyle;
    large: TextStyle;
  };
  heading: {
    small: TextStyle;
    medium: TextStyle;
    large: TextStyle;
  };
  subtitle: {
    small: TextStyle;
    medium: TextStyle;
    large: TextStyle;
  };
  body: {
    small: TextStyle;
    medium: TextStyle;
    large: TextStyle;
  };
  caption: {
    small: TextStyle;
    medium: TextStyle;
    large: TextStyle;
  };
  footnote: {
    small: TextStyle;
    medium: TextStyle;
    large: TextStyle;
  };
}

export interface Colors {
  primary: string;
  primaryLight: string;
  primaryDark: string;

  secondary: string;
  secondaryLight: string;
  secondaryDark: string;

  background: string;
  backgroundElevated: string;

  surface: string;
  surfaceVariant: string;

  textPrimary: string;
  textSecondary: string;
  textDisabled: string;

  iconPrimary: string;

  border: string;
  borderLight: string;

  error: string;
  warning: string;
  success: string;

  info: string;

  white: string;
  black: string;
  transparent: string;
}

export interface Shadows {
  none: ViewStyle;
  small: ViewStyle;
  medium: ViewStyle;
  large: ViewStyle;
  extraLarge: ViewStyle;
}

type BorderRadius = Pick<ViewStyle, "borderRadius">;
export interface Radius {
  none: BorderRadius;
  xs: BorderRadius;
  sm: BorderRadius;
  md: BorderRadius;
  lg: BorderRadius;
  xl: BorderRadius;
  full: BorderRadius;
}

export interface Spacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

export interface Theme {
  typography: Typography;
  colors: Colors;
  shadows: Shadows;
  shapes: Radius;
  spacing: Spacing;
}
