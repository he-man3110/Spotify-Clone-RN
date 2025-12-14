import { SpotifyID } from "@data/sdk/types/common";
import { selectAestheticColorsFor } from "@data/state/player/PlayerSelectors";
import { useEffect } from "react";
import {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useAppSelector } from "./useStore";

export default function useAlbumAestheticColors({
  trackId,
}: {
  trackId?: SpotifyID;
}) {
  const { primary, secondary, background } = useAppSelector((state) =>
    selectAestheticColorsFor(state, trackId)
  );

  // Shared values for color interpolation
  const colorProgress = useSharedValue(0);
  const prevPrimary = useSharedValue(primary);
  const prevSecondary = useSharedValue(secondary);
  const prevBackground = useSharedValue(background);

  // Update colors and trigger animation when new colors arrive
  useEffect(() => {
    if (primary && secondary && background) {
      // Store current colors as "previous" for smooth transition
      const currentPrimary = prevPrimary.value;
      const currentSecondary = prevSecondary.value;
      const currentBackground = prevBackground.value;

      // Reset progress and start animation
      colorProgress.value = 0;
      colorProgress.value = withTiming(1, { duration: 400 });

      // Update target colors
      prevPrimary.value = currentPrimary;
      prevSecondary.value = currentSecondary;
      prevBackground.value = currentBackground;
    }
  }, [primary, secondary, background]);

  // Interpolated colors
  const animatedPrimary = useDerivedValue(() => {
    return interpolateColor(
      colorProgress.value,
      [0, 1],
      [prevPrimary.value.toString(), primary.toString()]
    );
  });

  const animatedSecondary = useDerivedValue(() => {
    return interpolateColor(
      colorProgress.value,
      [0, 1],
      [prevSecondary.value.toString(), secondary.toString()]
    );
  });

  const animatedBackground = useDerivedValue(() => {
    return interpolateColor(
      colorProgress.value,
      [0, 1],
      [prevBackground.value.toString(), background.toString()]
    );
  });

  // Animated styles for common use cases
  const primaryStyle = useAnimatedStyle(() => ({
    backgroundColor: animatedPrimary.value,
  }));

  const secondaryStyle = useAnimatedStyle(() => ({
    backgroundColor: animatedSecondary.value,
  }));

  const backgroundStyle = useAnimatedStyle(() => ({
    backgroundColor: animatedBackground.value,
  }));

  return {
    // Raw color values (fallback if no computed colors)
    primary,
    secondary,
    background,

    // Ready-to-use animated styles
    primaryStyle,
    secondaryStyle,
    backgroundStyle,

    // Animation control
    colorProgress,
    isAnimating: colorProgress.value < 1,
  };
}
