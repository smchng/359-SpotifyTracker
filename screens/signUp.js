// Sign up
import { StyleSheet, View, Text, Button } from "react-native";
import { Buttons } from "../components/buttons";

export default function SignUp({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");

  const handleSignUp = async () => {
    if (!email || !password || !displayName) {
      Alert.alert("All fields are required.");
      return;
    }

    const auth = getAuth();
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
      Alert.alert("Sign-up failed:", error.message);
    }
  };

  return (
    <View>
      <Text>Welcome to, NAME</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        placeholder="Display Name"
        value={displayName}
        onChangeText={setDisplayName}
      />
      <Button title="Sign Up" onPress={handleSignUp} />
    </View>
  );
}
