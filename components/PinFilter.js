import { collection, doc, getDocs } from "firebase/firestore";
import { db } from "../data/firebaseConfig"; // Adjust to your Firebase config
import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Combined function to fetch all entries for a user and check for Pins within Time documents
export const fetchEntriesWithPinsForUser = async (userId) => {
  try {
    // Reference to the "Entries" collection for the given user
    const entriesCollectionRef = collection(db, "users", userId, "Entries");
    const entriesSnapshot = await getDocs(entriesCollectionRef);

    const entriesWithPins = [];

    // Loop through each entry document
    for (const entryDoc of entriesSnapshot.docs) {
      const entryId = entryDoc.id;

      // Reference to the "Time" collection within the current entry
      const timeCollectionRef = collection(
        db,
        "users",
        userId,
        "Entries",
        entryId,
        "Time"
      );
      const timeSnapshot = await getDocs(timeCollectionRef);

      // Check each Time document for Pins
      for (const timeDoc of timeSnapshot.docs) {
        const timeId = timeDoc.id;

        // Reference to the "Pins" collection within the current Time document
        const pinsCollectionRef = collection(
          db,
          "users",
          userId,
          "Entries",
          entryId,
          "Time",
          timeId,
          "Pins"
        );
        const pinsSnapshot = await getDocs(pinsCollectionRef);

        if (!pinsSnapshot.empty) {
          // If any Time document has Pins, add the Entry ID to the result
          entriesWithPins.push(entryId);
          break; // No need to check further Time documents within this entry
        }
      }
    }

    return entriesWithPins; // Return a list of Entry IDs that have Pins
  } catch (error) {
    console.error("Error fetching entries with pins for user:", error);
    return [];
  }
};

export const EntryListWithPins = ({ userId, setSelectedEntry }) => {
  const [entriesWithPins, setEntriesWithPins] = useState([]);
  const [selectedEntry, setSelectedEntryState] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false); // State for toggling visibility

  useEffect(() => {
    const loadEntriesWithPins = async () => {
      const result = await fetchEntriesWithPinsForUser(userId);
      setEntriesWithPins(result);
    };

    loadEntriesWithPins();
  }, [userId, isExpanded]);

  // Toggle the visibility of the list
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleEntryPress = async (entryId) => {
    setSelectedEntryState(entryId); // Update the local selected entry state
    setSelectedEntry(entryId); // Pass the new selected entry to the parent component

    setIsExpanded(false);

    try {
      // Store the selected entry in AsyncStorage
      await AsyncStorage.setItem("PinEntry", entryId);
      console.log("Entry stored successfully:", entryId);
    } catch (error) {
      console.error("Error storing entry in AsyncStorage:", error);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleEntryPress(item)}
      style={styles.entryItem}
    >
      <Text style={styles.entryId}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, isExpanded && styles.expandedContainer]}>
      {/* Button to expand/collapse */}
      <TouchableOpacity onPress={toggleExpand} style={styles.button}>
        <Text style={styles.buttonText}>
          {isExpanded ? "Hide" : selectedEntry ? `${selectedEntry}` : "Pins"}
        </Text>
      </TouchableOpacity>

      {/* Conditionally render the FlatList based on isExpanded state */}
      {isExpanded && (
        <FlatList
          data={entriesWithPins}
          renderItem={renderItem}
          keyExtractor={(entry) => entry}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 40,
    paddingVertical: 5,
    position: "absolute",
    top: 80,
    right: 25,
    zIndex: 10,
    backgroundColor: "#EBEFF2",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000", // Color of the shadow
    shadowOffset: { width: 5, height: 2 }, // Offset shadow to the right by 5px (horizontal)
    shadowOpacity: 0.25, // Shadow opacity (simulating rgba(0, 0, 0, 0.25))
    shadowRadius: 7, // Shadow blur radius (simulating 7px)
    elevation: 2, // For Android shadow effect
  },
  expandedContainer: {
    paddingVertical: 10, // Increase padding when expanded
    paddingHorizontal: 20,
  },
  buttonText: {
    textAlign: "right",
  },
  entryItem: {},
  entryId: {
    fontSize: 13,
    textAlign: "right",
    paddingTop: 10,
  },
});

export default EntryListWithPins;
