import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";
import { getDocs, collection, setDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../data/firebaseConfig";
import { profileHandler } from "../components/CreateProfile";

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

export default function PlaylistProfile({ navigation }) {
  const route = useRoute();
  const { userId, timeId, entryId } = route.params; // Access the userId, timeId, and entryId passed via navigation
  const [emoji, setEmoji] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [mood, setMood] = useState(null);

  // Fetch the playlist data from Firestore
  const fetchPlaylistFromFirestore = async () => {
    try {
      // Reference to the "Entries" collection under the user's document
      const playlistCollectionRef = collection(
        db,
        "users",
        userId,
        "Entries",
        entryId,
        "Time",
        timeId,
        "Playlist" // This is where your playlist documents are stored
      );

      // Fetch all the documents from the "Playlist" collection
      const playlistSnapshot = await getDocs(playlistCollectionRef);

      // Map the fetched documents to get data
      const playlistDocs = playlistSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(), // Spread the document data to access fields like track name, artists, etc.
      }));

      console.log("Fetched Playlists:", playlistDocs);
      setTracks(playlistDocs); // Set the tracks data to state

      return playlistDocs;
    } catch (error) {
      console.error("Error fetching Playlist from Firestore:", error);
    }
  };

  const fetchMoodFromFirestore = async () => {
    try {
      // Reference to a specific document under "Time"
      const moodDocRef = doc(
        db,
        "users",
        userId,
        "Entries",
        entryId,
        "Time",
        timeId
      );
      const moodSnapshot = await getDoc(moodDocRef);

      if (moodSnapshot.exists()) {
        const moodData = moodSnapshot.data();
        console.log("Fetched Mood Document:", moodData);
        setMood(moodData);
        return moodData;
      } else {
        console.log("No mood document found.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching Mood document from Firestore:", error);
    }
  };

  const createProfile = async () => {
    try {
      console.log(tracks);
      const profile = profileHandler(tracks);
      console.log("Profile from profileHandler:", profile); // Debugging profile creation
      if (profile) {
        const entriesDocRef = doc(db, "users", userId);
        const entriesCollectionRef = collection(entriesDocRef, "Entries");
        const entriesDateDocRef = doc(entriesCollectionRef, entryId);
        const entriesTimeRef = collection(entriesDateDocRef, "Time");
        const entriesProfileRef = doc(entriesTimeRef, timeId);
        const docSnapshot = await getDoc(entriesProfileRef);

        await setDoc(entriesProfileRef, {
          mood: profile.mood, // Make sure profile.mood exists
          emoji: profile.img, // Make sure profile.img exists
          tagline: profile.tagline,
        });
        console.log("Profile created:", profile);
      }
      fetchMoodFromFirestore();
    } catch (error) {
      console.error("Error creating profile in Firestore:", error);
    }
  };

  useEffect(() => {
    console.log("Id Changed");
    if (userId && entryId && timeId) {
      fetchPlaylistFromFirestore();
    }
  }, [userId, entryId, timeId]); // Dependencies: re-run when any of these change

  useEffect(() => {
    if (tracks.length > 0) {
      const entriesDocRef = doc(db, "users", userId);
      const entriesCollectionRef = collection(entriesDocRef, "Entries");
      const entriesDateDocRef = doc(entriesCollectionRef, entryId);
      const entriesTimeRef = collection(entriesDateDocRef, "Time");
      const entriesProfileRef = doc(entriesTimeRef, timeId);

      // Check if 'mood' field exists before calling createProfile
      const checkMoodExists = async () => {
        const docSnapshot = await getDoc(entriesProfileRef);
        if (docSnapshot.exists()) {
          const existingData = docSnapshot.data();
          if (existingData && existingData.mood) {
            console.log("Mood already exists, skipping profile creation.");
            return;
          }
        }
        createProfile(); // If no mood exists, proceed with profile creation
      };

      checkMoodExists(); // Call the function to check mood before creating the profile

      fetchMoodFromFirestore();

      const EmojiComponent = emojiComponents[mood.emoji] || Everywhere1;

      setEmoji(EmojiComponent);
    }
  }, [tracks, userId, entryId, timeId]); // Dependencies: call only when tracks, userId, entryId, or timeId change

  // Render item for FlatList
  const renderTrack = ({ item }) => (
    <View style={{ marginBottom: 10 }}>
      <Text style={{ fontWeight: "bold" }}>{item.title}</Text>
      <Text>{item.artist}</Text>
    </View>
  );

  return (
    <View style={{ padding: 10 }}>
      {mood && (
        <View>
          <View>{emoji && <emoji width={25} height={25} />}</View>
          <Text>Mood: {mood.mood}</Text>
          <Text>Message: {mood.tagline}</Text>
        </View>
      )}

      <View style={styles.container}>
        <Text>You listened to:</Text>
        <FlatList
          data={tracks} // Set the data to the tracks fetched from Firestore
          renderItem={renderTrack} // Use renderTrack to display each track
          keyExtractor={(item) => item.id} // Use track id as the key
          style={styles.flatList}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    height: " 60%", // Set height to 40vh for the container
  },
  flatList: {
    height: "100%", // Make FlatList occupy full height of the container
  },
  flatListContent: {
    paddingBottom: 10, // Optional: adds padding to the bottom of the FlatList
  },
});
