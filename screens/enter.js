// First landing page
import { StyleSheet, View, Text, Button, Image } from "react-native";
import { NavigationButton } from "../components/buttons";
import { Container } from "../components/Container";

// Login with existing account
export default function Enter({ navigation }) {
  return (
    <Container>
      <View style={styles.welcomeContainer}>
        {/* image should go on this line */}
        {/* <WelcomeIcon width="100%" height="100%" /> */}
        <Image
          source={require("../assets/welcomeIcon1.png")}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.greetingText}>Hello there!</Text>
      </View>

      <View style={styles.buttonContainer}>
        <NavigationButton
          text="Login"
          page="Login"
          navigation={navigation}
          buttonStyle={styles.loginButton}
          textColor="#FFFFFF"
        />
        <NavigationButton
          text="Sign Up"
          page="SignUp"
          navigation={navigation}
          buttonStyle={styles.signUpButton}
          textColor="#303030"
        />
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  welcomeContainer: {
    alignItems: "center",
  },
  image: {
    width: 180,
    height: 180,
  },
  greetingText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#303030",
    marginTop: 10,
  },
  loginButton: {
    backgroundColor: "#303030",
  },
  signUpButton: {
    backgroundColor: "#EBEFF2",
  },
});
