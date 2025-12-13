import React, { PropsWithChildren, useEffect } from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import { getColors, ImageColorsResult } from "react-native-image-colors";
import Animated, {
  AnimatedStyle,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface ImageBackgroundViewProps {
  imageUri?: string;
  style?: StyleProp<AnimatedStyle<ViewStyle>>;
  fallbackColor?: string;
  animationDuration?: number;
}

export default function ImageBackgroundView({
  imageUri,
  style,
  children,
  fallbackColor = "#1b1c1d",
  animationDuration = 300,
}: PropsWithChildren<ImageBackgroundViewProps>) {
  const colorProgress = useSharedValue(0);
  const backgroundColor = useSharedValue(fallbackColor);

  useEffect(() => {
    if (!imageUri) {
      // Reset to fallback color if no image
      colorProgress.value = withTiming(0, { duration: animationDuration });
      return;
    }

    const extractColors = async () => {
      try {
        const result = await getColors(imageUri, {
          fallback: fallbackColor,
          cache: true,
          key: imageUri,
        });

        let extractedColors = {
          primary: fallbackColor,
          secondary: fallbackColor,
          background: adjustColorForContrast(fallbackColor, 0.3),
        };

        if (result.platform === "ios") {
          const iosResult = result as Extract<
            ImageColorsResult,
            { platform: "ios" }
          >;

          extractedColors = {
            primary: iosResult.primary || fallbackColor,
            secondary: iosResult.secondary || iosResult.detail || fallbackColor,
            background: adjustColorForContrast(
              iosResult.detail || iosResult.detail || fallbackColor,
              0.3
            ),
          };
        } else if (result.platform === "android") {
          const androidResult = result as Extract<
            ImageColorsResult,
            { platform: "android" }
          >;
          extractedColors = {
            primary:
              androidResult.vibrant || androidResult.dominant || fallbackColor,
            secondary:
              androidResult.lightVibrant ||
              androidResult.lightMuted ||
              fallbackColor,
            background: adjustColorForContrast(
              androidResult.vibrant || androidResult.dominant || fallbackColor,
              0.3
            ),
          };
        }

        // Update the shared values
        backgroundColor.value = extractedColors.secondary;
        colorProgress.value = withTiming(1, { duration: animationDuration });
      } catch (error) {
        console.error("Color extraction failed:", error);
        // Reset to fallback on error
        colorProgress.value = withTiming(0, { duration: animationDuration });
      }
    };

    extractColors();
  }, [imageUri, fallbackColor, animationDuration]);

  const overlayStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      colorProgress.value,
      [0, 1],
      ["transparent", backgroundColor.value]
    ),
    opacity: colorProgress.value * 0.8,
  }));

  return (
    <Animated.View style={[styles.container, style]}>
      {/* Overlay for smooth color transitions */}
      <Animated.View style={[styles.absoluteBackground, overlayStyle]} />
      <Animated.View
        style={[styles.absoluteBackground, { backgroundColor: "#0a0a0ac2" }]}
      />
      {/* Children content on top */}
      {children}
    </Animated.View>
  );
}

// Helper function to adjust color brightness for better contrast
const adjustColorForContrast = (
  hexColor: string,
  opacity: number = 0.4
): string => {
  // Handle rgba/rgb colors
  if (hexColor.startsWith("rgb")) {
    return hexColor;
  }

  // Convert hex to RGB
  const hex = hexColor.replace("#", "");
  const r = parseInt(hex.substr(0, 2), 16) || 0;
  const g = parseInt(hex.substr(2, 2), 16) || 0;
  const b = parseInt(hex.substr(4, 2), 16) || 0;

  // Darken the color for background use
  const darkR = Math.floor(r * opacity);
  const darkG = Math.floor(g * opacity);
  const darkB = Math.floor(b * opacity);

  return `rgb(${darkR}, ${darkG}, ${darkB})`;
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 0,
    borderColor: "lime",
    overflow: "hidden",
  },
  absoluteBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  contentContainer: {
    flex: 1,
    zIndex: 1,
  },
});

// Export hook for external use
export const useImageColors = (
  imageUri: string,
  fallbackColor: string = "#1DB954"
) => {
  const [colors, setColors] = React.useState({
    primary: fallbackColor,
    secondary: fallbackColor,
    background: adjustColorForContrast(fallbackColor, 0.3),
    isLoading: true,
  });

  useEffect(() => {
    if (!imageUri) {
      setColors((prev) => ({ ...prev, isLoading: false }));
      return;
    }

    const extractColors = async () => {
      try {
        const result = await getColors(imageUri, {
          fallback: fallbackColor,
          cache: true,
          key: imageUri,
        });

        let extractedColors = {
          primary: fallbackColor,
          secondary: fallbackColor,
          background: adjustColorForContrast(fallbackColor, 0.3),
        };

        if (result.platform === "ios") {
          const iosResult = result as Extract<
            ImageColorsResult,
            { platform: "ios" }
          >;
          extractedColors = {
            primary: iosResult.primary || fallbackColor,
            secondary: iosResult.secondary || iosResult.detail || fallbackColor,
            background: adjustColorForContrast(
              iosResult.secondary || iosResult.detail || fallbackColor,
              0.3
            ),
          };
        } else if (result.platform === "android") {
          const androidResult = result as Extract<
            ImageColorsResult,
            { platform: "android" }
          >;
          extractedColors = {
            primary:
              androidResult.vibrant || androidResult.dominant || fallbackColor,
            secondary:
              androidResult.lightVibrant ||
              androidResult.lightMuted ||
              fallbackColor,
            background: adjustColorForContrast(
              androidResult.vibrant || androidResult.dominant || fallbackColor,
              0.3
            ),
          };
        }

        setColors({
          ...extractedColors,
          isLoading: false,
        });
      } catch (error) {
        console.error("Color extraction failed:", error);
        setColors((prev) => ({ ...prev, isLoading: false }));
      }
    };

    extractColors();
  }, [imageUri, fallbackColor]);

  return colors;
};
