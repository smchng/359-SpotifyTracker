import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps"; // Importing the MapView and Marker components from react-native-maps
import * as Location from "expo-location"; // Importing expo-location to get the user's location

import { CurrentlyPlayingTrack } from "../components/CurrentTrack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MusicTimer } from "../components/MusicTimer";
import { CircleButton } from "../components/UI/buttons";

export function Map({ navigation }) {
  const [location, setLocation] = useState(null); // State to store the user's location
  const [errorMsg, setErrorMsg] = useState(null); // State to store any potential error message

  // This useEffect hook is used to request location permissions and fetch the user's location
  useEffect(() => {
    (async () => {
      // Request location permissions
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      // Get the user's current location
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords); // Store the coordinates in state
    })();
  }, []);

  // If there's an error, display it, otherwise display the location
  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg; // If an error message exists, show it
  } else if (location) {
    text = JSON.stringify(location, null, 2); // Display location coordinates
  }

  // Handle navigation to the specified page
  const handlePage = (page) => {
    navigation.navigate(page); // Navigate to the page passed in as a prop
  };

  return (
    <View style={styles.container}>
      {/* CircleButton component */}
      <CircleButton
        text="Profile"
        page="ProfileStorage"
        navigation={navigation}
      />
      {/* MusicTimer and CurrentlyPlayingTrack components */}
      {/* <MusicTimer /> */}
      <CurrentlyPlayingTrack />

      {/* Render the MapView if location is available */}
      {location && (
        <MapView
          style={styles.map} // Apply styling to the map
          region={{
            latitude: location.latitude, // Set map's latitude based on user's location
            longitude: location.longitude, // Set map's longitude based on user's location
            latitudeDelta: 0.0922, // Define zoom level for latitude
            longitudeDelta: 0.0421, // Define zoom level for longitude
          }}
        >
          {/* Place a Marker at the user's location */}
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
          />
        </MapView>
      )}
    </View>
  );
}

// Styling for the container and map
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    width: "100%", // Map will take up 100% of the width
    height: "100%", // Map will take up 100% of the height
  },
});
