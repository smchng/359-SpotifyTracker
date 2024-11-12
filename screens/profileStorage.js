import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { CircleButton } from "../components/UI/buttons";
import Logout from "../components/logout";
import LocIcon from "../assets/svg/location.svg";
import { Profile } from "../components/UI/profile-ui";
import EntriesList from "../components/DateEntries";

//Login Button
export function ProfileStorage({ navigation }) {
  return (
    <View>
      <CircleButton SVGIcon={LocIcon} page="Map" navigation={navigation} />
      <Profile />
      <EntriesList navigation={navigation} />
      {/* <RecentlyPlayed navigation={navigation} /> */}
      <Logout navigation={navigation} />
    </View>
  );
}
