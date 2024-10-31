// First landing page
import { StyleSheet, View, Text, Button } from "react-native";
import { Buttons } from "../components/buttons";

// Login with existing account
export default function Enter({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.greetingText}>Hello there!</Text>
      <Buttons text="Login" page="Login" navigation={navigation} />
      <Buttons text="Sign Up" page="SignUp" navigation={navigation} />
    </View>
  );
}

//home screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F3F5', // Set background color
    justifyContent: 'flex-start', // Align items to the top
    alignItems: 'flex-start', // Align items to the left
  },
  greetingText: {
    position: 'absolute', // Position the text absolutely
    left: 50, // x position
    top: 50, // y position
    fontSize: 20, // Adjust font size as needed
    color: '#000', // Text color (black)
  },
});