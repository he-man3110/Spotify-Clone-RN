import { Image } from "expo-image";
import React from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from "react-native";
import Animated from "react-native-reanimated";

export type CategoryTileSize = "small" | "medium";

function CategoryCard({
  size,
  title,
  source,
  onPress,
  style,
}: {
  size: CategoryTileSize;
  title: string;
  source: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  const styles = createCategoryStyles(size);

  return (
    <Pressable style={[styles.container, style]} onPress={onPress}>
      <Text style={styles.title}>{title}</Text>
      <Animated.View style={styles.imageContainer}>
        <Image source={source} style={styles.imageStyle} />
      </Animated.View>
    </Pressable>
  );
}

const createCategoryStyles = (size: CategoryTileSize) => {
  return StyleSheet.create({
    container: {
      width: "47.8%",
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      borderRadius: 4,
      paddingStart: 12,
      paddingTop: 8,
      height: size === "small" ? 60 : 100,
      overflow: "hidden",
    },
    title: {
      fontWeight: "700",
      color: "#fff",
      fontSize: 12,
    },
    imageContainer: {
      shadowOpacity: 0.3,
      shadowRadius: 16,
      shadowColor: "#000",
      shadowOffset: { height: -1, width: -1 },
      transform: [
        { translateY: size === "small" ? 8 : 20 },
        { translateX: size === "small" ? 4 : 16 },
        { rotateZ: size === "small" ? "25deg" : "30deg" },
      ],
    },
    imageStyle: {
      width: size === "small" ? 60 : 72,
      height: size === "small" ? 60 : 72,
      borderRadius: 4,
    },
  });
};

export default CategoryCard;
