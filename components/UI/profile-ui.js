import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Button,
  TouchableOpacity,
  Image,
} from "react-native";
import { useUser } from "../UserAuth";
import { fetchSpotifyProfileFromFirestore } from "../../screens/spotifyLogin";
import { fetchUserProfileFromFirestore } from "../UserProfile";
// import WelcomeIcon from "../assets/svg/WelcomeIcon.svg";
// import SpotifyLoginButton from "../components/SpotifyLoginButton";


export function Profile() {
  const { userId } = useUser();
  const [userSpotifyProfile, setSpotifyUserProfile] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        // Fetch Spotify Profile
        const fetchedSpotifyProfile = await fetchSpotifyProfileFromFirestore(
          userId
        );
        if (fetchedSpotifyProfile) {
          setSpotifyUserProfile(fetchedSpotifyProfile); // Update state with Spotify profile
        } else {
          console.error("Failed to fetch Spotify profile from Firestore.");
        }

        // Fetch General User Profile
        const fetchedProfile = await fetchUserProfileFromFirestore(userId);
        if (fetchedProfile) {
          setUserProfile(fetchedProfile); // Update state with general user profile
        } else {
          console.error("Failed to fetch general user profile from Firestore.");
        }
      } catch (error) {
        console.error("Error fetching user profiles:", error);
      }
    };

    getUserProfile(); // Call the async function inside useEffect
  }, [userId]); // Add userId as a dependency
  return (
    <View style={styles.profileContainer}>
      <View style={styles.profile}>
        {userProfile ? (
          <Text style={styles.profileText}>{userProfile.displayName}</Text>
        ) : (
          <Text style={styles.profileText}>Hello!</Text>
        )}
      </View>
      <View style={styles.profile}>
        {userSpotifyProfile ? (
          <Text style={styles.profileText}>{userSpotifyProfile.name}</Text>
        ) : (
          <Text style={styles.profileText}>Spotify</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  profileContainer: {
    flexDirection: "row", // Stack profiles vertically
    alignItems: "center", // Center all profiles horizontally
    justifyContent: 'center', // Center vertically (optional)
  },
  profile: {
    width: "43%",
    marginHorizontal: 10,
    paddingVertical: 25,
    alignItems: "center",
    backgroundColor: "#EBEFF2",
    padding: 15,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 5, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 7,
    elevation: 2,
  },
  profileText: {
    marginTop: 20, // Adds space above the text, pushing it lower
    color:"#585858",
  },
});