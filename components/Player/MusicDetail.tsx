import { StyleSheet } from "react-native";
import Animated from "react-native-reanimated";
import AutoScrollingText from "../AutoScrollingText";
import HStack from "../base/HStack";
import AddToFavorites from "./AddToFavorites";

export type SongId = string;

const MusicDetail = ({
  songId,
  song = "This is a very long ass text Arabella",
  artist = "Arctic Monkeys",
}: {
  songId?: SongId;
  song?: string;
  artist?: string;
}) => {
  const styles = createMusicDetailStyles();

  return (
    <HStack style={{ paddingEnd: 16, gap: 16 }}>
      <Animated.View style={styles.detailContainer}>
        <AutoScrollingText style={styles.songLabel} color="#121212">
          {song}
        </AutoScrollingText>
        <AutoScrollingText style={styles.artistLabel} color="#121212">
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
