// Sign up
import { StyleSheet, View, Text, Button } from "react-native";
import { Buttons } from "../components/buttons";

export default function SignUp({ navigation }) {
  return (
    <View>
      <Buttons text="Login" page="spotifyLogin" navigation={navigation} />
    </View>
  );
}
