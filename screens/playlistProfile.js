import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { useRoute } from "@react-navigation/native";
import { getDocs, collection, setDoc, doc } from "firebase/firestore";
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
    } catch (error) {
      console.error("Error fetching Playlist from Firestore:", error);
      setLoading(false);
    }
  };

  const createProfile = async () => {
    try {
      const profile = profileHandler(tracks);
      console.log("Profile from profileHandler:", profile); // Debugging profile creation
      if (profile) {
        const entriesDocRef = doc(db, "users", userId);
        const entriesCollectionRef = collection(entriesDocRef, "Entries");
        const entriesDateDocRef = doc(entriesCollectionRef, entryId);
        const entriesTimeRef = collection(entriesDateDocRef, "Time");
        const entriesProfileRef = doc(entriesTimeRef, timeId);

        await setDoc(entriesProfileRef, {
          mood: profile,
        });
        setMood(profile); // Set mood after saving profile
        console.log("Profile created:", profile);
      }
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

  useEffect(() => {
    if (mood) {
      // Find the profile category based on the mood
      const profileCategory = profileDetails.find((profile) => profile[mood]);
      if (profileCategory) {
        const emojis = profileCategory[mood];
        // Randomly select one emoji
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        setSelectedProfile(randomEmoji[Object.keys(randomEmoji)[0]]);
      }
    }
  }, [mood]);

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
      <View>
        {selectedProfile && (
          <View>
            {/* <img
              src={`path/to/emojis/${selectedProfile.img}.svg`}
              alt={selectedProfile.string}
            /> */}
            <Text>{selectedProfile.string}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const profileDetails = [
  {
    Happy: [
      {
        happy1: {
          img: "Happy1",
          string: "Happy string1",
        },
      },
      {
        happy2: {
          img: "Happy2",
          string: "Happy string2",
        },
      },
      {
        happy3: {
          img: "Happy3",
          string: "Happy string3",
        },
      },
    ],
  },
  {
    Sad: [
      {
        sad1: {
          img: "Sad1",
          string: "Sad string1",
        },
      },
      {
        sad2: {
          img: "Sad2",
          string: "Sad string2",
        },
      },
      {
        sad3: {
          img: "Sad3",
          string: "Sad string3",
        },
      },
    ],
  },
  {
    Freak: [
      {
        freak1: {
          img: "Freak1",
          string: "Freak string1",
        },
      },
      {
        freak2: {
          img: "Freak2",
          string: "Freak string2",
        },
      },
      {
        freak3: {
          img: "Freak3",
          string: "Freak string3",
        },
      },
    ],
  },
  {
    Chilling: [
      {
        chilling1: {
          img: "Chilling1",
          string: "Chilling string1",
        },
      },
      {
        chilling2: {
          img: "Chilling2",
          string: "Chilling string2",
        },
      },
      {
        chilling3: {
          img: "Chilling3",
          string: "Chilling string3",
        },
      },
    ],
  },
  {
    Angry: [
      {
        angry1: {
          img: "Angry1",
          string: "Angry string1",
        },
      },
      {
        angry2: {
          img: "Angry2",
          string: "Angry string2",
        },
      },
      {
        angry3: {
          img: "Angry3",
          string: "Angry string3",
        },
      },
    ],
  },
  {
    Everywhere: [
      {
        everywhere1: {
          img: "Everywhere1",
          string: "Everywhere string1",
        },
      },
      {
        everywhere2: {
          img: "Everywhere2",
          string: "Everywhere string2",
        },
      },
      {
        everywhere3: {
          img: "Everywhere3",
          string: "Everywhere string3",
        },
      },
    ],
  },
  {
    Sleepy: [
      {
        sleepy1: {
          img: "Sleepy1",
          string: "Sleepy string1",
        },
      },
      {
        sleepy2: {
          img: "Sleepy2",
          string: "Sleepy string2",
        },
      },
      {
        sleepy3: {
          img: "Sleepy3",
          string: "Sleepy string3",
        },
      },
    ],
  },
  {
    "Late Night Feels": [
      {
        late1: {
          img: "LateNight1",
          string: "Late Night Feels string1",
        },
      },
      {
        late2: {
          img: "LateNight2",
          string: "Late Night Feels string2",
        },
      },
      {
        late3: {
          img: "LateNight3",
          string: "Late Night Feels string3",
        },
      },
    ],
  },
  {
    "Classical Connoisseur": [
      {
        classical1: {
          img: "Classical1",
          string: "Classical string1",
        },
      },
      {
        classical2: {
          img: "Classical2",
          string: "Classical string2",
        },
      },
      {
        classical3: {
          img: "Classical3",
          string: "Classical string3",
        },
      },
    ],
  },
];
