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
