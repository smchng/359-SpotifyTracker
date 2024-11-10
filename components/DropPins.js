import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Text, View, StyleSheet, Modal } from "react-native";
import React, { useEffect, useState } from "react";
import { db } from "../data/firebaseConfig.js"; // Update with your Firebase config path
import { doc, setDoc, collection, getDocs } from "firebase/firestore"; // Firebase Firestore functions

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

    await setDoc(entriesTimeDocRef, {
      placeholder: Time,
    });

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

// Function to fetch pins from Firestore
const fetchPinsFromFirestore = async (userId) => {
  try {
    // Get the current date formatted as "DD-MM-YYYY"
    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-GB").replace(/\//g, "-");

    // Reference to the "Time" collection under the specific "Entries" document
    const timeCollectionRef = collection(
      db,
      "users",
      userId,
      "Entries",
      formattedDate,
      "Time"
    );

    // Get all the documents in the "Time" collection
    const timeSnapshot = await getDocs(timeCollectionRef);

    let allPins = [];

    for (const timeDoc of timeSnapshot.docs) {
      const timeDocId = timeDoc.id;

      // Reference to the "Pins" subcollection within each "Time" document
      const pinsCollectionRef = collection(
        db,
        "users",
        userId,
        "Entries",
        formattedDate,
        "Time",
        timeDocId,
        "Pins"
      );

      // Get all the documents in the "Pins" subcollection
      const pinsSnapshot = await getDocs(pinsCollectionRef);

      // Map through the "Pins" documents and collect the IDs or data
      const pins = pinsSnapshot.docs
        .map((doc) => {
          const data = doc.data();
          if (data.latitude !== undefined && data.longitude !== undefined) {
            return {
              id: doc.id,
              ...data, // Include the data if you need more details than just the ID
            };
          } else {
            console.warn(
              `Pin document with ID ${doc.id} is missing coordinates.`
            );
            return null;
          }
        })
        .filter((pin) => pin !== null); // Filter out invalid pins

      allPins = allPins.concat(pins);
    }

    console.log("All Pins under 'Entries' and 'Time':", allPins);
    return allPins; // Return an array of all "Pins" documents
  } catch (error) {
    console.error("Error fetching pins collection from Firestore:", error);
    return []; // Return an empty array in case of error
  }
};

export const RenderPin = ({ userId }) => {
  const [pins, setPins] = useState([]); // State to store pins data
  const [selectedPin, setSelectedPin] = useState(null); // State for the selected pin

  // Fetch the pins when userId changes
  useEffect(() => {
    const loadPins = async () => {
      if (userId) {
        const fetchedPins = await fetchPinsFromFirestore(userId);
        setPins(fetchedPins); // Set the state with fetched pins
      }
    };

    loadPins(); // Call the function to load pins
  }, [userId]); // Dependency on userId

  // Handle marker press
  const handlePinPress = (pin) => {
    setSelectedPin(pin); // Set the selected pin
  };

  return (
    <View style={{ flex: 1 }}>
      {pins.map((pin) => (
        <Marker
          key={pin.id}
          coordinate={{
            latitude: pin.latitude,
            longitude: pin.longitude,
          }}
          onPress={() => handlePinPress(pin)} // Handle pin press
        >
          <View style={styles.circle} />
        </Marker>
      ))}

      {/* Modal to display pin details */}
      {selectedPin && (
        <Modal
          visible={!!selectedPin} // Ensure modal visibility based on selectedPin
          transparent={true}
          onRequestClose={() => setSelectedPin(null)} // Close modal on back press
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Pin Details</Text>

              <Text
                style={styles.closeButton}
                onPress={() => setSelectedPin(null)} // Close the modal
              >
                X
              </Text>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  circle: {
    width: 10,
    height: 10,
    borderRadius: 10,
    backgroundColor: "red", // Customize the pin appearance
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
    color: "blue",
    textAlign: "center",
  },
});
