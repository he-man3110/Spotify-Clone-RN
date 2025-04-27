import { Image } from "expo-image";
import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import Animated from "react-native-reanimated";

function SearchBar() {
  const styles = createSearchStyles();
  return (
    <Animated.View style={styles.container}>
      <Pressable style={styles.searchContainer}>
        <Image
          source={require("../../assets/svgs/search.svg")}
          style={{ width: 24, height: 24 }}
        />
        <Text>What do you want to listen to?</Text>
      </Pressable>
    </Animated.View>
  );
}

const createSearchStyles = () => {
  return StyleSheet.create({
    container: {
      backgroundColor: "#121212",
      paddingVertical: 4,
      paddingBottom: 20,
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 14,
      marginHorizontal: 16,
      gap: 8,
      backgroundColor: "#fff",
      paddingVertical: 10,
      borderRadius: 6,
    },
    search: {
      width: 24,
      height: 24,
    },
  });
};

export default SearchBar;
