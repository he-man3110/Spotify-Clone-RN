import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

interface LinkButtonProps {
  title: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export function LinkButton({
  title,
  onPress,
  style,
  textStyle,
}: LinkButtonProps) {
  return (
    <View style={style}>
      <Text style={[styles.buttonText, textStyle]} onPress={onPress}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});
