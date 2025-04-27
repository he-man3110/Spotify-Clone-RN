import { Image } from "expo-image";
import React from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import Animated, { AnimatedStyle } from "react-native-reanimated";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";
import PlayButton from "../Player/PlayButton";

export default function MiniPlayingBar({
  style,
}: {
  style?: StyleProp<AnimatedStyle<StyleProp<ViewStyle>>>;
}) {
  const insets = useSafeAreaInsets();
  const styles = createStyles(insets);

  return (
    <Animated.View style={[styles.container, style]}>
      <View style={styles.songDetailContainer}>
        <Image
          source={
            "https://i.scdn.co/image/ab67616d0000b2737e7f1d0bdb2bb5a2afc4fb25"
          }
          style={styles.coverImage}
        />
        <View style={styles.labelContainer}>
          <Text style={styles.songLabel}>Wake Me Up(feat.Justice)</Text>
          <Text style={styles.artists}>The Weekend,Justice</Text>
        </View>
      </View>
      <View style={styles.controlContainer}>
        <Image
          source={require("../../assets/svgs/devices.svg")}
          style={styles.controlIcon}
        />
        <PlayButton mode="small" imageStyle={styles.controlIcon} />
      </View>
    </Animated.View>
  );
}

const createStyles = (insets: EdgeInsets) => {
  return StyleSheet.create({
    container: {
      minHeight: insets.top,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderRadius: 10,
      gap: 8,
      backgroundColor: "#1D0D02",
      padding: 8,
    },
    songDetailContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    coverImage: {
      width: 40,
      height: 40,
      borderRadius: 4,
    },
    labelContainer: {
      rowGap: 2,
    },
    songLabel: {
      color: "white",
      fontWeight: "500",
      fontSize: 13,
    },
    artists: {
      color: "#C0BCB9",
      fontSize: 11,
    },
    controlContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 24,
      paddingRight: 8,
    },
    controlIcon: {
      width: 28,
      height: 20,
      resizeMode: "contain",
      tintColor: "white",
    },
  });
};
