// Connect and login with spotify
import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Button, Image } from "react-native";
import SpotifyLoginButton from "../components/SpotifyLoginButton";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { NavigationButton } from "../components/buttons";
import { Container } from "../components/Container";

// Login with existing account
export default function SpotifyLogin({ navigation }) {
  const [userProfile, setUserProfile] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = (status, profile) => {
    setIsLoggedIn(status);
    setUserProfile(profile);
    AsyncStorage.setItem("accessToken", profile.accessToken); // Assuming you have accessToken in profile
    AsyncStorage.setItem("userProfile", JSON.stringify(profile));
  };

  return (
    <Container>
      <View style={styles.welcomeContainer}>
      {/* image should go on this line */}
      {/* <WelcomeIcon width="100%" height="100%" /> */}
        <Image
          source={require('../assets/spotifyIcon.png')}
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
        <SpotifyLoginButton 
          onLogin={handleLogin}
          navigation={navigation} 
        />
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  image: {
    alignSelf: 'center',
    width: 180,
    height: 180,
  },
});
