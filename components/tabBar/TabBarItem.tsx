import { Image, ImageSource } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

export type TabBarItemProp = {
  isFocused: boolean;
  label: string;
  source: ImageSource;
};

function TabBarItem({ isFocused, source, label }: TabBarItemProp) {
  const styles = createTabBarStyles(isFocused);

  return (
    <View style={styles.iconContainer}>
      <Image source={source} style={styles.icon} />
      <Text style={styles.labelStyle}>{label}</Text>
    </View>
  );
}

const createTabBarStyles = (isActive: boolean) => {
  return StyleSheet.create({
    iconContainer: {
      gap: 4,
      backgroundColor: "transparent",
      alignItems: "center",
    },
    icon: {
      width: 24,
      height: 24,
      tintColor: isActive ? "#fff" : "#b3b3b3",
    },
    labelStyle: {
      color: isActive ? "#fff" : "#b3b3b3",
      fontSize: 12,
    },
  });
};

export default TabBarItem;
