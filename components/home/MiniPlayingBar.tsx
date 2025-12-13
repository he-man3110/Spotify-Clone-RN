import ImageBackgroundView from "@components/ImageBackgroundView";
import { selectCurrentlyPlaying } from "@data/state/player/PlayerSelectors";
import { useAppSelector } from "@hooks/useStore";
import { Image } from "expo-image";
import React from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { AnimatedStyle } from "react-native-reanimated";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";
import PlayButton from "../Player/PlayButton";

export default function MiniPlayingBar({
  style,
}: {
  style?: StyleProp<AnimatedStyle<ViewStyle>>;
}) {
  const insets = useSafeAreaInsets();
  const styles = createStyles(insets);

  const { title, author, isPlaying, image } = useAppSelector(
    selectCurrentlyPlaying
  );

  return (
    <ImageBackgroundView
      style={[styles.container, style]}
      imageUri={image?.url}
    >
      <View style={styles.songDetailContainer}>
        <Image
          source={
            image?.url ??
            "https://i.scdn.co/image/ab67616d0000b2737e7f1d0bdb2bb5a2afc4fb25"
          }
          style={styles.coverImage}
        />
        <View style={styles.labelContainer}>
          <Text style={styles.songLabel}>
            {title ?? "Wake Me Up(feat.Justice)"}
          </Text>
          <Text style={styles.artists}>{author ?? "The Weekend, Justice"}</Text>
        </View>
      </View>
      <View style={styles.controlContainer}>
        <Image
          source={require("../../assets/svgs/devices.svg")}
          style={styles.controlIcon}
        />
        <PlayButton
          isPlaying={isPlaying}
          mode="small"
          imageStyle={styles.controlIcon}
        />
      </View>
    </ImageBackgroundView>
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
      backgroundColor: "transparent",
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
