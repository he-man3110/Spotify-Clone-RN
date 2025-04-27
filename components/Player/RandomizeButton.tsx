import React, { SetStateAction } from "react";
import { View } from "react-native";
import StateButton, { State } from "../button/StateButton";

function RandomizeButton() {
  const states: Array<State<number, string>> = [
    { id: 1, value: "randomize", isInitial: true },
    { id: 2, value: "randomize_active" },
  ];

  const onPress = (
    setState: React.Dispatch<SetStateAction<State<number, string>>>
  ) => {
    setState((prev) => {
      return prev !== undefined
        ? states.at(prev.id % states.length)!
        : states.at(1)!;
    });
  };

  const getImageSource = (state: State<number, string>) => {
    let source = require("../../assets/svgs/randomise_active.svg");

    return {
      source,
      style: {
        width: 22,
        height: 22,
        tintColor: state.id !== 1 ? "#1ED760" : "#fff",
      },
    };
  };

  return (
    <View>
      <StateButton
        states={states}
        onPress={onPress}
        getImageSource={getImageSource}
      />
    </View>
  );
}

export default RandomizeButton;
