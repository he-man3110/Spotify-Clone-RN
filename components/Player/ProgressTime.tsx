import { formatTime } from "@utils/TimeUtils";
import { useCallback, useState } from "react";
import { StyleProp, TextStyle } from "react-native";
import Animated, {
  AnimatedStyle,
  SharedValue,
  useAnimatedReaction,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

export type ProgressTimeProps = {
  reverse?: boolean;
  width: SharedValue<number>;
  totalMs: number;
  seekerX: SharedValue<number>;
  style?: AnimatedStyle<StyleProp<TextStyle>>;
};

export default function ProgressTime({
  reverse,
  width,
  seekerX,
  totalMs,
  style,
}: ProgressTimeProps) {
  const [time, setTime] = useState("0:00");

  const updateTime = useCallback((newTime: string) => {
    setTime(newTime);
  }, []);

  useAnimatedReaction(
    () => {
      if (width.value <= 0 || totalMs <= 0) return 0;

      const pp = Math.max(0, Math.min(1, seekerX.value / width.value));
      const progressMs = Math.round(totalMs * pp);

      // Return the actual milliseconds
      return reverse ? totalMs - progressMs : progressMs;
    },
    (currentMs, previousMs) => {
      // Only update when second changes
      const currentSecond = Math.floor(currentMs / 1000);
      const previousSecond = previousMs ? Math.floor(previousMs / 1000) : -1;

      if (currentSecond !== previousSecond) {
        const fTime = formatTime(Math.max(0, currentMs));
        scheduleOnRN(updateTime, fTime);
      }
    },
    [totalMs, reverse]
  );

  return (
    <Animated.Text style={style}>{reverse ? `-${time}` : time}</Animated.Text>
  );
}
