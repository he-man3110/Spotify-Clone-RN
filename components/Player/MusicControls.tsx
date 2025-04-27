import React from "react";
import { LayoutChangeEvent, StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  clamp,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import PressableIcon from "../base/PressableIcon";
import PlayButton from "./PlayButton";
import RandomizeButton from "./RandomizeButton";
import RepeatButton from "./RepeatButton";

const HANDLE_SIZE = 12;
const SEEKER_PADDING = 8;

function MusicControls() {
  const styles = createMusicControlStyles();

  const width = useSharedValue<number>(0);

  const seekerX = useSharedValue(-SEEKER_PADDING);
  const seekerPosX = useSharedValue(0);
  const seekerScale = useSharedValue(1);
  const progressBarWidth = useDerivedValue(() => {
    return seekerX.value + SEEKER_PADDING + HANDLE_SIZE / 2;
  });

  const progress = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .minDistance(1)
    .onTouchesDown(() => {
      seekerScale.value = 1.2;
    })
    .onUpdate((e) => {
      const posX = seekerPosX.value + e.translationX;
      seekerX.value = clamp(
        posX,
        -SEEKER_PADDING,
        width.value - HANDLE_SIZE - SEEKER_PADDING
      );
    })
    .onEnd((e) => {
      seekerPosX.value = seekerX.value;
    })
    .onTouchesUp((e) => {
      seekerScale.value = 1;
    });

  const seekerStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: seekerX.value },
        { scale: withSpring(seekerScale.value) },
      ],
    };
  });

  const progressBarStyle = useAnimatedStyle(() => {
    return {
      width: progressBarWidth.value,
    };
  });

  const onLayout = (e: LayoutChangeEvent) => {
    width.value = e.nativeEvent.layout.width;
  };

  const onPrevious = () => {};

  const onNext = () => {};

  return (
    <Animated.View style={styles.container}>
      <Animated.View style={styles.seekerContainer} onLayout={onLayout}>
        <Animated.View style={styles.progress} />
        <Animated.View style={[styles.progressBar, progressBarStyle]} />
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.seekerHandle, seekerStyle]}>
            <Animated.View style={styles.seeker} />
          </Animated.View>
        </GestureDetector>
      </Animated.View>
      <View style={styles.timeContainer}>
        <Text style={styles.time}>0:00</Text>
        <Text style={styles.time}>-3:33</Text>
      </View>
      <View style={styles.controlsContainer}>
        <RandomizeButton />
        <PressableIcon
          source={require("../../assets/svgs/previous.svg")}
          imageStyle={{ width: 22, height: 22, tintColor: "#fff" }}
          onPress={onPrevious}
        />
        <PlayButton mode="large" />
        <PressableIcon
          source={require("../../assets/svgs/next.svg")}
          imageStyle={{ width: 22, height: 22, tintColor: "#fff" }}
          onPress={onNext}
        />
        <RepeatButton />
      </View>
    </Animated.View>
  );
}

const createMusicControlStyles = () => {
  return StyleSheet.create({
    container: {},
    seekerContainer: {
      height: HANDLE_SIZE + SEEKER_PADDING * 2,
      justifyContent: "center",
    },
    progress: {
      position: "absolute",
      height: 5,
      width: "100%",
      borderRadius: 4,
      backgroundColor: "#4D4C4C5f",
    },
    progressBar: {
      position: "absolute",
      height: 5,
      width: "50%",
      borderRadius: 4,
      backgroundColor: "#fff",
    },
    seeker: {
      borderRadius: 8,
      height: HANDLE_SIZE,
      width: HANDLE_SIZE,
      backgroundColor: "#fff",
    },
    seekerHandle: {
      position: "absolute",
      padding: 8,
    },
    timeContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    time: {
      fontWeight: "600",
      color: "#BFBEC0",
      fontSize: 12,
    },
    controlsContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 12,
    },
  });
};

export default MusicControls;
