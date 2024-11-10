import { useEffect, useState } from "react"; // Import useState and useEffect
import { getDocs, collection, getDoc, doc } from "firebase/firestore";
import { db } from "../data/firebaseConfig";
import { useUser } from "./UserAuth";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

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

const fetchTimeDocsForEntry = async (userId, entryId) => {
  try {
    const timeCollectionRef = collection(
      db,
      "users",
      userId,
      "Entries",
      entryId,
      "Time"
    );
    const timeSnapshot = await getDocs(timeCollectionRef);
    const timeDocs = timeSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log("Time documents for entry", entryId, timeDocs);
    return timeDocs;
  } catch (error) {
    console.error("Error fetching Time documents:", error);
    return [];
  }
};

const parseDateFromId = (id) => {
  const [day, month, year] = id.split("-"); // Split dd-mm-yyyy
  return new Date(`${month}-${day}-${year}`); // Create a Date object
};

export default function EntriesList() {
  const [entries, setEntries] = useState([]); // Initialize state for entries
  const { userId } = useUser(); // Get the userId from the context
  const [expandedEntry, setExpandedEntry] = useState(null); // Track which entry is expanded
  const [timeDocs, setTimeDocs] = useState([]); // State to hold Time documents for expanded entry

  // Fetch the entries when userId changes
  useEffect(() => {
    const loadEntries = async () => {
      if (userId) {
        const fetchedEntries = await fetchEntriesFromFirestore(userId);
        const sortedEntries = fetchedEntries.sort((a, b) => {
          const dateA = parseDateFromId(a); // Parse date from entry ID
          const dateB = parseDateFromId(b); // Parse date from entry ID
          return dateB - dateA; // Sort in descending order (newest first)
        });
        setEntries(fetchedEntries); // Set the state with fetched entries
      }
    };

    loadEntries(); // Call the function to load entries
  }, [userId]); // Dependency on userId

  const handleExpandEntry = async (entryId) => {
    if (expandedEntry === entryId) {
      // If the entry is already expanded, collapse it
      setExpandedEntry(null);
      setTimeDocs([]); // Clear time documents when collapsed
    } else {
      // If the entry is not expanded, expand it
      setExpandedEntry(entryId);
      const fetchedTimeDocs = await fetchTimeDocsForEntry(userId, entryId);
      setTimeDocs(fetchedTimeDocs); // Set Time documents
    }
  };

  return (
    <View style={styles.container}>
      {entries && entries.length > 0 ? (
        entries.map((entry) => (
          <View key={entry} style={styles.entry}>
            <TouchableOpacity onPress={() => handleExpandEntry(entry)}>
              <Text style={styles.entryTitle}>{entry}</Text>
            </TouchableOpacity>

            {/* Conditionally render the Time documents if entry is expanded */}
            {expandedEntry === entry && timeDocs.length > 0 && (
              <View style={styles.timeDocsContainer}>
                {timeDocs.map((timeDoc) => (
                  <View key={timeDoc.id} style={styles.timeDoc}>
                    <Text style={styles.timeDocTitle}>{timeDoc.id}</Text>
                    {/* You can render more details from the timeDoc here */}
                    <Text style={styles.timeDocDescription}>
                      {JSON.stringify(timeDoc)}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))
      ) : (
        <Text>No entries available.</Text>
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
  timeDocsContainer: {
    paddingTop: 10,
    paddingLeft: 10,
  },
  timeDoc: {
    marginBottom: 10,
    backgroundColor: "#F0F4F8",
    padding: 10,
    borderRadius: 10,
  },
  timeDocTitle: {
    fontWeight: "bold",
    fontSize: 14,
  },
  timeDocDescription: {
    fontSize: 12,
    color: "gray",
  },
});
