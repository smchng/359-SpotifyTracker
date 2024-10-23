// src/App.js

import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import LoginButton from "./components/loginButton";
import LogoutButton from "./components/logoutButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CurrentlyPlayingTrack } from "./components/showTrack";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  const handleLogin = (status, profile) => {
    setIsLoggedIn(status);
    setUserProfile(profile);
    AsyncStorage.setItem("accessToken", profile.accessToken); // Assuming you have accessToken in profile
    AsyncStorage.setItem("userProfile", JSON.stringify(profile));
  };
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserProfile(null);
  };
  return (
    <View style={styles.container}>
      {isLoggedIn ? (
        <>
          <Text>Welcome, {userProfile?.display_name}!</Text>
          <CurrentlyPlayingTrack></CurrentlyPlayingTrack>
          <LogoutButton onLogout={handleLogout} />
        </>
      ) : (
        <LoginButton onLogin={handleLogin} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
