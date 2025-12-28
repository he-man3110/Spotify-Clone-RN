import HStack from "@components/base/HStack";
import PressableIcon from "@components/base/PressableIcon";
import { PlayList } from "@data/sdk/types/Playlist";
import { useAppSelector } from "@hooks/useStore";
import { useThemedStyleSheet } from "@hooks/useThemedStyleSheet.hook";
import { FlashList, ListRenderItem } from "@shopify/flash-list";
import { Theme } from "@theme/Theme.interface";
import { Image } from "expo-image";
import React, { useCallback, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";

// TODO: Add List Loading Shimmer
// TODO: Add key extractor
// TODO: Make searchable.

export default function LibraryScreen() {
  const insets = useSafeAreaInsets();

  const { styles } = useThemedStyleSheet(createLibraryStyles, insets);
  const [gridMode, setGridMode] = useState(true);
  const { uri } = useAppSelector((state) => state.account.details.profileIcon);
  const { list, contentStatus } = useAppSelector(
    (state) => state.library.playlists
  );

  const onSearch = () => {};

  const renderItem: ListRenderItem<PlayList> = useCallback(
    ({ item, index }) => {
      let spacingStyle;
      switch (index % 3) {
        case 0: {
          spacingStyle = {
            paddingEnd: 10,
          };
          break;
        }
        case 1: {
          spacingStyle = {
            paddingHorizontal: 5.5,
          };
          break;
        }
        case 2: {
          spacingStyle = {
            paddingStart: 10,
          };
          break;
        }
      }

      return (
        <View
          style={[gridMode ? styles.gridItem : styles.listItem, spacingStyle]}
        >
          <Image
            source={item.images.at(0)?.url}
            style={gridMode ? styles.gridImage : styles.listImage}
          />
          <View>
            <Text style={styles.itemName} numberOfLines={1}>
              {item.name}
            </Text>
            <Text
              style={styles.caption}
              numberOfLines={1}
            >{`Playlist • ${item.owner.display_name}`}</Text>
          </View>
        </View>
      );
    },
    [styles, gridMode]
  );

  const Header = () => {
    return (
      <HStack style={{ paddingVertical: 12 }}>
        <HStack style={{ gap: 10 }}>
          <PressableIcon
            source={require("@assets/svgs/filters.svg")}
            imageStyle={{ width: 16, height: 12, tintColor: "#fff" }}
            onPress={() => {}}
          />
          <Text style={styles.listHeaderText}>Recents</Text>
        </HStack>
        <PressableIcon
          source={
            gridMode
              ? require("@assets/svgs/hamburger.svg")
              : require("@assets/svgs/grid.svg")
          }
          imageStyle={{ width: 16, height: 16, tintColor: "#fff" }}
          onPress={() => {
            setGridMode((m) => !m);
          }}
        />
      </HStack>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.safeAreaContainer} />
        <HStack style={styles.headerTitleContainer}>
          <HStack style={{ gap: 8 }}>
            <Image style={styles.profileIcon} source={uri} />
            <Text style={styles.title}>Your Library</Text>
          </HStack>
          <HStack style={{ gap: 26, paddingStart: 8 }}>
            <PressableIcon
              imageStyle={styles.pressableIcon}
              source={require("@assets/svgs/search.svg")}
              onPress={onSearch}
            />
            <PressableIcon
              imageStyle={styles.pressableIcon}
              source={require("@assets/svgs/plus.svg")}
              onPress={onSearch}
            />
          </HStack>
        </HStack>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ paddingVertical: 12 }}
          contentContainerStyle={{ paddingHorizontal: 12, gap: 8 }}
        >
          {filters.map((f, index) => {
            return (
              <Pressable key={index} style={styles.chip}>
                <Text style={styles.chipText}>{f}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
      <FlashList
        data={list}
        numColumns={gridMode ? 3 : undefined}
        ListHeaderComponent={Header}
        contentContainerStyle={{
          paddingHorizontal: 12,
          paddingBottom: 150,
        }}
        renderItem={renderItem}
      />
    </View>
  );
}

const filters = ["Playlist", "Podcasts", "Albums", "Artists", "Downloaded"];

const createLibraryStyles = (theme: Theme, insets: EdgeInsets) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    safeAreaContainer: {
      height: insets.top,
      width: "100%",
    },
    headerContainer: {
      ...theme.shadows.small,
      backgroundColor: theme.colors.background,
    },
    headerTitleContainer: {
      backgroundColor: theme.colors.background,
      paddingHorizontal: 12,
    },
    title: {
      fontSize: 22,
      fontWeight: "600",
      color: theme.colors.textPrimary,
    },
    profileIcon: {
      width: 36,
      height: 36,
      borderRadius: 18,
    },
    pressableIcon: {
      width: 28,
      height: 28,
      tintColor: theme.colors.iconPrimary,
    },
    chip: {
      ...theme.shapes.lg,
      paddingHorizontal: 16,
      padding: 6,
      backgroundColor: theme.colors.surfaceVariant,
      alignItems: "center",
      justifyContent: "center",
    },
    chipText: {
      ...theme.typography.caption.large,
      color: theme.colors.textPrimary,
    },
    listItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingVertical: 6,
    },
    gridItem: {
      gap: 8,
      paddingVertical: 8,
    },
    itemName: {
      ...theme.typography.title.small,
      color: theme.colors.textPrimary,
    },
    gridImage: {
      aspectRatio: 1,
    },
    listImage: {
      width: 60,
      aspectRatio: 1,
    },
    caption: {
      ...theme.typography.caption.medium,
      color: theme.colors.textDisabled,
    },
    listHeaderText: {
      ...theme.typography.title.medium,
      color: theme.colors.textPrimary,
    },
  });
};
