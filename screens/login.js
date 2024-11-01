import { StyleSheet, View, Text, Button, Alert, TextInput } from "react-native";
import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useUser } from "../components/UserAuth"; // Adjust the path as necessary

export default function Login({ navigation }) {
  const [email, setEmail] = useState(""); // Controlled input for email
  const [password, setPassword] = useState(""); // Controlled input for password
  const { setUserId } = useUser(); // Get the setUserId function from context

  // Function to handle user login
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("All fields are required.");
      return;
    }

    const userId = await loginUser(email, password); // Await the loginUser function
    if (userId) {
      setUserId(userId); // Store the user ID in context
      navigation.navigate("SpotifyLogin"); // Navigate to the next page
    }
  };

  return (
    <View style={styles.container}>
      <Text>Email:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
      />
      <Text>Password:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
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
