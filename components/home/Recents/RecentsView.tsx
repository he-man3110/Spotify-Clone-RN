import { TopItem } from "@/Data/sdk/types/TopItemResponse";
import { loadUsersTopItems } from "@/Data/state/account/AccountSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { Image } from "expo-image";
import React, { useEffect } from "react";
import { FlatList, Text, View } from "react-native";
import Animated from "react-native-reanimated";

function RecentsView() {
  const dispatch = useAppDispatch();
  const { isAvailable, list } = useAppSelector((state) => state.account.topArtists);

  useEffect(() => {
    if (!isAvailable) {
      dispatch(loadUsersTopItems({ type: "artists" }));
    }
  }, []);

  const renderItem = ({ item }: { item: TopItem }) => <RecentItem {...item} />;

  return (
    <Animated.View style={{ borderWidth: 1, borderColor: 'purple'}}>
      <Animated.Text>Your top tracks</Animated.Text>
      <View style={{ height: 200 }}>
      <FlatList data={list} horizontal renderItem={renderItem} />
      </View>
    </Animated.View>
  );
}

const RecentItem = ({ name, images }: TopItem) => {
  return (
    <Animated.View style={{ borderWidth: 1, borderColor: 'lime' }}>
      <Image
        source={images.at(0)?.url}
        style={[{ width: images.at(0)?.width, height: images.at(0)?.height }]}
      />
      <Text>{name}</Text>
    </Animated.View>
  );
};

export default RecentsView;
