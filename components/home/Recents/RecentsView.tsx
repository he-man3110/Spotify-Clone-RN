import { SptImage } from "@data/sdk/types/SptImage";
import { loadTopHomeItems } from "@data/state/library/LibraryActions";
import { selectUsersHomeItems } from "@data/state/library/LibrarySelectors";
import { useAppDispatch, useAppSelector } from "@hooks/useStore";
import { isLoading, isNotAvailable } from "@utils/CommonUtils";
import { Image } from "expo-image";
import React, { useEffect } from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import Animated from "react-native-reanimated";

export type RecentsViewProps = {
  style?: StyleProp<ViewStyle>;
};

function RecentsView({ style }: RecentsViewProps) {
  const styles = createRecentsViewStyles();
  const dispatch = useAppDispatch();
  const { contentStatus, list } = useAppSelector(selectUsersHomeItems);

  useEffect(() => {
    if (isNotAvailable(contentStatus) && !isLoading(contentStatus)) {
      dispatch(loadTopHomeItems());
    }
  }, []);

  return (
    <Animated.View style={[style]}>
      <View style={styles.container}>
        {list.slice(0, 6).map((d, index) => (
          <RecentItem key={index} {...d} />
        ))}
      </View>
    </Animated.View>
  );
}

const createRecentsViewStyles = () => {
  return StyleSheet.create({
    container: {
      flexDirection: "row",
      gap: 8,
      flexWrap: "wrap",
      justifyContent: "center",
    },
  });
};

const RecentItem = ({ title, image }: { title: string; image: SptImage }) => {
  const styles = createRecentItemStyles();

  return (
    <Animated.View style={styles.container}>
      <Image
        source={image.url}
        style={[{ width: image.width, height: image.height }, styles.image]}
      />
      <Text style={styles.title}>{title}</Text>
    </Animated.View>
  );
};

const createRecentItemStyles = () => {
  return StyleSheet.create({
    container: {
      flexDirection: "row",
      borderRadius: 4,
      backgroundColor: "#343333",
      minWidth: "46%",
      overflow: "hidden",
      alignItems: "center",
      columnGap: 6,
    },
    image: {
      width: 60,
      height: 60,
      borderRadius: 4,
    },
    title: {
      flex: 1,
      fontWeight: "700",
      fontSize: 12,
      color: "#FCFCFC",
    },
  });
};

export default RecentsView;
