import { ColorUtils } from "@utils/ColorUtils";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { EdgeInsets } from "react-native-safe-area-context";
import MiniPlayingBar from "../home/MiniPlayingBar";
import { usePlayerPanHandle } from "../home/usePlayerPanHandle.hook";
import NowPlayingView from "../Player/NowPlayingView";
import TabBarProvider from "./TabBarProvider";

const BOTTOM_TAB_BAR_HEIGHT = 80;
const MINI_PLAYER_HEIGHT = 68;

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export default function BottomTabBar(props: BottomTabBarProps) {
  const styles = createStyles(props.insets);

  const {
    ref,
    panGesture,
    containerStyle,
    playerContainerStyle,
    mainPlayerStyle,
    miniPlayerStyle,
    bottomTabBarStyle,
    gradientStyle,
  } = usePlayerPanHandle({
    miniPlayerHeight: MINI_PLAYER_HEIGHT,
    bottomTabBarHeight: BOTTOM_TAB_BAR_HEIGHT,
    backgroundColor: "#32CD32",
  });

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <GestureDetector gesture={panGesture}>
        <Animated.View
          ref={ref}
          style={[styles.playerContainer, playerContainerStyle]}
        >
          <MiniPlayingBar style={miniPlayerStyle} />
          <NowPlayingView style={mainPlayerStyle} />
        </Animated.View>
      </GestureDetector>
      <Animated.View
        style={{
          width: "100%",
          height: MINI_PLAYER_HEIGHT,
        }}
      />
      <Animated.View
        style={[
          {
            paddingTop: 8,
            height: BOTTOM_TAB_BAR_HEIGHT,
            zIndex: 3,
            flexDirection: "row",
          },
          bottomTabBarStyle,
        ]}
      >
        <TabBarProvider {...props} />
      </Animated.View>

      <AnimatedBlurView style={[styles.bottomTabBarContainer]} intensity={5}>
        <LinearGradient
          colors={[
            ColorUtils.withAlpha("#121212", 0.7),
            ColorUtils.withAlpha("#121212", 0.9),
            ColorUtils.withAlpha("#121212", 0.99),
            ColorUtils.withAlpha("#121212", 1),
          ]}
          locations={[0.1, 0.4, 0.6, 1]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={[styles.background]}
        />
      </AnimatedBlurView>
    </Animated.View>
  );
}

function createStyles(insets: EdgeInsets) {
  return StyleSheet.create({
    container: {
      position: "absolute",
      width: "100%",
      height: "100%",
    },
    playerContainer: {
      width: "100%",
      height: "100%",
      position: "absolute",
      zIndex: 2,
      paddingHorizontal: 8,
      borderRadius: 16,
    },
    bottomTabBarContainer: {
      position: "absolute",
      width: "100%",
      height: MINI_PLAYER_HEIGHT + BOTTOM_TAB_BAR_HEIGHT,
    },
    background: {
      flex: 1,
    },
    iconContainer: {
      gap: 4,
      alignItems: "center",
    },
    focusedIcon: {
      width: 24,
      height: 24,
      tintColor: "#fff",
    },
    icon: {
      width: 24,
      height: 24,
      tintColor: "#b3b3b3",
    },
    focusedLabel: {
      color: "#fff",
    },
    label: {
      color: "#b3b3b3",
    },
  });
}
