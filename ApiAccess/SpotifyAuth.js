// src/services/spotifyService.js
import * as AuthSession from "expo-auth-session";
import {
  setAccessToken,
  getAccessToken,
  setRefreshToken,
} from "./TokenStorage";

export const exchangeAuthorizationCode = async (authorizationCode) => {
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
      setAccessToken(data.access_token);
      if (data.refresh_token) {
        setAccessToken(data.refresh_token); // Store refresh token if available
      }
      return data.access_token; // Return the access token
    } else {
      console.error("Failed to get access token", data);
      return null;
    }
  } catch (error) {
    console.error("Error exchanging code for token:", error);
    return null;
  }
};
