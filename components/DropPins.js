import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Text, View, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { db } from "../data/firebaseConfig.js"; // Update with your Firebase config path
import { doc, setDoc, collection } from "firebase/firestore"; // Firebase Firestore functions

// Function to fetch location and update state
export const fetchLocation = async () => {
  try {
    // Request location permissions
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.error("Permission to access location was denied");
      return null;
    }

    // Get current location
    const locationData = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    const { latitude, longitude } = locationData.coords;

    // Log location data for debugging
    console.log("Current location Pin:", latitude, longitude);

    // Return location coordinates
    return { latitude, longitude };
  } catch (error) {
    console.error("Location error:", error);
    return null;
  }
};

export const StorePin = async (userId, formattedDate, formattedTime) => {
  const newLocation = await fetchLocation(); // Fetch the location data

  if (!newLocation) {
    console.error("Failed to fetch location.");
    return;
  }

  const { latitude, longitude } = newLocation;

  // Get the current time in the desired format
  const now = new Date();
  const Time = now.toLocaleTimeString("en-GB", { hour12: false });

  console.log("Storing location:", latitude, longitude);
  try {
    // Store the location in Firebase
    const entriesDocRef = doc(db, "users", userId);
    const entriesCollectionRef = collection(entriesDocRef, "Entries");
    const entriesDateDocRef = doc(entriesCollectionRef, formattedDate);
    const entriesTimeRef = collection(entriesDateDocRef, "Time");
    const entriesTimeDocRef = doc(entriesTimeRef, formattedTime);
    const entriesPlaylistRef = collection(entriesTimeDocRef, "Pins");
    const entriesPlaylistDocRef = doc(entriesPlaylistRef, Time);

    // Create the document for the new track
    await setDoc(entriesPlaylistDocRef, {
      latitude: latitude,
      longitude: longitude,
      time: Time,
    });

    console.log("New track stored successfully");
  } catch (error) {
    console.error("Error storing new track:", error);
  }
};

// Function to render the map and pin
export const RenderPin = ({ location, trackLocations }) => {
  if (!location) {
    return <Text>Loading location pin</Text>; // Display loading message if location is not yet available
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={true}
      >
        {trackLocations.map((trackLocation) => (
          <Marker
            key={trackLocation.key}
            coordinate={{
              latitude: trackLocation.latitude,
              longitude: trackLocation.longitude,
            }}
          >
            <View style={styles.circle} />
          </Marker>
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  circle: {
    width: 30, // Diameter of the circle
    height: 30,
    backgroundColor: "red", // Color of the circle
    borderRadius: 15, // Half of the width/height to make it a circle
  },
});
