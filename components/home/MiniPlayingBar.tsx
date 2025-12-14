import AutoScrollingText from "@components/AutoScrollingText";
import AlbumArtView from "@components/Player/AlbumArtView";
import { selectCurrentlyPlaying } from "@data/state/player/PlayerSelectors";
import useAlbumAestheticColors from "@hooks/useAlbumAestheticColors.hook";
import { useAppSelector } from "@hooks/useStore";
import { Image } from "expo-image";
import React from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import Animated, { AnimatedStyle } from "react-native-reanimated";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";
import PlayButton from "../Player/PlayButton";

export default function MiniPlayingBar({
  style,
}: {
  style?: StyleProp<AnimatedStyle<ViewStyle>>;
}) {
  const insets = useSafeAreaInsets();
  const styles = createStyles(insets);

  const { trackId, title, author, isPlaying, image } = useAppSelector(
    selectCurrentlyPlaying
  );
  const { backgroundStyle, background } = useAlbumAestheticColors({ trackId });

  return (
    <Animated.View style={[styles.container, backgroundStyle, style]}>
      <View style={styles.songDetailContainer}>
        <AlbumArtView imageUrl={image?.url} style={styles.coverImage} />
        <View style={styles.labelContainer}>
          <AutoScrollingText
            fadeColor={background.toString()}
            fadeAreaWidth={0}
            style={styles.songLabel}
          >
            {title ?? "Wake Me Up(feat.Justice)"}
          </AutoScrollingText>
          <AutoScrollingText
            fadeAreaWidth={0}
            fadeColor={background.toString()}
            style={styles.artists}
          >
            {author ?? "The Weekend, Justice"}
          </AutoScrollingText>
        </View>
      </View>
      <View style={styles.controlContainer}>
        <Pressable style={{ paddingHorizontal: 4, padding: 8 }}>
          <Image
            source={require("@assets/svgs/devices.svg")}
            style={styles.controlIcon}
          />
        </Pressable>
        <PlayButton
          isPlaying={isPlaying}
          mode="small"
          style={{
            padding: 8,
            paddingHorizontal: 4,
          }}
          imageStyle={styles.controlIcon}
        />
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
      backgroundColor: "transparent",
      borderRadius: 10,
      gap: 8,
      padding: 8,
    },
    songDetailContainer: {
      flex: 1,
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
      flex: 1,
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
      gap: 8,
    },
    controlIcon: {
      width: 28,
      height: 22,
      resizeMode: "contain",
      tintColor: "white",
    },
  });
};
