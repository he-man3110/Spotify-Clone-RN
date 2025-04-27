import { ColorUtils, HexColorValue } from "@/utils/ColorUtils";
import { LinearGradient } from "expo-linear-gradient";
import React, { PropsWithChildren, useEffect } from "react";
import {
  LayoutChangeEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleProp,
  TextLayoutEventData,
  TextStyle,
  ViewStyle,
} from "react-native";
import Animated, {
  AnimatedStyle,
  Easing,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const FADE_AREA_WIDTH = 16;

function AutoScrollingText({
  children,
  style,
  color,
  contentContainerStyle,
}: PropsWithChildren<{
  style: StyleProp<AnimatedStyle<TextStyle>>;
  color?: HexColorValue;
  contentContainerStyle?: StyleProp<AnimatedStyle<ViewStyle>>;
}>) {
  const availableWidth = useSharedValue(0);
  const textContentSize = useSharedValue(0);
  const movingForward = useSharedValue(1);
  const translateX = useSharedValue(FADE_AREA_WIDTH);

  const onContainerLayout = (event: LayoutChangeEvent) => {
    availableWidth.value = event.nativeEvent.layout.width;
  };

  const onTextLayout = (event: NativeSyntheticEvent<TextLayoutEventData>) => {
    textContentSize.value = event.nativeEvent.lines.at(0)!.width;
  };

  const flipDirection = () => {
    setTimeout(() => {
      movingForward.value = 1 - movingForward.value;
    }, 2_000);
  };

  const textStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translateX.value,
        },
      ],
    };
  }, [translateX.value]);

  useAnimatedReaction(
    () => movingForward.value,
    () => {
      if (textContentSize.value > availableWidth.value) {
        translateX.value = withTiming(
          movingForward.value === 1
            ? FADE_AREA_WIDTH
            : availableWidth.value - textContentSize.value - FADE_AREA_WIDTH,
          {
            duration:
              (Math.abs(
                availableWidth.value - textContentSize.value - FADE_AREA_WIDTH
              ) /
                30) *
              1_000,
            easing: Easing.linear,
          },
          (finished) => {
            if (finished) {
              runOnJS(flipDirection)();
            }
          }
        );
      }
    }
  );

  useEffect(() => {
    flipDirection();
  }, []);

  return (
    <Animated.View onLayout={onContainerLayout} style={[contentContainerStyle]}>
      {color && (
        <FadingView
          colors={[
            color,
            ColorUtils.withAlpha(color, 0.5),
            ColorUtils.withAlpha(color, 0),
          ]}
          style={{
            width: FADE_AREA_WIDTH,
            height: "100%",
            zIndex: 1,
            position: "absolute",
            left: 0,
          }}
        />
      )}
      {color && (
        <FadingView
          colors={[
            ColorUtils.withAlpha(color, 0),
            ColorUtils.withAlpha(color, 0.5),
            color,
          ]}
          style={{
            width: FADE_AREA_WIDTH,
            height: "100%",
            zIndex: 1,
            position: "absolute",
            right: 0,
          }}
        />
      )}
      <ScrollView
        scrollEnabled={false}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        <Animated.Text
          style={[style, textStyle]}
          onTextLayout={onTextLayout}
          numberOfLines={1}
        >
          {children}
        </Animated.Text>
      </ScrollView>
    </Animated.View>
  );
}

export const FadingView = ({
  style,
  colors,
}: {
  invert?: boolean;
  style?: StyleProp<ViewStyle>;
  colors: [string, string, ...string[]];
}) => {
  return (
    <LinearGradient
      colors={colors}
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 0.5 }}
      style={[
        {
          width: 16,
        },
        style,
      ]}
    />
  );
};

export default AutoScrollingText;
