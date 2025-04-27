import { Image } from "expo-image";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Recents({ data }: { data: Array<RecentItem> }) {
  return (
    <View
      style={{
        flexDirection: "row",
        gap: 8,
        flexWrap: "wrap",
        justifyContent: "center",
      }}
    >
      {data.map((d, index) => (
        <RecentBlock key={index} {...d} />
      ))}
    </View>
  );
}

export type RecentItem = {
  title: string;
  imageUrl: string;
};

function RecentBlock({ title, imageUrl }: RecentItem) {
  const styles = createStyles();

  return (
    <View style={styles.container}>
      <Image source={imageUrl} style={styles.image} />
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const createStyles = () => {
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
