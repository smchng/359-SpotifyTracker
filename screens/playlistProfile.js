import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
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
import Sleep1 from "../assets/emojis/sleep1.svg";
import Sleepy2 from "../assets/emojis/sleepy2.svg";
import Sleepy3 from "../assets/emojis/sleepy3.svg";

export default function PlaylistProfile({ navigation }) {
  const route = useRoute();
  const { userId, timeId, entryId } = route.params; // Access the userId, timeId, and entryId passed via navigation

  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mood, setMood] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState(null);

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
      setLoading(false); // Stop loading once data is fetched
      return playlistDocs;
    } catch (error) {
      console.error("Error fetching Playlist from Firestore:", error);
      setLoading(false);
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
          string: profile.tagline,
        });
        setMood(profile); // Set mood after saving profile
        console.log("Profile created:", profile);
      }
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
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <>
          <Text>You listened to:</Text>
          <FlatList
            data={tracks} // Set the data to the tracks fetched from Firestore
            renderItem={renderTrack} // Use renderTrack to display each track
            keyExtractor={(item) => item.id} // Use track id as the key
          />
        </>
      )}
    </View>
  );
}
