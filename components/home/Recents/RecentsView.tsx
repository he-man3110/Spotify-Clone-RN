import { SptImage } from "@data/sdk/types/SptImage";
import { loadTopHomeItems } from "@data/state/library/LibraryActions";
import { selectUsersHomeItems } from "@data/state/library/LibrarySelectors";
import { useAppDispatch, useAppSelector } from "@hooks/useStore";
import { useThemedStyleSheet } from "@hooks/useThemedStyleSheet.hook";
import { isLoading, isNotAvailable } from "@utils/CommonUtils";
import { Image } from "expo-image";
import React, { useEffect } from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import Animated from "react-native-reanimated";
import { Theme } from "../../../theme/Theme.interface";

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
  const { styles } = useThemedStyleSheet(createRecentItemStyles);

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

const createRecentItemStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      ...theme.shapes.xs,
      backgroundColor: theme.colors.surface,
      flexDirection: "row",
      minWidth: "46%",
      overflow: "hidden",
      alignItems: "center",
      columnGap: 6,
    },
    image: {
      ...theme.shapes.xs,
      width: 60,
      height: 60,
    },
    title: {
      flex: 1,
      fontWeight: "700",
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
  });
};

export default RecentsView;
