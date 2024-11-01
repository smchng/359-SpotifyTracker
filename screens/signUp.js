// Sign up
import { StyleSheet, View, Text, Button, TextInput, Alert } from "react-native";
import { Buttons } from "../components/UI/buttons";
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../data/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

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
    <View style={styles.container}>
      <Text>Welcome to, NAME</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Display Name"
        value={displayName}
        onChangeText={setDisplayName}
      />
      <Button title="Sign Up" onPress={handleSignUp} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});
