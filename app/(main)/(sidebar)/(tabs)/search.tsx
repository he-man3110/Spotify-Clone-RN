import Categories, { Category } from "@/components/Search/Categories";
import DiscoverList from "@/components/Search/DiscoverList";
import SearchBar from "@/components/Search/SearchBar";
import SearchHeader from "@/components/Search/SearchHeader";
import allCategories from "@/Data/Browse/BrowseCategories.json";
import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";
import React, { useCallback, useMemo } from "react";
import { StyleSheet, Text } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";

const categories: Array<Category> = [
  {
    title: "Music",
    imageUrl:
      "https://i.scdn.co/image/ab67fb8200005caf474a477debc822a3a45c5acb",
    backgroundColor: "#DC148C",
  },
  {
    title: "Podcasts",
    imageUrl:
      "https://i.scdn.co/image/ab6765630000ba8a81f07e1ead0317ee3c285bfa",
    backgroundColor: "#296251",
  },
  {
    title: "Live Events",
    imageUrl:
      "https://concerts.spotifycdn.com/images/live-events_category-image.jpg",
    backgroundColor: "#8400E7",
  },
  {
    title: "Home of I-Pop",
    imageUrl:
      "https://i.scdn.co/image/ab67fb8200005caf474a477debc822a3a45c5acb",
    backgroundColor: "#223161",
  },
];

export type ConformsTo<T> = T & {
  [key: string]: unknown;
};

type SearchPageListItem = ConformsTo<{
  type: string;
  label?: string;
  data?: Array<unknown>;
}>;

export default function Search() {
  const insets = useSafeAreaInsets();
  const COLLAPSIBLE_HEADER_HEIGHT = 56;
  const styles = createSearchStyles(insets, COLLAPSIBLE_HEADER_HEIGHT + 56);

  const scrollY = useSharedValue(0);
  const searchHeader = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [0, COLLAPSIBLE_HEADER_HEIGHT],
            [0, -COLLAPSIBLE_HEADER_HEIGHT, 0],
            "clamp"
          ),
        },
      ],
    };
  });

  const data = useMemo(() => {
    const list: Array<SearchPageListItem> = [
      { type: "title", label: "Start browsing" },
    ];

    categories.forEach((category: Category, index: number) => {
      let data: Array<Category> = [];

      // Skips second item.
      if ((index + 1) % 2 === 0) {
        return;
      }

      data.push(category);
      // Second item Exists
      if (index + 1 <= categories.length) {
        data.push(categories.at(index + 1)!);
      }

      list.push({ type: "category", data });
    });

    list.push({ type: "title", label: "Discover something new" });
    list.push({ type: "discoverList" });

    list.push({ type: "title", label: "Browse All" });

    const browseAllCategories = allCategories as Array<Category>;

    browseAllCategories.forEach((category: Category, index: number) => {
      let data: Array<Category> = [];

      // Skips second item.
      if ((index + 1) % 2 === 0) {
        return;
      }

      data.push(category);
      // Second item Exists
      if (index + 1 <= browseAllCategories.length) {
        data.push(browseAllCategories.at(index + 1)!);
      }

      list.push({ type: "browseAllCategory", data });
    });

    return list;
  }, []);

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<SearchPageListItem>) => {
      if (item.type === "title") {
        return <Text style={styles.title}>{item.label ?? ""}</Text>;
      } else if (item.type === "header") {
        return <SearchHeader />;
      } else if (item.type === "search") {
        return <SearchBar />;
      } else if (item.type === "discoverList") {
        return <DiscoverList />;
      } else if (
        item.type === "category" ||
        item.type === "browseAllCategory"
      ) {
        return (
          <Categories
            data={(item.data ?? []) as Array<Category>}
            size={item.type === "category" ? "small" : "medium"}
          />
        );
      } else {
        return <></>;
      }
    },
    []
  );

  return (
    <Animated.View style={styles.container}>
      <Animated.View style={[styles.headerContainer, searchHeader]}>
        <SearchHeader />
        <SearchBar />
      </Animated.View>
      <Animated.View style={[styles.listContainer]}>
        <FlashList
          data={data}
          onScroll={(e) => {
            const { y } = e.nativeEvent.contentOffset;
            scrollY.value = y;
          }}
          contentContainerStyle={styles.listContent}
          // estimatedItemSize={80}
          showsVerticalScrollIndicator={true}
          renderItem={renderItem}
        />
      </Animated.View>
    </Animated.View>
  );
}

const createSearchStyles = (insets: EdgeInsets, headerHeight: number) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#121212",
    },
    headerContainer: {
      width: "100%",
      position: "absolute",
      top: 0,
      zIndex: 1,
      backgroundColor: "#121212",
    },
    listContainer: {
      flex: 1,
    },
    listContent: {
      paddingTop: headerHeight,
      paddingBottom: 140,
    },
    title: {
      fontWeight: "700",
      color: "#fff",
      fontSize: 14,
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
  });
};
