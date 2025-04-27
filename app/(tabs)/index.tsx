import Recents, { RecentItem } from "@/components/home/Recents";
import ScreenHeader from "@/components/ScreenHeader";
import React from "react";
import { ScrollView, View } from "react-native";

export default function Home() {
  return (
    <View style={{ flex: 1 }}>
      <ScreenHeader />
      <ScrollView
        style={{ paddingTop: 12, backgroundColor: "#181818" }}
        contentContainerStyle={{ gap: 12 }}
      >
        <Recents data={recentItems} />
      </ScrollView>
    </View>
  );
}

export const recentItems: RecentItem[] = [
  {
    title: "Chill Vibes",
    imageUrl:
      "https://i.scdn.co/image/ab67616d0000b273ed79f4b46d206bd1f3e2bcaf",
  },
  {
    title: "Top Hits 2024",
    imageUrl:
      "https://i.scdn.co/image/ab67616d0000b27371d62ea7ea8a5be92d3c1f62",
  },
  {
    title: "Workout Pump",
    imageUrl:
      "https://mosaic.scdn.co/640/ab67616d00001e020d66934f5370419636c78f18ab67616d00001e026d97b3dc154dfdbe2321fb5cab67616d00001e0274a555ea03b0844b1e1d4513ab67616d00001e02a456a3bad97e054401f85a74",
  },
  {
    title: "Lo-Fi Beats",
    imageUrl:
      "https://i.scdn.co/image/ab6761610000e5ebeaa4f0b2787ecc97a87d5457",
  },
  {
    title: "Indie Essentials",
    imageUrl:
      "https://i.scdn.co/image/ab67616d0000b2732a038d3bf875d23e4aeaa84e",
  },
  {
    title: "Liked Songs",
    imageUrl: "https://misc.scdn.co/liked-songs/liked-songs-640.jpg",
  },
];
