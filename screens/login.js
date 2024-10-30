import { StyleSheet, View, Text, Button } from "react-native";
import { Buttons } from "../components/buttons";

// Login with existing account
export default function Login({ navigation }) {
  return (
    <View>
      <Buttons text="Login" page="SpotifyLogin" navigation={navigation} />
    </View>
  );
}
