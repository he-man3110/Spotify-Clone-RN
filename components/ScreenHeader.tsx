import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";

export default function ScreenHeader() {
  const insets = useSafeAreaInsets();
  const styles = createStyles(insets);
  return (
    <View style={styles.container}>
      <ProfileChipSection />
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContentContainer}
        horizontal
      >
        <Chip title="All" isSelected />
        <Chip title="Music" />
        <Chip title="Podcasts" />
      </ScrollView>
    </View>
  );
}

const createStyles = (insets: EdgeInsets) => {
  return StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      paddingTop: insets.top + 4,
      backgroundColor: "#181818",
    },
    scrollContainer: {
      paddingVertical: 12,
      paddingStart: PROFILE_CHIP_SECTION_WIDTH + 12,
      backgroundColor: "#181818",
    },
    scrollContentContainer: {
      backgroundColor: "#181818",
      gap: 8,
    },
  });
};

const Chip = ({
  title,
  isSelected = false,
}: {
  title: string;
  isSelected?: boolean;
}) => {
  const styles = createChipStyles(isSelected);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{title}</Text>
    </View>
  );
};

const createChipStyles = (isSelected: boolean) => {
  return StyleSheet.create({
    container: {
      borderRadius: 16,
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: isSelected ? "#61CC68" : "#1F1F1F",
      overflow: "hidden",
    },
    text: {
      color: isSelected ? "black" : "white",
      fontWeight: "500",
    },
  });
};

const PROFILE_CHIP_SECTION_WIDTH = 44;
const GRADIENT_WIDTH = 16;

const ProfileChipSection = () => {
  const insets = useSafeAreaInsets();
  const styles = createProfileChipStyles(insets);

  return (
    <View style={styles.container}>
      <View style={{ paddingHorizontal: 8, backgroundColor: "#181818" }}>
        <View style={styles.profile}>
          <Text style={styles.text}>H</Text>
        </View>
      </View>
      <LinearGradient
        colors={["#181818", "transparent"]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={{
          width: GRADIENT_WIDTH,
        }}
      />
    </View>
  );
};

const createProfileChipStyles = (insets: EdgeInsets) => {
  return StyleSheet.create({
    container: {
      position: "absolute",
      left: 6,
      paddingTop: insets.top + 4,
      zIndex: 1,
      backgroundColor: "transparent",
      flexDirection: "row",
    },
    profile: {
      borderRadius: 24,
      paddingVertical: 8,
      paddingHorizontal: 11,
      backgroundColor: "#61CC68",
    },
    text: {},
  });
};
