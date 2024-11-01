// Connect and login with spotify
import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Button } from "react-native";
import SpotifyLoginButton from "../components/SpotifyLoginButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUser } from "../components/UserAuth";
import { Buttons } from "../components/UI/buttons";

// Login with existing account
export default function SpotifyLogin({ navigation }) {
  const { userId } = useUser();
  const [userProfile, setUserProfile] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (status, profile) => {
    setIsLoggedIn(status);
    setUserProfile(profile);
    AsyncStorage.setItem("accessToken", profile.accessToken);
    AsyncStorage.setItem("userProfile", JSON.stringify(profile));

    // Here you can also handle saving the userId if needed
    console.log("User ID during Spotify login:", userId);
  };

  return (
    <View>
      {isLoggedIn ? (
        <>
          <Text>Welcome, {userProfile?.display_name}!</Text>
          <Buttons text="Next" page="Map" navigation={navigation} />
        </>
      ) : (
        <SpotifyLoginButton onLogin={handleLogin} userId={userId} />
      )}
    </View>
  );
}
