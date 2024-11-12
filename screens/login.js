import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
  TextInput,
} from "react-native";
import { LoginButton } from "../components/buttons";
import CustomTextInput from "../components/UI/input";
import { Container } from "../components/Container"; // Assuming this is a custom container component

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useUser } from "../components/UserAuth"; // Adjust the path as necessary

export default function Login({ navigation }) {
  const [email, setEmail] = useState(""); // Controlled input for email
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState(""); // Controlled input for password
  const { setUserId } = useUser(); // Get the setUserId function from context

  // Function to handle user login
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("All fields are required.");
      return;
    }

    try {
      const userId = await loginUser(email, password); // Call your login function
      if (userId) {
        setUserId(userId); // Set user ID in context
        console.log("Logged in user ID: ", userId);
        navigation.navigate("SpotifyLogin"); // Navigate to the Spotify login screen
      } else {
        Alert.alert("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error: ", error);
      Alert.alert("An error occurred. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"} // Adjust behavior based on platform
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Container>
          <View style={styles.welcomeContainer}>
            <Text style={styles.greetingText}>Welcome Back!</Text>
            <Text style={styles.nameAppText}>Melody Moods</Text>
            <Image
              source={require("../assets/welcomeIcon1.png")}
              style={styles.image}
              resizeMode="contain"
            />
          </View>

          <View style={styles.inputContainer}>
            <CustomTextInput
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              textColor="white"
              autoComplete="email"
              secureEntry={false}
            />

            <CustomTextInput
              style={styles.input}
              placeholder="Enter your password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              textColor="white"
              autoComplete="password"
              secureEntry={true}
            />
          </View>

          <View style={styles.buttonContainer}>
            <View style={styles.buttonContainer}>
              <LoginButton
                text="Login"
                navigation={navigation}
                buttonStyle={styles.loginButton} // Styling for the button
                textColor="#FFFFFF"
                onPress={handleLogin} // Pass the function directly
              />
            </View>
          </View>
        </Container>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export const loginUser = async (email, password) => {
  const auth = getAuth();

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user.uid; // Return userId if login successful
  } catch (error) {
    Alert.alert("Login Failed", "Please check your email and password.");
    console.error("Error logging in:", error);
    return null;
  }
};

const styles = StyleSheet.create({
  welcomeContainer: {
    alignItems: "center",
    marginTop: -50, // Adjust top margin to push the content higher (similar to SignUp)
    marginBottom: 30, // Add some spacing below the text
  },
  image: {
    width: 180,
    height: 180,
    marginTop: 15, // Adjust image margin to space it out properly
  },
  greetingText: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#303030",
  },
  nameAppText: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#303030",
  },
  inputContainer: {
    width: "100%",
    marginTop: 70, // Adjust top margin to ensure inputs are spaced from the welcome section
  },
  loginButton: {
    backgroundColor: "#303030",
  },
  buttonContainer: {},
});
