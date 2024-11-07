import { useEffect, useState } from "react"; // Import useState and useEffect
import { collection, getDocs } from "firebase/firestore";
import { db } from "../data/firebaseConfig";
import { useUser } from "./UserAuth";
import { StyleSheet, View, Text } from "react-native";

// Fetch entries from Firestore based on the userId
const fetchEntriesFromFirestore = async (userId) => {
  try {
    // Get all documents in the "Entries" collection
    const entriesSnapshot = await getDocs(
      collection(db, "users", userId, "Entries")
    );

    // Map through the documents and return only the document IDs (titles)
    const entries = entriesSnapshot.docs.map((doc) => {
      id: doc.id;
    });
    console.log("Entries:", entries);
    return entries;
  } catch (error) {
    console.error("Error fetching entries from Firestore:", error);
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
          <View key={entry.id} style={styles.entry}>
            <Text style={styles.entryTitle}>{`Entry ID: ${entry.id}`}</Text>
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
