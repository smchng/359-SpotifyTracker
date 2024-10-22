import React from "react";
import { Button, View, StyleSheet, Text } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { getSpotifyAuthUrl, REDIRECT_URI } from "./SpotifyAuth"; // Adjust the path if necessary
import * as Linking from "expo-linking"; // For URL parsing
import * as AuthSession from "expo-auth-session";

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
          await exchangeAuthorizationCode(code);
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
  // Function to exchange the authorization code for an access token
  const exchangeAuthorizationCode = async (authorizationCode) => {
    const CLIENT_ID = "d19dd1312bee45a68e607c8ffa5a97ec"; // Replace with your actual Client ID
    const CLIENT_SECRET = "88603635b26c4819a80228b12d6c5437"; // Replace with your actual Client Secret
    const REDIRECT_URI = AuthSession.makeRedirectUri({ useProxy: true }); // The same URI used during the initial authorization

    const authHeader = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`); // Base64 encode the client ID and secret

    try {
      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${authHeader}`,
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code: authorizationCode, // The code you received from Spotify
          redirect_uri: REDIRECT_URI, // Same as what you used in the authorization URL
        }).toString(),
      });

      const data = await response.json();

      if (data.access_token) {
        console.log("Access Token:", data.access_token);

        // Fetch the user's profile or other Spotify data here
        fetchUserProfile(data.access_token); // Fetch user profile
      } else {
        console.error("Failed to get access token", data);
      }
    } catch (error) {
      console.error("Error exchanging code for token:", error);
    }
  };

  // Function to fetch the user's Spotify profile data
  const fetchUserProfile = async (accessToken) => {
    try {
      const response = await fetch("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      console.log("User Profile:", data); // Log the user profile data
    } catch (error) {
      console.error("Error fetching user profile:", error);
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
