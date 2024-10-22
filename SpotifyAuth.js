import * as AuthSession from "expo-auth-session";

// Use environment variable or a direct string for client ID
const CLIENT_ID = "d19dd1312bee45a68e607c8ffa5a97ec"; // Replace with your actual Spotify Client ID

// Detect if the app is running on Expo Go or as a standalone app
const useProxy = true; // Set to false when you build a standalone app
export const REDIRECT_URI = AuthSession.makeRedirectUri({ useProxy });

// Spotify authorization scopes
const SCOPES =
  "user-read-private user-read-email user-read-recently-played user-read-currently-playing"; // Adjust scopes as necessary

// Function to get Spotify auth URL
export const getSpotifyAuthUrl = () => {
  return `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&scope=${encodeURIComponent(SCOPES)}`;
};
