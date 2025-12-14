import { ColorUtils, HexColorValue } from "@utils/ColorUtils";
import { LinearGradient } from "expo-linear-gradient";
import React, { PropsWithChildren, useEffect } from "react";
import {
  ColorValue,
  LayoutChangeEvent,
  ScrollView,
  StyleProp,
  StyleSheet,
  TextLayoutEvent,
  TextStyle,
  ViewStyle,
} from "react-native";
import Animated, {
  AnimatedStyle,
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const FADE_AREA_WIDTH = 16;
const SCROLL_PAUSE_DURATION = 2000;

export type TimeInMs = number;

export type AutoScrollingTextProps = PropsWithChildren<{
  style: StyleProp<AnimatedStyle<TextStyle>>;
  fadeColor?: HexColorValue | ColorValue;
  fadeAreaWidth?: number;
  pauseDuration?: TimeInMs;
  contentContainerStyle?: StyleProp<AnimatedStyle<ViewStyle>>;
}>;

function AutoScrollingText({
  children,
  style,
  fadeAreaWidth = FADE_AREA_WIDTH,
  pauseDuration = SCROLL_PAUSE_DURATION,
  fadeColor: color,
}: AutoScrollingTextProps) {
  const availableWidth = useSharedValue(0);
  const textContentSize = useSharedValue(0);
  const translateX = useSharedValue(0);

  const styles = createAutoScrollingTextStyles(fadeAreaWidth);

  const onContainerLayout = (event: LayoutChangeEvent) => {
    availableWidth.value = event.nativeEvent.layout.width;
  };

  const onTextLayout = (event: TextLayoutEvent) => {
    const line = event.nativeEvent.lines.at(0);
    if (line) {
      textContentSize.value = line.width;
      startAnimation();
    }
  };

  const startAnimation = () => {
    if (textContentSize.value > availableWidth.value) {
      const scrollValue =
        availableWidth.value - (textContentSize.value + 2 * FADE_AREA_WIDTH);
      const duration = (scrollValue / 30) * 1000;
      const timing = {
        easing: Easing.inOut(Easing.quad),
        duration: 3000,
      };
      translateX.value = withRepeat(
        withSequence(
          withDelay(pauseDuration, withTiming(scrollValue, timing)),
          withDelay(pauseDuration, withTiming(0, timing))
        ),
        -1,
        false
      );
    }
  };

  useEffect(() => {
    // Reset to the beginning.
    translateX.value = withTiming(0, { duration: 300 });

    // Start the animation after 500ms, to let the reset action complete.
    setTimeout(startAnimation, 500);

    return () => {
      cancelAnimation(translateX);
    };
  }, [children]);

  const textStyle = useAnimatedStyle(() => {
    return { transform: [{ translateX: translateX.value }] };
  }, [translateX.value]);

  return (
    <Animated.View onLayout={onContainerLayout} style={[styles.container]}>
      <FadingView
        color={color?.toString() as HexColorValue}
        style={styles.fadeStart}
      />
      <FadingView
        color={color?.toString() as HexColorValue}
        invert
        style={styles.fadeEnd}
      />
      <ScrollView
        scrollEnabled={false}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        <Animated.Text
          style={[style, textStyle, { paddingHorizontal: fadeAreaWidth }]}
          onTextLayout={onTextLayout}
          numberOfLines={1}
        >
          {children}
        </Animated.Text>
      </ScrollView>
    </Animated.View>
  );
}

export const createAutoScrollingTextStyles = (fadeAreaWidth: number) => {
  return StyleSheet.create({
    container: {},
    fadeStart: {
      width: fadeAreaWidth,
      height: "100%",
      zIndex: 1,
      position: "absolute",
      left: 0,
    },
    fadeEnd: {
      width: fadeAreaWidth,
      height: "100%",
      zIndex: 1,
      position: "absolute",
      right: 0,
    },
  });
};

export const FadingView = ({
  style,
  color = "#121212",
  invert = false,
}: {
  invert?: boolean;
  style?: StyleProp<ViewStyle>;
  color?: HexColorValue;
}) => {
  const colors: [ColorValue, ColorValue, ...ColorValue[]] = [
    color,
    ColorUtils.withAlpha(color, 0.5),
    ColorUtils.withAlpha(color, 0),
  ];

  if (invert) {
    colors.reverse();
  }

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
