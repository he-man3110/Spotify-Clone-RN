import { SpotifyID } from "@data/sdk/types/common";
import { ColorValue, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";
import AutoScrollingText from "../AutoScrollingText";
import HStack from "../base/HStack";
import AddToFavorites from "./AddToFavorites";

export type SongId = string;

const MusicDetail = ({
  trackId,
  fadeColor,
  song = "This is a very long ass text Arabella",
  artist = "Arctic Monkeys",
}: {
  trackId?: SpotifyID;
  song?: string;
  artist?: string;
  fadeColor: ColorValue;
}) => {
  const styles = createMusicDetailStyles();

  return (
    <HStack style={{ paddingEnd: 16, gap: 16 }}>
      <Animated.View style={styles.detailContainer}>
        <AutoScrollingText style={styles.songLabel} fadeColor={fadeColor}>
          {song}
        </AutoScrollingText>
        <AutoScrollingText style={styles.artistLabel} fadeColor={fadeColor}>
          {artist}
        </AutoScrollingText>
      </Animated.View>
      <AddToFavorites />
    </HStack>
  );
};

const createMusicDetailStyles = () => {
  return StyleSheet.create({
    detailContainer: {
      flex: 1,
      gap: 8,
    },
    scrollView: {},
    songLabel: {
      color: "#fff",
      fontSize: 24,
      fontWeight: "700",
    },
    artistLabel: {
      color: "#b3b3b3",
      fontSize: 14,
    },
  });
};

export default MusicDetail;
