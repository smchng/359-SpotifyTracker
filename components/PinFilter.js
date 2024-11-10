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

// Function to fetch Pins for a specific Time document
const fetchPinsForTime = async (userId, entryId, timeId) => {
  try {
    // Reference to the "Pins" collection inside the "Time" document
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
      // Return true if there are Pins
      return true;
    }
    return false; // Return false if no Pins exist
  } catch (error) {
    console.error("Error fetching pins for time:", error);
    return false;
  }
};

// Function to check if any Time documents within an Entry have Pins
const fetchEntriesWithPins = async (userId, entryId) => {
  try {
    // Reference to the "Time" collection within the given entry
    const timeCollectionRef = collection(
      db,
      "users",
      userId,
      "Entries",
      entryId,
      "Time"
    );
    const timeSnapshot = await getDocs(timeCollectionRef);

    for (const timeDoc of timeSnapshot.docs) {
      const timeId = timeDoc.id;
      const hasPins = await fetchPinsForTime(userId, entryId, timeId);

      // If any Time document has Pins, return the Entry ID
      if (hasPins) {
        return entryId; // Found Pins, return the Entry ID
      }
    }
    return null; // No Pins found in any Time document
  } catch (error) {
    console.error("Error fetching Time documents for entry:", error);
    return null;
  }
};

// Function to fetch all entries for a user, and return only those with Pins
const fetchEntriesWithPinsForUser = async (userId) => {
  try {
    // Reference to the "Entries" collection
    const entriesCollectionRef = collection(db, "users", userId, "Entries");
    const entriesSnapshot = await getDocs(entriesCollectionRef);

    const entriesWithPins = [];

    for (const entryDoc of entriesSnapshot.docs) {
      const entryId = entryDoc.id;
      const entryWithPins = await fetchEntriesWithPins(userId, entryId);

      // If there are Pins, add the Entry ID to the list
      if (entryWithPins) {
        entriesWithPins.push(entryWithPins);
      }
    }

    return entriesWithPins; // Return a list of Entry IDs that have Pins
  } catch (error) {
    console.error("Error fetching entries with pins for user:", error);
    return [];
  }
};

export const EntryListWithPins = ({ userId }) => {
  const [entriesWithPins, setEntriesWithPins] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false); // State for toggling visibility

  useEffect(() => {
    const loadEntriesWithPins = async () => {
      const result = await fetchEntriesWithPinsForUser(userId);
      setEntriesWithPins(result);
    };

    loadEntriesWithPins();
  }, [userId]);

  // Toggle the visibility of the list
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleEntryPress = (entryId) => {
    setSelectedEntry(entryId); // Update selected entry
    setIsExpanded(false); // Collapse the list when an entry is selected
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
    <View style={styles.container}>
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
    borderRadius: 20,
    shadowColor: "#000", // Color of the shadow
    shadowOffset: { width: 5, height: 2 }, // Offset shadow to the right by 5px (horizontal)
    shadowOpacity: 0.25, // Shadow opacity (simulating rgba(0, 0, 0, 0.25))
    shadowRadius: 7, // Shadow blur radius (simulating 7px)
    elevation: 2, // For Android shadow effect
  },
  expandedContainer: {
    paddingVertical: 20, // Increase padding when expanded
    paddingHorizontal: 20,
  },
  buttonText: {
    textAlign: "right",
    marginBottom: 5,
  },
  entryItem: {},
  entryId: {
    fontSize: 13,
    textAlign: "right",
    paddingBottom: 10,
  },
});

export default EntryListWithPins;
