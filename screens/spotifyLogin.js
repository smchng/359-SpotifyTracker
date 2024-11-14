import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import SpotifyLoginButton from "../components/SpotifyLoginButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUser } from "../components/UserAuth";
import { Buttons } from "../components/UI/buttons";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../data/firebaseConfig"; // Adjust the path to your firebaseConfig file

const fetchUserProfileFromFirestore = async (userId) => {
  try {
    const userDocRef = doc(db, "users", userId); // Reference to the user document
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const spotifyUserCollectionRef = collection(userDocRef, "spotify-user"); // Reference to the "spotify-user" subcollection
      const spotifyUserDocs = await getDocs(spotifyUserCollectionRef);

      if (!spotifyUserDocs.empty) {
        // Assuming you want the first document in the collection
        const spotifyUserDoc = spotifyUserDocs.docs[0].data();
        console.log("Fetched Spotify User Data:", spotifyUserDoc); // Log the fetched data
        return spotifyUserDoc; // Return the spotify user data
      } else {
        console.error("No Spotify user documents found!");
        return null;
      }
    } else {
      console.error("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user profile from Firestore:", error);
    return null;
  }
};

// Login with existing account
export default function SpotifyLogin({ navigation }) {
  const { userId } = useUser();
  const [userProfile, setUserProfile] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = async (status, profile) => {
    setIsLoggedIn(status);
    await AsyncStorage.setItem("accessToken", profile.accessToken);
  };

  return (
    <View>
      <SpotifyLoginButton onLogin={handleLogin} userId={userId} />
      <Buttons text="Next" page="ProfileStorage" navigation={navigation} />
    </View>
  );
}
