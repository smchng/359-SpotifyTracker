// Fetches Spotify Profile data

import { getAccessToken } from "../ApiAccess/TokenStorage.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, setDoc, collection } from "firebase/firestore";
import { db } from "../data/firebaseConfig.js";

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
    const profile = await saveUserProfileToFile(data);
    return data; // Return user profile data
  } catch (error) {
    console.error("Error fetching user profile:", error);
  }
};

const saveUserProfileToFile = async (profile) => {
  // Convert profile object to string format (you can format it as needed)
  const profileData = JSON.stringify(profile, null, 2); // Stringify with indentation for readability

  // Log profileData to debug
  console.log("Profile Data to Save:", profileData);

  if (!profileData) {
    console.error("Profile data is null or undefined");
    return;
  }
  try {
    const profileData = JSON.stringify(profile); // Convert the profile object to a string
    await AsyncStorage.setItem("userProfile", profileData); // Save the string to AsyncStorage
    console.log("User profile saved to AsyncStorage");
    const { display_name: name, email: email, id: id } = profile; // Example mapping, adjust to match actual profile structure
    await storeFirebase(email, id, name);
  } catch (error) {
    console.error("Error saving user profile to AsyncStorage:", error);
  }
};

const readUserProfileFromAsyncStorage = async () => {
  try {
    const profileData = await AsyncStorage.getItem("userProfile");
    if (profileData !== null) {
      const profile = JSON.parse(profileData);
      console.log("Retrieved User Profile:", profile);
      return profile;
    } else {
      console.log("No user profile found in AsyncStorage");
      return null;
    }
  } catch (error) {
    console.error("Error reading user profile:", error);
  }
};

const storeFirebase = async (email, id, name) => {
  try {
    const docRef = doc(collection(db, "spotify-user"));

    // Add user information to Firestore
    await setDoc(docRef, {
      email: email,
      id: id,
      name: name,
      timestamp: new Date(),
    });

    console.log("User stored with ID: ", docRef.id);
  } catch (error) {
    console.error("Error saving to Firebase:", error);
  }
};
