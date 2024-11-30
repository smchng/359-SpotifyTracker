import { useEffect, useState } from "react"; 
import { getDocs, collection } from "firebase/firestore";
import { db } from "../data/firebaseConfig";
import { useUser } from "./UserAuth";
import { StyleSheet, View, Text, TouchableOpacity, FlatList, ScrollView } from "react-native";

const fetchEntriesFromFirestore = async (userId) => {
  try {  
    const entriesCollectionRef = collection(db, "users", userId, "Entries");
    const entriesSnapshot = await getDocs(entriesCollectionRef);
    const entryIds = entriesSnapshot.docs.map((doc) => doc.id);
    return entryIds;
  } catch (error) {
    console.error("Error fetching entries collection IDs from Firestore:", error);
    return [];
  }
};

const fetchTimeDocsForEntry = async (userId, entryId) => {
  try {
    const timeCollectionRef = collection(db, "users", userId, "Entries", entryId, "Time");
    const timeSnapshot = await getDocs(timeCollectionRef);
    const timeDocs = timeSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return timeDocs;
  } catch (error) {
    console.error("Error fetching Time documents:", error);
    return [];
  }
};

const parseDateFromId = (id) => {
  const [day, month, year] = id.split("-");
  return new Date(`${month}-${day}-${year}`);
};

export default function EntriesList({ navigation }) {
  const [entries, setEntries] = useState([]);
  const { userId } = useUser();
  const [expandedEntry, setExpandedEntry] = useState(null);
  const [timeDocs, setTimeDocs] = useState([]);

  useEffect(() => {
    const loadEntries = async () => {
      if (userId) {
        const fetchedEntries = await fetchEntriesFromFirestore(userId);
        const sortedEntries = fetchedEntries.sort((a, b) => {
          const dateA = parseDateFromId(a);
          const dateB = parseDateFromId(b);
          return dateB - dateA;
        });
        setEntries(sortedEntries);
      }
    };

    loadEntries();
  }, [userId]);

  const handleExpandEntry = async (entryId) => {
    if (expandedEntry === entryId) {
      setExpandedEntry(null);
      setTimeDocs([]);
    } else {
      setExpandedEntry(entryId);
      const fetchedTimeDocs = await fetchTimeDocsForEntry(userId, entryId);
      setTimeDocs(fetchedTimeDocs);
    }
  };

  const handlePage = (timeId, entryId) => {
    navigation.navigate("PlaylistProfile", {
      timeId: timeId,
      entryId: entryId,
      userId: userId,
    });
  };

  const renderItem = ({ item: entry }) => (
    <View style={styles.entry}>
      <TouchableOpacity onPress={() => handleExpandEntry(entry)}>
        <Text style={styles.entryTitle}>{entry}</Text>
      </TouchableOpacity>

      {expandedEntry === entry && timeDocs.length > 0 && (
        <View style={styles.timeDocsContainer}>
          {timeDocs.map((timeDoc) => (
            <TouchableOpacity
              key={timeDoc.id}
              style={styles.timeDoc}
              onPress={() => handlePage(timeDoc.id, entry)}
            >
              <Text
                style={[styles.profile, !timeDoc.mood && { fontWeight: "bold" }]}
              >
                {timeDoc.mood ? timeDoc.mood : "New!"}
              </Text>
              <Text style={styles.timeDocTitle}>{timeDoc.id}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.wrapper}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.container}>
          {entries.length > 0 ? (
            <FlatList
              data={entries}
              renderItem={renderItem}
              keyExtractor={(item) => item}
              extraData={entries} // Re-render when entries change
              keyboardShouldPersistTaps="handled" // Ensure tap on list doesn't dismiss keyboard
            />
          ) : (
            <Text>No entries available.</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    marginTop: 20, 
  },
  scrollViewContent: {
    //paddingBottom: 50, // Optional: Add space at the bottom of the ScrollView content
  },

  // This ensures the container takes up the full width and respects the padding
  container: {
    width: "100%", 
    paddingBottom: 10, 
  },

  entry: {
    marginBottom: 10,
    backgroundColor: "#EBEFF2",
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 2,
    width: "90%", // Adjusts width of each entry
    alignSelf: "center", // Centers the entry
  },

  entryTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },

  timeDocsContainer: {
    paddingTop: 10,
    paddingLeft: 10,
  },
  timeDoc: {
    marginBottom: 10,
    backgroundColor: "#F0F4F8",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 5, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 7,
    elevation: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%", // Ensures each time document is full width
  },
  timeDocTitle: {
    fontSize: 12,
    color: "grey",
  },
  profile: {
    fontSize: 14,
    color: "#333",
  },
});