import React, { SetStateAction } from "react";
import { View } from "react-native";
import StateButton, { State } from "../button/StateButton";

function RepeatButton() {
  const states: Array<State<number, string>> = [
    { id: 1, value: "repeat", isInitial: true },
    { id: 2, value: "repeat" },
    { id: 3, value: "repeat_once" },
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
    let source;
    if (state.id === 2) {
      source = require("../../assets/svgs/repeat_once.svg");
    } else {
      source = require("../../assets/svgs/repeat.svg");
    }

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

export default RepeatButton;
