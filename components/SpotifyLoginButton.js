// src/components/LoginButton.js

import React from "react";
import { Button, StyleSheet } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import * as Linking from "expo-linking";
import { getSpotifyAuthUrl, REDIRECT_URI } from "../ApiAccess/SpotifyAuth";
import { exchangeAuthorizationCode } from "../ApiAccess/UserAuth";
import { fetchUserProfile } from "./UserProfile";
import { setAccessToken, getAccessToken } from "../ApiAccess/TokenStorage";
import { CustomButton } from "./buttons.js";

const SpotifyLoginButton = ({ onLogin }) => {
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
          const accessToken = await exchangeAuthorizationCode(code);
          if (accessToken) {
            setAccessToken(accessToken);
            // Fetch user profile after getting access token
            userProfile = await fetchUserProfile(accessToken);
            onLogin(true, userProfile);
          }
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

  return <CustomButton 
    text="Login with Spotify" 
    onPress={handleLogin}
    style={styles.button}
    textColor="#0000FF"
  />;
};

const styles = StyleSheet.create({
  button: {
    width: 300,
    marginVertical: 15,
    borderRadius: 13,
    paddingVertical: 20,
    backgroundColor: '#FF0000',
     
    //shadow
     shadowColor: '#000000',
     shadowOffset: {
       width: 4,
       height: 4,
     },
     shadowOpacity: 0.4,
     shadowRadius: 7,
  },
});

export default SpotifyLoginButton;
