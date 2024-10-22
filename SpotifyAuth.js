// SpotifyAuth.js
import * as AuthSession from "expo-auth-session";

const CLIENT_ID = "d19dd1312bee45a68e607c8ffa5a97ec"; // Replace with your Spotify Client ID
const REDIRECT_URI = AuthSession.makeRedirectUri({ useProxy: true }); // Use useProxy for Expo Go
const SCOPES = "user-read-private user-read-email"; // Add your desired scopes

export const getSpotifyAuthUrl = () => {
  return `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&scope=${encodeURIComponent(SCOPES)}`;
};

export const exchangeCodeForToken = async (authorizationCode) => {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code: authorizationCode,
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
      client_secret: "YOUR_CLIENT_SECRET", // Replace with your client secret
    }),
  });

  const data = await response.json();
  if (response.ok) {
    // Use the access token (data.access_token)
    console.log("Access Token:", data.access_token);
    return data.access_token; // Return the access token
  } else {
    console.error("Failed to exchange code for token:", data);
    throw new Error(data.error_description || "Token exchange failed");
  }
};
