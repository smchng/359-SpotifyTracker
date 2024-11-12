// Connect and login with spotify
import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Button, Image } from "react-native";
import SpotifyLoginButton from "../components/SpotifyLoginButton";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { NavigationButton } from "../components/buttons";
import { Container } from "../components/Container";

// Login with existing account
import { useUser } from "../components/UserAuth";
import { Buttons } from "../components/UI/buttons";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../data/firebaseConfig"; // Adjust the path to your firebaseConfig file

export const fetchSpotifyProfileFromFirestore = async (userId) => {
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

export default function SpotifyLogin({ navigation }) {
  const { userId } = useUser();
  const [userProfile, setUserProfile] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = async (status, profile) => {
    setIsLoggedIn(status);
    await AsyncStorage.setItem("accessToken", profile.accessToken);

    // Fetch user profile from Firestore after login
    const fetchedProfile = await fetchSpotifyProfileFromFirestore(userId);
    if (fetchedProfile) {
      setUserProfile(fetchedProfile); // Update state with Firestore profile
    } else {
      console.error("Failed to fetch profile from Firestore.");
    }
  };

  return (
    <Container>
      <View style={styles.welcomeContainer}>
        {/* image should go on this line */}
        {/* <WelcomeIcon width="100%" height="100%" /> */}
        <Image
          source={require("../assets/spotifyIcon.png")}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      {isLoggedIn ? (
        <>
          <Text>Welcome, {userProfile?.display_name}!</Text>
          <NavigationButton text="Next" page="Map" navigation={navigation} />
        </>
      ) : (
        <SpotifyLoginButton onLogin={handleLogin} userId={userId} />
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  image: {
    alignSelf: "center",
    width: 180,
    height: 180,
  },
});
