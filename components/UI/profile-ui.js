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
          <Text>{userProfile.displayName}</Text>
        ) : (
          <Text>Hello!</Text>
        )}
      </View>
      <View style={styles.profile}>
        {userSpotifyProfile ? (
          <Text>{userSpotifyProfile.name}</Text>
        ) : (
          <Text>Spotify</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  profileContainer: {
    flexDirection: "row",
  },
  profile: {
    width: "50%",
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
});
