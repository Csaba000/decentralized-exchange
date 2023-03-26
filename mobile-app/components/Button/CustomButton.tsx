import { FC } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface CustomButtonProps {
  title: string;
  textStyle?: any;
  style?: any;
  onPress: () => void;
}

const CustomButton: FC<CustomButtonProps> = ({
  title,
  style,
  textStyle,
  onPress,
}) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    padding: 10,
    margin: 10,
    width: 200,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#000",
    fontSize: 20,
  },
});

export default CustomButton;
