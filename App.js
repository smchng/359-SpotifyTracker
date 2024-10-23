// src/App.js

import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import LoginButton from "./components/loginButton";
import { startPollingForTrackChanges } from "./UserData";
import { setAccessToken, getAccessToken } from "./TokenStorage";

export default function App() {
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
