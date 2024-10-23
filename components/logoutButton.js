import React from "react";
import { Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LogoutButton = ({ onLogout }) => {
  const handleLogout = async () => {
    try {
      // Clear the access token and user profile from AsyncStorage
      await AsyncStorage.removeItem("accessToken");
      await AsyncStorage.removeItem("userProfile");
      await AsyncStorage.removeItem("currentTrack");
      const profileData = await AsyncStorage.getItem("userProfile");
      const currentTrack = await AsyncStorage.getItem("currentTrack");
      if (!profileData && !currentTrack) {
        console.log("User Logged out");
      }
      // Call the onLogout function to update the login state
      onLogout();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return <Button title="Logout" onPress={handleLogout} />;
};

export default LogoutButton;
