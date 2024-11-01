import { StyleSheet, View, Text, Button } from "react-native";
import { CurrentlyPlayingTrack } from "../components/CurrentTrack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MusicTimer } from "../components/MusicTimer";

import { CircleButton } from "../components/UI/buttons";
//Login Button
export function Map({ navigation }) {
  const handlePage = () => {
    navigation.navigate(page); // Navigate to the page passed in as a prop
  };
  return (
    <View style={styles.container}>
      <CircleButton
        text="Profile"
        page="ProfileStorage"
        navigation={navigation}
      />
      <MusicTimer />
      <CurrentlyPlayingTrack />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
  },
});
