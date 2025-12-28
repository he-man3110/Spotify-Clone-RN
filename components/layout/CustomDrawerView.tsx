import { useThemedStyleSheet } from "@hooks/useThemedStyleSheet.hook";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";
import { Theme } from "../../theme/Theme.interface";
import { LinkButton } from "../button/LinkButton";

export function CustomDrawerContent() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const styles = createStyles(insets);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View>
          <Text style={styles.headerText} testID="drawer-header">
            H Ξ M Λ N ⚡️
          </Text>
          <LinkButton
            title="View profile"
            onPress={() => {
              console.log("View Profile pressed.");
            }}
          />
        </View>
      </View>

      <View style={styles.drawerItems}>
        <DrawerItem label="Add account" onPress={() => {}} />
        <DrawerItem label="What's new" onPress={() => {}} />
        <DrawerItem label="Your sound capsule" onPress={() => {}} />
        <DrawerItem label="Recents" onPress={() => {}} />
        <DrawerItem label="Your updates" onPress={() => {}} />
        <DrawerItem label="Settings and privacy" onPress={() => {}} />
      </View>
    </View>
  );
}

const createStyles = (insets: EdgeInsets) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: insets.top,
      backgroundColor: "#1F1F1F",
      paddingHorizontal: 8,
    },
    headerContainer: {
      padding: 16,
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: "#333",
    },
    headerText: {
      color: "white",
      fontSize: 18,
      fontWeight: "bold",
    },
    drawerItems: {
      flex: 1,
      gap: 8,
      paddingVertical: 8,
    },
    drawerItem: {
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    itemText: {
      color: "white",
      fontSize: 16,
    },
  });
};

const DrawerItem = ({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) => {
  const { styles } = useThemedStyleSheet(createDrawerItemStyles);

  return (
    <Pressable style={styles.container} onPress={onPress}>
      <Text style={styles.itemText}>{label}</Text>
    </Pressable>
  );
};

const createDrawerItemStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 6,
    },
    itemText: {
      ...theme.typography.title.large,
      color: "white",
    },
  });
};
