// src/App.js

import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import LoginButton from "./components/loginButton";
import { startPollingForTrackChanges } from "./UserData";
import { setAccessToken, getAccessToken } from "./TokenStorage";

export default function App() {
  useEffect(() => {
    // Fetch the access token when the component mounts
    const accessToken = getAccessToken();

    if (accessToken) {
      // Call the polling function to track changes
      startPollingForTrackChanges(accessToken);
    } else {
      console.error("No access token available");
    }
  }, []); // Runs only once after the component mounts

  return (
    <View style={styles.container}>
      <LoginButton />
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
