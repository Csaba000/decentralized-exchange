import { FC } from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface CustomButtonProps {
  title: string;
  textStyle?: any;
  style?: any;
  disabled?: boolean;
  onPress: () => void;
}

const CustomButton: FC<CustomButtonProps> = ({
  title,
  style,
  textStyle,
  disabled,
  onPress,
}) => {
  const styles = useStyles(disabled ?? false);
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const useStyles = (disabled: boolean) => {
  const styles = StyleSheet.create({
    button: {
      backgroundColor: disabled ? "#4d4b4b" : "#f5f5f5",
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

  return styles;
};

export default CustomButton;
