import React, { PropsWithChildren } from "react";
import Animated, { AnimatedProps } from "react-native-reanimated";
import { ViewProps } from "react-native-svg/lib/typescript/fabric/utils";

function HStack({
  children,
  style,
  ...props
}: PropsWithChildren<AnimatedProps<ViewProps>>) {
  return (
    <Animated.View
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        },
        style,
      ]}
      {...props}
    >
      {children}
    </Animated.View>
  );
}

export default HStack;
