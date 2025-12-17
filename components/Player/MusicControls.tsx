import { timeInSec } from "@data/sdk/utils/GeneralUtils";
import { setSeekerPosition } from "@data/state/player/PlayerActions";
import { selectCurrentTrackProgress } from "@data/state/player/PlayerSelectors";
import { AppDispatch } from "@data/state/store";
import { useAppDispatch, useAppSelector } from "@hooks/useStore";
import Log from "@utils/log/Log";
import debounce from "lodash/debounce";
import React, { useEffect, useRef } from "react";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  cancelAnimation,
  clamp,
  Easing,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import PressableIcon from "../base/PressableIcon";
import PlayButton from "./PlayButton";
import ProgressTime from "./ProgressTime";
import RandomizeButton from "./RandomizeButton";
import RepeatButton from "./RepeatButton";

const HANDLE_SIZE = 12;
const SEEKER_PADDING = 8;

export type MusicControlsProps = {
  isPlaying: boolean;
  currentMs?: number;
  totalMs?: number;
};

function MusicControls({ isPlaying }: MusicControlsProps) {
  const styles = createMusicControlStyles();

  const seekerX = useSharedValue(-SEEKER_PADDING);
  const sX = useRef(0);
  const prvX = useSharedValue(0);
  const seekerScale = useSharedValue(1);
  const width = useSharedValue<number>(0);

  const dispatch = useAppDispatch();
  const { currentMs, totalMs } = useAppSelector(selectCurrentTrackProgress);

  const panGesture = Gesture.Pan()
    .minDistance(1)
    .onTouchesDown(() => {
      seekerScale.value = 1.2;
      cancelAnimation(seekerX);
    })
    .onUpdate((e) => {
      const posX = prvX.value + e.translationX;
      const value = clamp(posX, -SEEKER_PADDING, width.value - SEEKER_PADDING);
      sX.current = value;
      seekerX.value = value;
    })
    .onEnd((e) => {
      prvX.value = seekerX.value;
    })
    .onTouchesUp((e) => {
      seekerScale.value = 1;

      if (width.value > 0) {
        scheduleOnRN(
          debouncedUpdateProgress,
          width.value,
          sX.current,
          totalMs,
          dispatch
        );
      }
    });

  const startAutoSeek = (currentMs: number) => {
    const pp = currentMs / totalMs;
    const currX = width.value * pp - SEEKER_PADDING;

    seekerX.value = currX;
    prvX.value = currX;
    const endX = width.value - SEEKER_PADDING;
    const duration = totalMs - currentMs;

    seekerX.value = withTiming(endX, {
      duration: duration,
      easing: Easing.linear,
    });
    prvX.value = withTiming(endX, {
      duration: duration,
      easing: Easing.linear,
    });
  };

  useEffect(() => {
    cancelAnimation(seekerX);
    cancelAnimation(prvX);

    Log.d(
      "[MC]",
      `Current Time: ${timeInSec(currentMs)} total: ${timeInSec(totalMs)}`
    );
    if (isPlaying) {
      startAutoSeek(currentMs);
    }
  }, [currentMs, totalMs, isPlaying]);

  const progressBarWidth = useDerivedValue(() => {
    return seekerX.value + SEEKER_PADDING + HANDLE_SIZE / 2;
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
    let w = e.nativeEvent.layout.width;
    if (w > 0 && w > HANDLE_SIZE) {
      w = w - HANDLE_SIZE;
    }
    width.value = w;
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
        <ProgressTime
          style={styles.time}
          width={width}
          seekerX={seekerX}
          totalMs={totalMs}
        />
        <ProgressTime
          reverse
          style={styles.time}
          width={width}
          seekerX={seekerX}
          totalMs={totalMs}
        />
      </View>
      <View style={styles.controlsContainer}>
        <RandomizeButton />
        <PressableIcon
          source={require("@assets/svgs/previous.svg")}
          imageStyle={{ width: 22, height: 22, tintColor: "#fff" }}
          onPress={onPrevious}
        />
        <PlayButton isPlaying={isPlaying} mode="large" />
        <PressableIcon
          source={require("@assets/svgs/next.svg")}
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
      padding: SEEKER_PADDING,
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

const updateProgress = (
  width: number,
  currentX: number,
  totalDurationInMs: number,
  dispatch: AppDispatch
) => {
  if (width > 0) {
    // Update the seeker position
    Log.d(
      "[MC]",
      `currentX: ${currentX} width: ${width} totalDurationInMs: ${timeInSec(totalDurationInMs)}`
    );
    const pp = currentX / width;
    const newCms = Math.round(totalDurationInMs * pp);

    // dispatch.
    Log.d("[MC]", `Updating Progress to ${timeInSec(newCms)}`);
    dispatch(setSeekerPosition(newCms));
  }
};

const debouncedUpdateProgress = debounce(updateProgress, 100);

export default MusicControls;
