import { ActivityIndicator, View } from "react-native";

const LoadingIndicator = () => (
  <View
    style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <ActivityIndicator size="large" />
  </View>
);

export default LoadingIndicator;