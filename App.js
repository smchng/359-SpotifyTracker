// App.js
import React, { useState } from "react";
import { Button, View, StyleSheet, Text } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getSpotifyAuthUrl,
  REDIRECT_URI,
  exchangeCodeForToken,
} from "./SpotifyAuth"; // Adjust the path if necessary

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const handleLogin = async () => {
    console.log("Login button pressed");
    const authUrl = getSpotifyAuthUrl();
    console.log("Auth URL:", authUrl);

    try {
      const result = await WebBrowser.openAuthSessionAsync(
        authUrl,
        REDIRECT_URI
      );

      // Check if the result is successful
      if (result.type === "success") {
        const { code } = result.params; // You will receive the authorization code here
        console.log("Authorization Code:", code);
        setIsLoggedIn(true); // Set the logged-in state
        // TODO: Exchange the code for an access token
        try {
          const accessToken = await exchangeCodeForToken(code); // Exchange code for token
          console.log("Logged in with access token:", accessToken);
          // You can now use the access token to make API calls
        } catch (error) {
          console.error("Error during token exchange:", error);
        }
      } else if (result.type === "dismiss") {
        console.warn("Authentication was dismissed.");
      } else {
        console.error("Authentication failed", result);
      }
    } catch (error) {
      console.error("Error during authentication:", error);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem("spotifyToken");
    setIsLoggedIn(false); // Update your login state
  };

  const handleLogout = async () => {
    setIsLoggedIn(false);
    await AsyncStorage.removeItem("spotifyToken"); // Clear any stored token if applicable
    console.log("User logged out");
  };

  return (
    <View style={styles.container}>
      <Button title="Login with Spotify" onPress={handleLogin} />
      <Button title="Logout" onPress={handleLogout} />
      {isLoggedIn ? (
        <>
          <Text>Logged in successfully!</Text>
          {/* Logout button */}
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
