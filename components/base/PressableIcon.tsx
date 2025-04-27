import { Image, ImageSource, ImageStyle } from "expo-image";
import React from "react";
import {
  Pressable,
  PressableStateCallbackType,
  StyleProp,
  ViewStyle,
} from "react-native";

function PressableIcon({
  source,
  onPress,
  style,
  imageStyle,
}: {
  source: ImageSource;
  onPress: () => void;
  style?:
    | StyleProp<ViewStyle>
    | ((state: PressableStateCallbackType) => StyleProp<ViewStyle>);
  imageStyle?: StyleProp<ImageStyle>;
}) {
  return (
    <Pressable onPress={onPress} style={style}>
      <Image source={source} style={imageStyle} />
    </Pressable>
  );
}

export default PressableIcon;
