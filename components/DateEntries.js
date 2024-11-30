import { useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../data/firebaseConfig";
import { useUser } from "./UserAuth";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";

import Angry1 from "../assets/emojis/angry1.svg";
import Angry2 from "../assets/emojis/angry2.svg";
import Angry3 from "../assets/emojis/angry3.svg";
import Chilling1 from "../assets/emojis/chilling1.svg";
import Chilling2 from "../assets/emojis/chilling2.svg";
import Chilling3 from "../assets/emojis/chilling3.svg";
import Class1 from "../assets/emojis/class1.svg";
import Class2 from "../assets/emojis/class2.svg";
import Class3 from "../assets/emojis/class3.svg";
import Everywhere1 from "../assets/emojis/everywhere1.svg";
import Everywhere2 from "../assets/emojis/everywhere2.svg";
import Everywhere3 from "../assets/emojis/everywhere3.svg";
import Freak1 from "../assets/emojis/freak1.svg";
import Freak2 from "../assets/emojis/freak2.svg";
import Freak3 from "../assets/emojis/freak3.svg";
import Happy1 from "../assets/emojis/happy1.svg";
import Happy2 from "../assets/emojis/happy2.svg";
import Happy3 from "../assets/emojis/happy3.svg";
import Late1 from "../assets/emojis/late1.svg";
import Late2 from "../assets/emojis/late2.svg";
import Late3 from "../assets/emojis/late3.svg";
import Sad1 from "../assets/emojis/sad1.svg";
import Sad2 from "../assets/emojis/sad2.svg";
import Sad3 from "../assets/emojis/sad3.svg";
import Sleepy1 from "../assets/emojis/sleep1.svg";
import Sleepy2 from "../assets/emojis/sleepy2.svg";
import Sleepy3 from "../assets/emojis/sleepy3.svg";
import Empty from "../assets/svg/WelcomeIcon.svg";
const emojiComponents = {
  Happy1: Happy1,
  Happy2: Happy2,
  Happy3: Happy3,
  Sad1: Sad1,
  Sad2: Sad2,
  Sad3: Sad3,
  Freak1: Freak1,
  Freak2: Freak2,
  Freak3: Freak3,
  Chilling1: Chilling1,
  Chilling2: Chilling2,
  Chilling3: Chilling3,
  Angry1: Angry1,
  Angry2: Angry2,
  Angry3: Angry3,
  Everywhere1: Everywhere1,
  Everywhere2: Everywhere2,
  Everywhere3: Everywhere3,
  Sleepy1: Sleepy1,
  Sleepy2: Sleepy2,
  Sleepy3: Sleepy3,
  LateNight1: Late1,
  LateNight2: Late2,
  LateNight3: Late3,
  Classical1: Class1,
  Classical2: Class2,
  Classical3: Class3,
};

// Fetches how many different date entries in firestore
const fetchEntriesFromFirestore = async (userId) => {
  try {
    const entriesCollectionRef = collection(db, "users", userId, "Entries");
    const entriesSnapshot = await getDocs(entriesCollectionRef);
    const entryIds = entriesSnapshot.docs.map((doc) => doc.id);
    return entryIds;
  } catch (error) {
    console.error(
      "Error fetching entries collection IDs from Firestore:",
      error
    );
    return [];
  }
};

// Fetches the specific time entries depedning on the date selected
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

// Displays all the date entries available
export default function EntriesList({ navigation }) {
  const [entries, setEntries] = useState([]);
  const { userId } = useUser();
  const [expandedEntry, setExpandedEntry] = useState(null);
  const [timeDocs, setTimeDocs] = useState([]);

  // Loads the entries in order
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

  // Expands the entries list
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
          {timeDocs.map((timeDoc) => {
            // Dynamically assign the emoji based on `timeDoc.emoji`
            let EmojiComponent = Empty;
            if (timeDoc.emoji && emojiComponents[timeDoc.emoji]) {
              EmojiComponent = emojiComponents[timeDoc.emoji];
            }

            return (
              <TouchableOpacity
                key={timeDoc.id}
                style={styles.timeDoc}
                onPress={() => handlePage(timeDoc.id, entry)}
              >
                <View style={styles.emojiContainer}>
                  {EmojiComponent && <EmojiComponent width={25} height={25} />}
                  <Text
                    style={[
                      styles.profile,
                      !timeDoc.mood && { fontWeight: "bold" },
                    ]}
                  >
                    {timeDoc.mood ? timeDoc.mood : "New!"}
                  </Text>
                </View>

                <Text style={styles.timeDocTitle}>{timeDoc.id}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.wrapper}>
      <View>
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    marginTop: 20,
  },

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
  emojiContainer: {
    flexDirection: "row",
    gap: 6,

    alignItems: "center",
  },
  timeDocsContainer: {
    paddingTop: 10,
  },
  timeDoc: {
    marginBottom: 10,
    backgroundColor: "#F0F4F8",
    padding: 15,
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
