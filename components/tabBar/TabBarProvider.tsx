import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Pressable } from "react-native";

export default function TabBarProvider({
  descriptors,
  navigation,
  state,
}: BottomTabBarProps) {
  return state.routes.map((route, index) => {
    const { options } = descriptors[route.key];

    const isFocused = state.index === index;

    const { tabBarIcon } = options;

    const onPress = () => {
      const event = navigation.emit({
        type: "tabPress",
        target: route.key,
        canPreventDefault: true,
      });

      if (!isFocused && !event.defaultPrevented) {
        navigation.navigate(route.name, route.params);
      }
    };

    const onLongPress = () => {
      navigation.emit({
        type: "tabLongPress",
        target: route.key,
      });
    };

    return (
      <Pressable
        key={route.key}
        accessibilityState={isFocused ? { selected: true } : {}}
        accessibilityLabel={options.tabBarAccessibilityLabel}
        testID={options.tabBarButtonTestID}
        onPress={onPress}
        onLongPress={onLongPress}
        style={({ pressed }) => ({
          flex: 1,
          backgroundColor: "transparent",
          transform: [{ scale: pressed ? 0.95 : 1 }],
        })}
      >
        {tabBarIcon?.({ focused: isFocused, color: "#fff", size: 24 })}
      </Pressable>
    );
  });
}
