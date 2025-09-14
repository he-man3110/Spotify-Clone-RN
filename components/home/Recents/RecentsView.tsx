import { TopItem } from "@/Data/sdk/CommonTypes";
import { loadUsersTopItems } from "@/Data/state/account/AccountSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { Image } from "expo-image";
import React, { useEffect } from "react";
import { Text } from "react-native";
import Animated from "react-native-reanimated";

function RecentsView() {
  const dispatch = useAppDispatch();
  const { isAvailable } = useAppSelector((state) => state.account.topArtists);

  useEffect(() => {
    if (!isAvailable) {
      dispatch(loadUsersTopItems({ type: "artists" }));
    }
  }, []);

  return (
    <Animated.View>
      <Animated.Text>Recents</Animated.Text>
    </Animated.View>
  );
}

const RecentItem = ({ name, images }: TopItem) => {
  return (
    <Animated.View>
      <Image
        source={images.at(0)?.url}
        style={[{ width: images.at(0)?.width, height: images.at(0)?.height }]}
      />
      <Text></Text>
      <Text></Text>
    </Animated.View>
  );
};

export default RecentsView;
