import { Image } from "expo-image";
import React, { useCallback, useState } from "react";
import { Pressable } from "react-native";

function AddToFavorites() {
  const [isAdded, setIsAdded] = useState(false);

  const onAddToFavorites = useCallback(() => {
    setIsAdded((v) => !v);
  }, []);

  return (
    <Pressable onPress={onAddToFavorites}>
      <Image
        source={
          isAdded
            ? require("../../assets/svgs/check.svg")
            : require("../../assets/svgs/add.svg")
        }
        style={{ width: 30, height: 30 }}
      />
    </Pressable>
  );
}

export default AddToFavorites;
