import React, { useState } from "react";
import { StyleSheet, View, Text, Button } from "react-native";
import Logout from "../components/logout";
import AsyncStorage from "@react-native-async-storage/async-storage";
//Login Button
export function ProfileStorage({ navigation }) {
  return (
    <View>
      <Logout navigation={navigation} />
    </View>
  );
}
