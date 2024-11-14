import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { ActionButton } from "../components/UI/buttons";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../data/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
// import TextInput from "../components/UI/input";
import { Container } from "../components/Container";
import CustomTextInput from "../components/UI/input";
import WelcomeIcon from "../assets/svg/WelcomeIcon.svg";

export default function SignUp({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");

  const handleSignUp = async () => {
    if (!email || !password || !displayName) {
      Alert.alert("All fields are required.");
      return;
    }
    console.log("Auth object:", auth);

    try {
      // Create user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userId = userCredential.user.uid;

      // Store the user's basic data in Firestore
      const userDocRef = doc(db, "users", userId);
      await setDoc(userDocRef, {
        email,
        displayName,
        password,
        createdAt: new Date(),
      });

      Alert.alert("User registered successfully!");
      console.log("User ID:", userId);
      navigation.navigate("Login");
    } catch (error) {
      console.error("Error signing up:", error);

      if (error.code === "auth/email-already-in-use") {
        Alert.alert(
          "Email already in use",
          "This email is already registered. Would you like to log in instead?",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Log In",
              onPress: () => navigation.navigate("Login"),
            },
          ]
        );
      } else {
        Alert.alert("Sign-up failed", error.message);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"} // Adjust behavior based on platform
    >
      {/* Optionally wrap in ScrollView to allow scrolling when keyboard shows */}
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Container>
          <View style={styles.welcomeContainer}>
            <Text style={styles.greetingText}>Welcome to</Text>
            <Text style={styles.nameAppText}>Melody Moods!</Text>
            {WelcomeIcon && <WelcomeIcon width={220} height={220} />}
          </View>

          <View style={styles.inputContainer}>
            <CustomTextInput
              placeholder="Username"
              value={displayName}
              onChangeText={setDisplayName}
              textColor="white"
            />
            <CustomTextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              textColor="white"
            />
            <CustomTextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              textColor="white"
            />
          </View>

          <View style={styles.buttonContainer}>
            <ActionButton
              text="Sign Up"
              page="SpotifyLogin"
              buttonStyle={styles.signUpButton}
              textColor="#FFFFFF"
              onPress={handleSignUp}
            />
          </View>
        </Container>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  welcomeContainer: {
    alignItems: "center",
    marginTop: -50,
  },
  image: {
    width: 180,
    height: 180,
    marginTop: 15,
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
    marginTop: 30,
  },
  signUpButton: {
    backgroundColor: "#303030",
  },
  buttonContainer: {
    //marginTop: 20, // Optional: Add some spacing between inputs and the button
  },
});
