// Connect and login with spotify
import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Button } from "react-native";
import SpotifyLoginButton from "../components/SpotifyLoginButton";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Buttons } from "../components/buttons";

// Login with existing account
export default function SpotifyLogin({ navigation }) {
  const [userProfile, setUserProfile] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (status, profile) => {
    setIsLoggedIn(status);
    setUserProfile(profile);
    AsyncStorage.setItem("accessToken", profile.accessToken);
    AsyncStorage.setItem("userProfile", JSON.stringify(profile));
  };
  return (
    <View>
      {isLoggedIn ? (
        <>
          <Text>Welcome, {userProfile?.display_name}!</Text>
          <Buttons text="Next" page="Map" navigation={navigation} />
        </>
      ) : (
        <SpotifyLoginButton onLogin={handleLogin} />
      )}
    </View>
  );
}
