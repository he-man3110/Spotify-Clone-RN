import { useThemedStyleSheet } from "@hooks/useThemedStyleSheet.hook";
import { Image, ImageSource } from "expo-image";
import { StyleSheet, Text, View } from "react-native";
import { Theme } from "../../theme/Theme.interface";

export type TabBarItemProp = {
  isFocused: boolean;
  label: string;
  source: ImageSource;
};

function TabBarItem({ isFocused, source, label }: TabBarItemProp) {
  const { styles } = useThemedStyleSheet(createTabBarStyles, isFocused);

  return (
    <View style={styles.iconContainer}>
      <Image source={source} style={styles.icon} />
      <Text style={styles.labelStyle}>{label}</Text>
    </View>
  );
}

const createTabBarStyles = (theme: Theme, isActive: boolean) => {
  return StyleSheet.create({
    iconContainer: {
      gap: 4,
      backgroundColor: "transparent",
      alignItems: "center",
    },
    icon: {
      width: 24,
      height: 24,
      tintColor: isActive
        ? theme.colors.textPrimary
        : theme.colors.textDisabled,
    },
    labelStyle: {
      color: isActive ? theme.colors.textPrimary : theme.colors.textDisabled,
      fontSize: 12,
    },
  });
};

export default TabBarItem;
