import { HexColorValue } from "@utils/ColorUtils";
import React from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import Animated, { AnimatedStyle } from "react-native-reanimated";
import CategoryCard, { CategoryTileSize } from "../CategoryCard";

export type Category = {
  title: string;
  imageUrl: string;
  backgroundColor: HexColorValue;
};

function Categories({
  size = "small",
  data,
  style,
  itemStyle,
}: {
  size?: CategoryTileSize;
  data: Array<Category>;
  style?: AnimatedStyle<ViewStyle>;
  itemStyle?: StyleProp<ViewStyle>;
}) {
  const styles = createCategoriesStyle();

  const [c1, c2] = data;

  return (
    <Animated.View style={[styles.container, style]}>
      {c1 && (
        <CategoryCard
          size={size}
          title={c1.title}
          source={c1.imageUrl}
          style={[{ backgroundColor: c1.backgroundColor }, itemStyle]}
        />
      )}
      {c2 !== undefined ? (
        <CategoryCard
          size={size}
          title={c2.title}
          source={c2.imageUrl}
          style={[{ backgroundColor: c2.backgroundColor }, itemStyle]}
        />
      ) : (
        <Animated.View style={{ flex: 1 }} />
      )}
    </Animated.View>
  );
}

const createCategoriesStyle = () => {
  return StyleSheet.create({
    container: {
      flexDirection: "row",
      paddingHorizontal: 16,
      paddingVertical: 8,
      gap: 16,
    },
  });
};

export default Categories;
