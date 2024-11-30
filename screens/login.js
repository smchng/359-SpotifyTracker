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
import { ActionButton } from "../components/UI/buttons";
import CustomTextInput from "../components/UI/input";
import { Container } from "../components/Container"; // Assuming this is a custom container component
import WelcomeIcon from "../assets/svg/WelcomeIcon.svg";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useUser } from "../components/UserAuth"; // Adjust the path as necessary
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login({ navigation }) {
  const [email, setEmail] = useState(""); // Controlled input for email
  const [password, setPassword] = useState("");
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
            <Text style={styles.greetingText}>WELCOME BACK TO</Text>
            <Text style={styles.nameAppText}>Moodz</Text>
            {WelcomeIcon && <WelcomeIcon width={220} height={220} />}
          </View>

          <View style={styles.inputContainer}>
            <CustomTextInput
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              textColor="black"
              autoComplete="email"
              secureEntry={false}
            />

            <CustomTextInput
              placeholder="Enter your password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              textColor="black"
              autoComplete="password"
              secureEntry={true}
            />
          </View>

          <View style={styles.buttonContainer}>
            <View style={styles.buttonContainer}>
              <ActionButton
                text="Login"
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
    marginTop: -50,
    marginBottom: 30,
  },
  image: {
    width: 180,
    height: 180,
    marginTop: 15,
  },
  greetingText: {
    fontSize: 12,
    textAlign: "center",
    color: "#303030",
  },
  nameAppText: {
    fontSize: 45,
    fontWeight: "bold",
    textAlign: "center",
    color: "#303030",
    marginTop: -6,
  },
  inputContainer: {
    width: "100%",
    marginTop: 70,
  },
  loginButton: {
    backgroundColor: "#303030",
  },
});
