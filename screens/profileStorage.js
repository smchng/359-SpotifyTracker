import React from "react";
import { StyleSheet, View, Image } from "react-native";
import { CircleButton } from "../components/UI/buttons";
import Logout from "../components/logout";
import LocIcon from "../assets/svg/location.svg";
//import welcomeIcon from "../assets/svg/WelcomeIcon.svg";
import { Profile } from "../components/UI/profile-ui";
import EntriesList from "../components/DateEntries";

export function ProfileStorage({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Map button (CircleButton) stays at the top */}
      <View style={styles.circleButtonWrapper}>
        <CircleButton SVGIcon={LocIcon} page="Map" navigation={navigation} />
      </View>

      <View style={styles.profileImages}>
        <Image
          source={require("../assets/imgs/welcome.png")}
          style={styles.image}
          resizeMode="contain"
        />
        <Image
          source={require("../assets/imgs/spotify.png")}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      {/* This wrapper pushes everything else down */}
      <View style={styles.contentWrapper}>
        <Profile />
        <EntriesList navigation={navigation} />
      </View>

      <View style={styles.logoutButtonWrapper}>
        <Logout navigation={navigation} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    padding: 16,
  },

  circleButtonWrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },

  contentWrapper: {
    flex: 1,
    justifyContent: "flex-start",
    marginTop: 85,
    //marginBottom: 30,
  },
  logoutButtonWrapper: {
    alignItems: "center",
    marginBottom: 30,
  },
  profileImages: {
    position: "absolute",
    top: 80,
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    width: 250,
    zIndex: 2,
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 0,
  },
});
