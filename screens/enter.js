// enter.js
import { StyleSheet, View, Text, Image } from "react-native";
import { Buttons } from "../components/buttons";

// First landing page
export default function Enter({ navigation }) {
  return (
    <View style={styles.container}>
    <View style={styles.welcomeContainer}>
      {/* image should go on this line */}
      {/* <WelcomeIcon width="100%" height="100%" /> */}
      <Image
        source={require('../assets/icon.png')}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.greetingText}>Hello there!</Text>
    </View>
    <View style={styles.buttonContainer}>
        <Buttons
          text="Login"
          page="Login"
          navigation={navigation}
          buttonStyle={styles.loginButton}
          textColor="#FFFFFF"
        />
        <Buttons
          text="Sign Up"
          page="SignUp"
          navigation={navigation}
          buttonStyle={styles.signUpButton}
          textColor = "#303030"
        />
      </View>
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F3F5',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeContainer: {
    marginTop: 125,
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
  },
  greetingText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#303030',
  },
  buttonContainer: {
    marginBottom: 100,
  },
  loginButton: {
    backgroundColor: '#303030',
  },
  signUpButton: {
    backgroundColor: '#EBEFF2',
  }
});