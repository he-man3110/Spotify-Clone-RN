import { useVideoPlayer, VideoView } from "expo-video";
import React from "react";
import { StyleSheet } from "react-native";
import Animated from "react-native-reanimated";

function DiscoverList() {
  const styles = createDiscoverStyles();

  const player = useVideoPlayer(
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    (player) => {
      player.loop = true;
      player.play();
    }
  );

  return (
    <Animated.View style={styles.container}>
      <VideoView player={player} contentFit="cover" style={styles.video} />
      <VideoView player={player} contentFit="cover" style={styles.video} />
      <VideoView player={player} contentFit="cover" style={styles.video} />
    </Animated.View>
  );
}

const createDiscoverStyles = () => {
  return StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      width: "100%",
      height: 220,
      paddingHorizontal: 16,
      gap: 16,
    },
    scroll: {},
    video: {
      flex: 1,
      borderRadius: 16,
      height: 200,
    },
  });
};

export default DiscoverList;
