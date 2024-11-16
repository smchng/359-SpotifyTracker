import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps"; // Importing the MapView and Marker components from react-native-maps
import * as Location from "expo-location"; // Importing expo-location to get the user's location
import { useUser } from "../components/UserAuth";
import { CurrentlyPlayingTrack } from "../components/CurrentTrack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MusicTimer from "../components/MusicTimer";
import { CircleButton } from "../components/UI/buttons";
import UserIcon from "../assets/svg/user.svg";
import { RenderPin } from "../components/DropPins";
import { EntryListWithPins } from "../components/PinFilter";

export function Map({ navigation }) {
  const { userId } = useUser();
  const [location, setLocation] = useState(null); // State to store the user's location
  const [errorMsg, setErrorMsg] = useState(null); // State to store any potential error message
  const [initialRegion, setInitialRegion] = useState(null); // State to store the initial region for the map
  const mapRef = useRef(null); // Ref for the MapView to persist without re-rendering
  const [selectedEntry, setSelectedEntry] = useState(null);

  // This useEffect hook is used to request location permissions and fetch the user's location
  useEffect(() => {
    (async () => {
      // Request location permissions
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      // Watch for location changes
      const locationSubscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: 10 }, // Specify accuracy and interval
        (location) => {
          setLocation(location.coords); // Update state with new location
          if (!initialRegion) {
            // Set the initial region only once when the first location is received
            setInitialRegion({
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            });
          }
        }
      );

      // Cleanup the location subscription when the component unmounts
      return () => {
        locationSubscription.remove(); // Stop watching for location when component unmounts
      };
    })();
  }, []); // Empty dependency array to run only once

  const handleEntryUpdate = async (entryId) => {
    setSelectedEntry(entryId); // Update the selected entry state
    try {
      // Store the selected entry in AsyncStorage
      await AsyncStorage.setItem("PinEntry", entryId);
      console.log("Entry stored successfully:", entryId);
    } catch (error) {
      console.error("Error storing entry in AsyncStorage:", error);
    }
  };

  // If there's an error, display it, otherwise display the location
  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg; // If an error message exists, show it
  } else if (location) {
    text = JSON.stringify(location, null, 2); // Display location coordinates
  }

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.topNav}>
          <CircleButton
            SVGIcon={UserIcon}
            page="ProfileStorage"
            navigation={navigation}
          />
          <MusicTimer userId={userId} navigation={navigation} />
        </View>

        <EntryListWithPins
          userId={userId}
          setSelectedEntry={handleEntryUpdate}
        />
      </View>
      {/* Render the MapView if location is available */}
      {initialRegion && ( // Render map only when initial region is set
        <MapView
          style={{ flex: 1 }}
          ref={mapRef} // Assign the map ref
          initialRegion={initialRegion}
          showsUserLocation={true}
        >
          {/* Place a Marker at the user's location */}

          {selectedEntry && (
            <RenderPin userId={userId} entryId={selectedEntry} />
          )}
        </MapView>
      )}
      <CurrentlyPlayingTrack />
    </View>
  );
}

// Styling for the container and map
const styles = StyleSheet.create({
  container: {
    flex: 1, // Allows the container to take up the full screen
  },
  map: {
    ...StyleSheet.absoluteFillObject, // Fills the entire parent container
  },
  topNav: {
    flexDirection: "row",
  },
});
