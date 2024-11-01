// Renders logout button and clears Async

import React from "react";
import { LogoutButton } from "../components/UI/buttons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Logout = ({ navigation }) => {
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
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <LogoutButton
      text="Logout"
      page="Enter"
      navigation={navigation}
      onPress={handleLogout}
    />
  );
};

export default Logout;
