import HStack from "@components/base/HStack";
import PressableIcon from "@components/base/PressableIcon";
import { useThemedStyleSheet } from "@hooks/useThemedStyleSheet.hook";
import { Theme } from "@theme/Theme.interface";
import { Image } from "expo-image";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";

const profileIcon =
  "https://i.scdn.co/image/ab6775700000ee8586e48ff7ac7fae9e4f7de2fc";

export default function Library() {
  const insets = useSafeAreaInsets();
  const { styles } = useThemedStyleSheet(createLibraryStyles, insets);

  const onSearch = () => {};

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.safeAreaContainer} />
        <HStack style={styles.headerTitleContainer}>
          <HStack style={{ gap: 8 }}>
            <Image style={styles.profileIcon} source={profileIcon} />
            <Text style={styles.title}>Your Library</Text>
          </HStack>
          <HStack style={{ gap: 26, paddingStart: 8 }}>
            <PressableIcon
              imageStyle={styles.pressableIcon}
              source={require("@assets/svgs/search.svg")}
              onPress={onSearch}
            />
            <PressableIcon
              imageStyle={styles.pressableIcon}
              source={require("@assets/svgs/plus.svg")}
              onPress={onSearch}
            />
          </HStack>
        </HStack>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ paddingVertical: 12 }}
          contentContainerStyle={{ paddingHorizontal: 12, gap: 8 }}
        >
          {filters.map((f, index) => {
            return (
              <Pressable key={index} style={styles.chip}>
                <Text style={styles.chipText}>{f}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}

const filters = ["Playlist", "Podcasts", "Albums", "Artists", "Downloaded"];

const createLibraryStyles = (theme: Theme, insets: EdgeInsets) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    safeAreaContainer: {
      height: insets.top,
      width: "100%",
    },
    headerContainer: {
      ...theme.shadows.small,
      backgroundColor: theme.colors.background,
    },
    headerTitleContainer: {
      backgroundColor: theme.colors.background,
      paddingHorizontal: 12,
    },
    title: {
      fontSize: 22,
      fontWeight: "600",
      color: "#fff",
    },
    profileIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
    },
    pressableIcon: {
      width: 28,
      height: 28,
      tintColor: "#ffffff",
    },
    chip: {
      ...theme.shapes.lg,
      paddingHorizontal: 16,
      padding: 6,
      backgroundColor: theme.colors.surfaceVariant,
      alignItems: "center",
      justifyContent: "center",
    },
    chipText: {
      ...theme.typography.caption.large,
      color: "#ffffff",
    },
  });
};
