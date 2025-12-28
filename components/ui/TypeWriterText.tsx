import { wait } from "@data/sdk/utils/GeneralUtils";
import React, { useEffect, useRef, useState } from "react";
import Animated, { LinearTransition } from "react-native-reanimated";

export type TypeWriterTextProps = {
  text: string;
  loop?: boolean;
  blinkCursor?: boolean;
};

export default function TypeWriterText({
  text: _text,
  loop = false,
  blinkCursor = true,
}: TypeWriterTextProps) {
  const [text, setText] = useState("");
  const typewriterIdx = useRef(0);
  const pauseIndexes = calculatePauseIndexes(_text);
  const controller = useRef<AbortController>(null);

  const animateText = async (signal: AbortSignal) => {
    let currIdx = 0;
    const endIdx = _text.length;

    while (currIdx < endIdx + 1 && !signal.aborted) {
      if (signal.aborted) {
        typewriterIdx.current = 0;
        return;
      }
      typewriterIdx.current = currIdx;
      setText(_text.substring(0, currIdx));
      currIdx++;
      if (pauseIndexes.includes(currIdx)) {
        await wait(120, signal);
      } else {
        await wait(50, signal);
      }

      if (currIdx === endIdx + 1 && loop && !signal.aborted) {
        currIdx = 0;
      }
    }
  };

  useEffect(() => {
    controller.current = new AbortController();
    animateText(controller.current.signal);

    return () => {
      typewriterIdx.current = 0;
      controller.current?.abort();
    };
  }, [_text, loop]);

  return (
    <Animated.View style={{ flex: 1, gap: 16 }}>
      <Animated.Text layout={LinearTransition}>
        {text}
        {typewriterIdx.current !== _text.length && (
          <Animated.Text>{"|"}</Animated.Text>
        )}
      </Animated.Text>
    </Animated.View>
  );
}

const calculatePauseIndexes = (text: string) => {
  const pauseIndexes: Array<number> = [];
  let currIdx = 0;
  text.split(" ").forEach((w) => {
    pauseIndexes.push(w.length + currIdx);
    currIdx = currIdx + w.length;
  });
  return pauseIndexes;
};
