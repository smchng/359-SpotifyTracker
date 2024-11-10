import { useEffect, useState } from "react"; // Import useState and useEffect
import { getDocs, collection, getDoc, doc } from "firebase/firestore";
import { db } from "../data/firebaseConfig";
import { useUser } from "./UserAuth";
import { StyleSheet, View, Text } from "react-native";

const fetchEntriesFromFirestore = async (userId) => {
  try {
    // Reference to the "Entries" collection under the user's document
    const entriesCollectionRef = collection(db, "users", userId, "Entries");

    // Get all the documents in the "Entries" collection
    const entriesSnapshot = await getDocs(entriesCollectionRef);

    // Map through the documents and return only the document IDs
    const entryIds = entriesSnapshot.docs.map((doc) => doc.id);

    console.log("Entry IDs under 'Entries':", entryIds);
    return entryIds; // Return the document IDs (like "06-11-2024")
  } catch (error) {
    console.error(
      "Error fetching entries collection IDs from Firestore:",
      error
    );
    return []; // Return an empty array in case of error
  }
};

export default function EntriesList() {
  const [entries, setEntries] = useState([]); // Initialize state for entries
  const { userId } = useUser(); // Get the userId from the context

  // Fetch the entries when userId changes
  useEffect(() => {
    const loadEntries = async () => {
      if (userId) {
        const fetchedEntries = await fetchEntriesFromFirestore(userId);
        setEntries(fetchedEntries); // Set the state with fetched entries
        console.log(entries);
      }
    };

    loadEntries(); // Call the function to load entries
  }, [userId]); // Dependency on userId

  return (
    <View style={styles.container}>
      {entries && entries.length > 0 ? (
        entries.map((entry) => (
          <View key={entry} style={styles.entry}>
            <Text style={styles.entryTitle}>{entry}</Text>
            {/* Check the fields that are part of your entry */}
          </View>
        ))
      ) : (
        <Text>No entries available.</Text> // Message when no entries are found
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  entry: {
    marginBottom: 10,
    backgroundColor: "#EBEFF2",
    padding: 15,
    borderRadius: 15,
    shadowColor: "#000", // Color of the shadow
    shadowOffset: { width: 5, height: 2 }, // Offset shadow to the right by 5px (horizontal)
    shadowOpacity: 0.25, // Shadow opacity (simulating rgba(0, 0, 0, 0.25))
    shadowRadius: 7, // Shadow blur radius (simulating 7px)
    elevation: 2, // For Android shadow effect
  },
  entryTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  entryDescription: {
    fontSize: 14,
    color: "gray",
  },
});
