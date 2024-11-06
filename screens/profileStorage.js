import React, { useState } from "react";
import { StyleSheet, View, Text, Button } from "react-native";
import { CircleButton } from "../components/UI/buttons";
import Logout from "../components/logout";
import { RecentlyPlayed } from "../components/RecentlyPlayed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LocIcon from "../assets/svg/location.svg";

//Login Button
export function ProfileStorage({ navigation }) {
  return (
    <View>
      <CircleButton SVGIcon={LocIcon} page="Map" navigation={navigation} />
      <RecentlyPlayed navigation={navigation} />
      <Logout navigation={navigation} />
    </View>
  );
}
