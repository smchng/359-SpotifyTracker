// App.js
import React from "react";
import { Button, View, StyleSheet, Text } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { getSpotifyAuthUrl, REDIRECT_URI } from "./SpotifyAuth"; // Adjust the path if necessary

export default function App() {
  const handleLogin = async () => {
    console.log("Login button pressed");
    try {
      const authUrl = getSpotifyAuthUrl();
      console.log("Auth URL:", authUrl);
      const result = await WebBrowser.openAuthSessionAsync(
        authUrl,
        REDIRECT_URI
      );

      // Check if the result is successful
      if (result.type === "success") {
        const { code } = result.params; // You will receive the authorization code here
        // Exchange the code for an access token
        console.log("Authorization Code:", code);
      } else {
        console.error("Authentication failed", result);
      }
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Login with Spotify" onPress={handleLogin} />
      <Text>TEST1</Text>
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
