import { Image, ImageStyle } from "expo-image";
import React, { useState } from "react";
import { Pressable, StyleProp, ViewStyle } from "react-native";

export type PlayButtonSize = "small" | "large";

function PlayButton({
  mode,
  style,
  imageStyle,
}: {
  mode: PlayButtonSize;
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
}) {
  const [isPlaying, setIsPlaying] = useState(false);

  const onPress = () => {
    setIsPlaying((v) => !v);
  };

  return (
    <Pressable onPress={onPress} style={[style]}>
      <Image
        source={getImageSource(mode, isPlaying)}
        style={[{ width: 64, height: 64 }, imageStyle]}
      />
    </Pressable>
  );
}

const getImageSource = (mode: PlayButtonSize, isPlaying: boolean) => {
  switch (mode) {
    case "small":
      return isPlaying
        ? require("../../assets/svgs/pause_spotify.svg")
        : require("../../assets/svgs/play_spotify.svg");
    case "large":
      return isPlaying
        ? require("../../assets/svgs/pause_in_circle.svg")
        : require("../../assets/svgs/play_in_circle.svg");
  }
};

export default PlayButton;
