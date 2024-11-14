import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { useRoute } from "@react-navigation/native";
import { getDocs, collection, setDoc, doc } from "firebase/firestore";
import { db } from "../data/firebaseConfig";
import { profileHandler } from "../components/CreateProfile";

export default function PlaylistProfile({ navigation }) {
  const route = useRoute();
  const { userId, timeId, entryId } = route.params; // Access the userId, timeId, and entryId passed via navigation

  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

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
    } catch (error) {
      console.error("Error fetching Playlist from Firestore:", error);
      setLoading(false);
    }
  };

  const createProfile = async () => {
    try {
      const entriesDocRef = doc(db, "users", userId);
      const entriesCollectionRef = collection(entriesDocRef, "Entries");
      const entriesDateDocRef = doc(entriesCollectionRef, entryId);
      const entriesTimeRef = collection(entriesDateDocRef, "Time");
      const entriesProfileRef = doc(entriesTimeRef, timeId);

      const profile = profileHandler(tracks);

      // Create or update a specific document in "Profile"

      await setDoc(entriesProfileRef, {
        mood: profile,
      });

      console.log("Profile created:", profile);
    } catch (error) {
      console.error("Error creating profile in Firestore:", error);
    }
  };

  // Use the userId, entryId, and timeId to fetch the playlist data when they change
  useEffect(() => {
    console.log("Id Changed");
    if (userId && entryId && timeId) {
      fetchPlaylistFromFirestore().then(() => {
        createProfile(); // Call createProfile after fetching tracks
      });
    }
  }, [userId, entryId, timeId]); // Dependencies: re-run when any of these change

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
