import { StyleSheet, View, Text, Button } from "react-native";
import { CurrentlyPlayingTrack } from "../components/showTrack";
import AsyncStorage from "@react-native-async-storage/async-storage";
//Login Button
export function Map() {
  const handlePage = () => {
    navigation.navigate(page); // Navigate to the page passed in as a prop
  };
  return (
    <View style={styles.container}>
      <CurrentlyPlayingTrack />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
