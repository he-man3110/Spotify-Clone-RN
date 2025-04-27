import { Image } from "expo-image";
import React from "react";
import { StyleProp, StyleSheet, Text, ViewStyle } from "react-native";
import Animated, { AnimatedStyle } from "react-native-reanimated";
import HStack from "../base/HStack";
import PressableIcon from "../base/PressableIcon";
import MusicControls from "./MusicControls";
import MusicDetail from "./MusicDetail";

function NowPlayingView({
  playlist = "Liked Songs",
  style,
}: {
  playlist?: string;
  style?: StyleProp<AnimatedStyle<ViewStyle>>;
}) {
  return (
    <Animated.View style={[{ flex: 1 }, style]}>
      <HeaderView playlist={playlist} />
      <Animated.View
        style={{
          paddingHorizontal: 16,
          marginTop: 60,
        }}
      >
        <Image
          source={
            "https://i.scdn.co/image/ab67616d0000b2734ae1c4c5c45aabe565499163"
          }
          style={{
            alignSelf: "center",
            borderRadius: 8,
            width: "100%",
            aspectRatio: 1,
          }}
        />
      </Animated.View>
      <Animated.View style={{ height: 64 }} />
      <MusicDetail />
      <Animated.View style={{ paddingHorizontal: 16, gap: 16 }}>
        <MusicControls />
        <HStack>
          <PressableIcon
            onPress={() => {}}
            source={require("../../assets/svgs/devices.svg")}
            imageStyle={{ width: 18, height: 18 }}
          />
          <HStack style={{ gap: 28 }}>
            <PressableIcon
              onPress={() => {}}
              source={require("../../assets/svgs/share.svg")}
              imageStyle={{ width: 18, height: 18 }}
            />
            <PressableIcon
              onPress={() => {}}
              source={require("../../assets/svgs/queue.svg")}
              imageStyle={{ width: 18, height: 18 }}
            />
          </HStack>
        </HStack>
      </Animated.View>
    </Animated.View>
  );
}

const HeaderView = ({ playlist }: { playlist: string }) => {
  const styles = createHeaderViewStyles();

  return (
    <HStack style={styles.container}>
      <Image
        source={require("../../assets/svgs/chevron_down.svg")}
        style={{ width: 20, height: 20 }}
      />
      <Text style={styles.playlistLabel}>{playlist}</Text>
      <Image
        source={require("../../assets/svgs/options.svg")}
        style={{ width: 12, height: 12 }}
      />
    </HStack>
  );
};

const createHeaderViewStyles = () => {
  return StyleSheet.create({
    container: {
      paddingHorizontal: 16,
      paddingVertical: 4,
    },
    playlistLabel: {
      color: "#fff",
      fontWeight: "700",
      fontSize: 12,
    },
  });
};

export default NowPlayingView;
