import { Image } from "expo-image";
import React from "react";
import { StyleSheet, Text, ViewStyle } from "react-native";
import { AnimatedStyle } from "react-native-reanimated";
import HStack from "../base/HStack";

const profileIcon =
  "https://i.scdn.co/image/ab6775700000ee8586e48ff7ac7fae9e4f7de2fc";

const SearchHeader = ({ style }: { style?: AnimatedStyle<ViewStyle> }) => {
  const styles = createHeaderStyles();

  return (
    <HStack style={[styles.container, style]}>
      <Image
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
        }}
        source={profileIcon}
      />
      <HStack style={{ flex: 1 }}>
        <Text style={styles.title}>Search</Text>
        <Image
          source={require("../../assets/svgs/camera.svg")}
          style={{ width: 26, height: 36 }}
        />
      </HStack>
    </HStack>
  );
};

const createHeaderStyles = () => {
  return StyleSheet.create({
    container: {
      gap: 8,
      paddingHorizontal: 16,
      paddingVertical: 4,
      paddingBottom: 12,
      alignItems: "center",
      flexDirection: "row",
    },
    subContainer: {
      flexDirection: "row",
    },
    title: {
      fontSize: 22,
      fontWeight: "600",
      color: "#fff",
    },
  });
};

export default SearchHeader;
