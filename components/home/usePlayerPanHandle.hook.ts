import { ColorUtils, HexColorValue } from "@utils/ColorUtils";
import { useWindowDimensions } from "react-native";
import { Gesture } from "react-native-gesture-handler";
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export const usePlayerPanHandle = ({
  miniPlayerHeight,
  bottomTabBarHeight,
  backgroundColor,
}: {
  backgroundColor: HexColorValue;
  miniPlayerHeight: number;
  bottomTabBarHeight: number;
}) => {
  const { height } = useWindowDimensions();
  const ref = useAnimatedRef<Animated.View>();

  const _startColor = ColorUtils.withAlpha(backgroundColor, 0);
  const _endColor = ColorUtils.withAlpha(backgroundColor, 1);

  const _transparent = ColorUtils.withAlpha("#000000", 0);
  const _blackColor = ColorUtils.withAlpha("#121212", 1);

  const bottomThreshold = height - (bottomTabBarHeight + miniPlayerHeight);
  const currentY = useSharedValue(bottomThreshold);
  const startY = useSharedValue(0);
  const isExpanded = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onStart((e) => {
      const isTranslatingUp = e.translationY < 0;
      startY.value = currentY.value;
    })
    .onUpdate((e) => {
      const isTranslatingUp = e.translationY < 0;
      const yPosOnUpdate = startY.value + e.translationY;

      if (
        (isTranslatingUp && currentY.value > 90) ||
        (!isTranslatingUp && yPosOnUpdate <= bottomThreshold)
      ) {
        currentY.value = startY.value + e.translationY;
      }
    })
    .onEnd((e) => {
      const isTranslatingUp = e.translationY < 0;
      const translation = Math.abs(startY.value - currentY.value);

      if (
        (isTranslatingUp && translation < 100 && isExpanded.value !== 1) ||
        (!isTranslatingUp && translation > 100)
      ) {
        isExpanded.value = 0;
        currentY.value = withTiming(bottomThreshold, {
          duration: 200,
        });
      } else if (isTranslatingUp || isExpanded.value === 1) {
        isExpanded.value = 1;
        currentY.value = withTiming(0, {
          duration: 200,
        });
      }
    });

  const containerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: currentY.value }],
    };
  });

  const miniPlayerStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        currentY.value,
        [bottomThreshold, bottomThreshold - 30],
        [1, 0]
      ),
    };
  });

  const bottomTabBarStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            currentY.value,
            [bottomThreshold, 0],
            [0, height - bottomTabBarHeight + 12]
          ),
        },
      ],
      backgroundColor: interpolateColor(
        currentY.value,
        [bottomThreshold, bottomThreshold - 5],
        [_transparent, _blackColor]
      ),
    };
  });

  const gradientStyle = useAnimatedStyle(() => {
    return {
      backgroundColor:
        currentY.value === bottomThreshold ? _transparent : _blackColor,
    };
  });

  const mainPlayerStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        currentY.value,
        [bottomThreshold, bottomThreshold - 30],
        [0, 1]
      ),
    };
  });

  const playerContainerStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        currentY.value,
        [bottomThreshold, bottomThreshold - 30],
        [_startColor, _endColor]
      ),
    };
  });

  return {
    ref,
    panGesture,
    containerStyle,
    playerContainerStyle,
    miniPlayerStyle,
    mainPlayerStyle,
    bottomTabBarStyle,
    gradientStyle,
  };
};
