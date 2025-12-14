import { Image, ImageStyle } from "expo-image";
import { StyleProp, StyleSheet, View } from "react-native";

export type AlbumArtViewProps = {
  imageUrl?: string;
  style?: StyleProp<ImageStyle>;
};

export default function AlbumArtView({ imageUrl, style }: AlbumArtViewProps) {
  const styles = createAlbumArtViewStyles();

  return imageUrl ? (
    <Image source={imageUrl} style={[style]} />
  ) : (
    <View style={[styles.container, style]}>
      <Image
        source={require("@assets/svgs/cd.svg")}
        style={{ width: 19, height: 18, tintColor: "#AFAFAF" }}
      />
    </View>
  );
}

const createAlbumArtViewStyles = () => {
  return StyleSheet.create({
    container: {
      backgroundColor: "#313131",
      alignItems: "center",
      justifyContent: "center",
    },
  });
};
