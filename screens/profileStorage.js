import React, { useEffect, useState } from "react";
import { StyleSheet, View, Image, Text } from "react-native";
import { CircleButton } from "../components/UI/buttons";
import Logout from "../components/logout";
import LocIcon from "../assets/svg/location.svg";
import { useUser } from "../components/UserAuth";
import { Profile } from "../components/UI/profile-ui";
import EntriesList from "../components/DateEntries";
import MusicTimer from "../components/MusicTimer";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function ProfileStorage({ navigation }) {
  const { userId } = useUser();
  const [storedTimeLeft, setStoredTimeLeft] = useState(null); // Initialize state for timeLeft

  useEffect(() => {
    // Define an async function to fetch stored timeLeft
    const loadTimeLeft = async () => {
      try {
        const storedTime = await AsyncStorage.getItem("timeLeft");
        if (storedTime !== null) {
          setStoredTimeLeft(storedTime); // Set the fetched value into state
        }
      } catch (error) {
        console.error("Error fetching timeLeft from AsyncStorage:", error);
      }
    };

    loadTimeLeft(); // Call the async function when the component mounts
  }, []); // Empty dependency array ensures this effect runs only once when the component mounts

  return (
    <View style={styles.container}>
      <View style={styles.topNav}>
        <CircleButton SVGIcon={LocIcon} page="Map" navigation={navigation} />
        {/* Display the storedTimeLeft once it is fetched */}
        <Text>{storedTimeLeft ? storedTimeLeft : "Loading..."}</Text>
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
        {/* <RecentlyPlayed navigation={navigation} />
        <Logout navigation={navigation} /> */}
      </View>

      <View style={styles.logoutButtonWrapper}>
        {/* <Profile />
        <EntriesList navigation={navigation} />
        <RecentlyPlayed navigation={navigation} /> */}
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
    marginTop: 100,
  },
  logoutButtonWrapper: {
    alignItems: "center",
    marginBottom: 30,
  },
  profileImages: {
    position: "absolute",
    top: 105,
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
  topNav: {
    flexDirection: "row",
  },
});
