import { StyleSheet, View, Text, Button } from "react-native";
import { Buttons } from "../components/buttons";

// Login with existing account
export default function Login({ navigation }) {
  return (
    <View style={styles.container}>
    <View style={styles.welcomeContainer}>
      {/* image should go on this line */}
      <Text style={styles.greetingText}>Welcome Back!</Text>
    </View>
    <View style={styles.buttonContainer}>
    <Buttons 
      text="Login" 
      page="SpotifyLogin" 
      navigation={navigation}
      buttonStyle={styles.loginButton}
      textColor="#FFFFFF" 
      />
      </View>
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#868686',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeContainer: {
    marginTop: 250,
  },
  greetingText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  buttonContainer: {
    marginBottom: 100,
  },
  loginButton: {
    backgroundColor: '#303030',
  },
 
});

