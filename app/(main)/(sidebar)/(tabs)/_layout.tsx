import BottomTabBar from "@components/tabBar/BottomTabBar";
import TabBarItem from "@components/tabBar/TabBarItem";
import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import { StyleSheet } from "react-native";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      tabBar={(props) => {
        return <BottomTabBar {...props} />;
      }}
      initialRouteName="home"
      screenOptions={{
        headerShown: false,
        tabBarActiveBackgroundColor: "red",
        tabBarStyle: { position: "absolute" },
        tabBarBackground: () => {
          return (
            <BlurView
              tint="dark"
              intensity={100}
              style={StyleSheet.absoluteFill}
            />
          );
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => (
            <TabBarItem
              label="Home"
              source={
                focused
                  ? require("@assets/svgs/home_filled.svg")
                  : require("@assets/svgs/home.svg")
              }
              isFocused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          headerShown: true,
          headerTransparent: false,
          header: ({ layout, options }) => {
            return (
              <Animated.View
                style={{ paddingTop: insets.top, backgroundColor: "#121212" }}
              />
            );
          },
          tabBarIcon: ({ focused }) => (
            <TabBarItem
              label="Search"
              source={
                focused
                  ? require("@assets/svgs/search_filled.svg")
                  : require("@assets/svgs/search.svg")
              }
              isFocused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: "Library",
          tabBarIcon: ({ focused }) => (
            <TabBarItem
              label="Your Library"
              source={
                focused
                  ? require("@assets/svgs/library_filled.svg")
                  : require("@assets/svgs/library.svg")
              }
              isFocused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}
