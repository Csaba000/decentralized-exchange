import { FC } from "react";
import { ActivityIndicator, View } from "react-native";

interface LoadingIndicatorProps {
  size?: "small" | "large" | number;
  color?: string;
}

const LoadingIndicator: FC<LoadingIndicatorProps> = ({ size, color }) => (
  <View
    style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <ActivityIndicator testID="loading-indicator" size={size} color={color} />
  </View>
);

export default LoadingIndicator;
