// src/components/LoginButton.js

import React from "react";
import { Button } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import * as Linking from "expo-linking";
import { getSpotifyAuthUrl, REDIRECT_URI } from "../SpotifyAuth";
import { exchangeAuthorizationCode } from "../UserAuth";
import { fetchUserProfile } from "./UserProfile";
import { setAccessToken, getAccessToken } from "../TokenStorage";

const LoginButton = ({ onLogin }) => {
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

  return <Button title="Login with Spotify" onPress={handleLogin} />;
};

export default LoginButton;
