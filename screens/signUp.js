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
      // Alerts user if the email is already in use
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
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Container>
          <View style={styles.welcomeContainer}>
            <Text style={styles.greetingText}>WELCOME TO</Text>
            <Text style={styles.nameAppText}>Moodz!</Text>
            {WelcomeIcon && <WelcomeIcon width={220} height={220} />}
          </View>

          <View style={styles.inputContainer}>
            <CustomTextInput
              placeholder="Username"
              value={displayName}
              onChangeText={setDisplayName}
              textColor="black"
            />
            <CustomTextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Password"
              textColor="black"
            />
            <CustomTextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              textColor="black"
            />
          </View>

          <View>
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
    fontSize: 12,
    textAlign: "center",
    color: "#303030",
  },
  nameAppText: {
    fontSize: 50,
    fontWeight: "bold",
    textAlign: "center",
    color: "#303030",
    marginTop: -6,
  },
  inputContainer: {
    width: "100%",
    marginTop: 30,
  },
  signUpButton: {
    backgroundColor: "#303030",
  },
});
