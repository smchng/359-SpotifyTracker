// First landing page
import { StyleSheet, View, Text, Button } from "react-native";
import { Buttons } from "../components/UI/buttons";

// Login with existing account
export default function Enter({ navigation }) {
  return (
    <View>
      <Buttons text="Login" page="Login" navigation={navigation} />
      <Buttons text="Sign Up" page="SignUp" navigation={navigation} />
    </View>
  );
}
