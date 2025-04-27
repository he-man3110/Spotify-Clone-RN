import { Image, ImageSource, ImageStyle } from "expo-image";
import React, { SetStateAction, useState } from "react";
import { Pressable, StyleProp, ViewStyle } from "react-native";

export type State<K, V> = {
  id: K;
  value: V;
  isInitial?: boolean;
};

function StateButton<K, V>({
  states,
  onPress,
  getImageSource,
  style,
}: {
  states: Array<State<K, V>>;
  onPress: (setState: React.Dispatch<SetStateAction<State<K, V>>>) => void;
  getImageSource: (value: State<K, V>) => {
    source: ImageSource;
    style?: StyleProp<ImageStyle>;
  };
  style?: StyleProp<ViewStyle>;
}) {
  const [state, setState] = useState<State<K, V>>(
    states.find((s) => s.isInitial) ??
      states.at(0) ??
      ({ id: 1, value: "na" } as State<K, V>)
  );

  const { source, style: imageStyle } = getImageSource(state);

  const _onPress = () => {
    onPress(setState);
  };

  return (
    <Pressable style={[style]} onPress={_onPress}>
      <Image source={source} style={[imageStyle]} />
    </Pressable>
  );
}

export default StateButton;
