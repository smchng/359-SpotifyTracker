import React from "react";
import { Button, View, StyleSheet, Text } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { getSpotifyAuthUrl, REDIRECT_URI } from "./SpotifyAuth"; // Adjust the path if necessary
import * as Linking from "expo-linking"; // For URL parsing

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
      if (result.type === "success" && result.url) {
        // Parse the URL to extract the authorization code
        const { queryParams } = Linking.parse(result.url);
        const code = queryParams["code"]; // Adjust based on your Spotify response
        if (code) {
          console.log("Authorization Code:", code);
          // Exchange the code for an access token
        } else {
          console.error("Authorization code missing in response", queryParams);
        }
      } else {
        console.error("Authentication failed or dismissed", result);
      }
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Login with Spotify" onPress={handleLogin} />
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
