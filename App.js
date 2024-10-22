// src/App.js

import React from "react";
import { StyleSheet, View } from "react-native";
import LoginButton from "./components/loginButton";

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
