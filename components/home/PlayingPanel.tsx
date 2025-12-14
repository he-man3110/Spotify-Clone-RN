import React from "react";
import { StyleSheet } from "react-native";
import { GestureDetector } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import NowPlayingView from "../Player/NowPlayingView";
import MiniPlayingBar from "./MiniPlayingBar";
import { usePlayerPanHandle } from "./usePlayerPanHandle.hook";

/** @deprecated */
export default function PlayerPanel() {
  const styles = createPlayerPanelStyles();

  const { ref, panGesture, containerStyle, mainPlayerStyle, miniPlayerStyle } =
    usePlayerPanHandle({
      backgroundColor: "#000000",
      miniPlayerHeight: 0,
      bottomTabBarHeight: 0,
    });

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View ref={ref} style={[styles.container, containerStyle]}>
        <Animated.View
          style={[
            {
              borderRadius: 12,
              position: "absolute",
              width: "104%",
              height: "100%",
              overflow: "hidden",
              backgroundColor: "#586E86",
            },
            mainPlayerStyle,
          ]}
        />
        <MiniPlayingBar style={miniPlayerStyle} />
        <NowPlayingView style={mainPlayerStyle} />
      </Animated.View>
    </GestureDetector>
  );
}

const createPlayerPanelStyles = () => {
  return StyleSheet.create({
    container: {
      width: "100%",
      height: "100%",
      bottom: 90,
      position: "absolute",
      zIndex: 2,
      paddingHorizontal: 8,
      borderRadius: 16,
    },
  });
};
