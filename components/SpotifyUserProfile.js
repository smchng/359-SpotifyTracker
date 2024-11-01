// Fetches Spotify Profile data

import { getAccessToken } from "../ApiAccess/TokenStorage.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, setDoc, collection } from "firebase/firestore";
import { db } from "../data/firebaseConfig.js";
import { useUser } from "./UserAuth";

export const fetchUserProfile = async () => {
  let accessToken = getAccessToken();

  if (!accessToken) {
    accessToken = await refreshAccessToken(); // Refresh token if expired
  }

  try {
    const response = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    console.log("User Profile:", data); // Log the user profile data

    return data; // Return user profile data
  } catch (error) {
    console.error("Error fetching user profile:", error);
  }
};

const saveUserProfileToFile = async (profile, userId) => {
  // Convert profile object to string format (you can format it as needed)
  const profileData = JSON.stringify(profile, null, 2); // Stringify with indentation for readability

  // Log profileData to debug
  console.log("Profile Data to Save:", profileData);

  if (!profileData) {
    console.error("Profile data is null or undefined");
    return;
  }
  try {
    // const profileData = JSON.stringify(profile);
    await AsyncStorage.setItem("userProfile", profileData);
    console.log("User profile saved to AsyncStorage");
    console.log("Display Name:", profile.display_name);
  } catch (error) {
    console.error("Error saving user profile to AsyncStorage:", error);
  }
  if (userId) {
    try {
      await storeSpotifyProfileFirebase(
        userId,
        profile.email,
        profile.id,
        profile.display_name
      );
    } catch (error) {
      console.error("Error saving user profile to Firebase:", error);
    }
  } else {
    console.error("No User ID available for Firebase storage");
  }
};

const storeSpotifyProfileFirebase = async (userId, email, id, name) => {
  console.log("Access user ID: ", userId);

  if (!userId) {
    console.error("No User ID");
    return;
  }
  console.log("Storing to Firebase...");
  try {
    // Reference to the user's document in the "users" collection
    const userDocRef = doc(db, "users", userId);
    // Create or access the "spotify-user" subcollection within the user document
    const spotifyUserCollectionRef = collection(userDocRef, "spotify-user");
    // Reference for the document in the "spotify-user" subcollection
    const spotifyProfileDocRef = doc(spotifyUserCollectionRef, id); // Use Spotify ID as document ID

    // Add user information to Firestore
    await setDoc(spotifyProfileDocRef, {
      email, // This will be stored as the field "email"
      id, // This will be stored as the field "id"
      name, // This will be stored as the field "name"
      timestamp: new Date(), // Add a timestamp field
    });

    console.log("User stored with ID: ", spotifyProfileDocRef.id); // Fixed to use spotifyProfileDocRef.id
  } catch (error) {
    console.error("Error saving to Firebase:", error);
  }
};

export const handleFetchAndSaveUserProfile = async (userId) => {
  console.log("fetching data...");
  const profile = await fetchUserProfile(); // Fetch the user profile

  if (profile && userId) {
    await saveUserProfileToFile(profile, userId); // Pass userId to save function
  } else {
    console.error("No profile data or user ID available");
  }
};
