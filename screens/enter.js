// First landing page
import { StyleSheet, View, Text, Button, Image } from "react-native";
import { NavigationButton } from "../components/UI/buttons";
import { Container } from "../components/Container";
import WelcomeIcon from "../assets/WelcomeIcon.svg";

// Login with existing account
export default function Enter({ navigation }) {
  return (
    <Container>
      <View style={styles.welcomeContainer}>
        {WelcomeIcon && <WelcomeIcon width={220} height={220} />}
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
