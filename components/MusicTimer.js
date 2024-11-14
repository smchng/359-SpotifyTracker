import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { db } from "../data/firebaseConfig.js"; // Update with your Firebase config path
import { doc, setDoc, collection } from "firebase/firestore"; // Firebase Firestore functions
import { StorePin } from "./DropPins.js";
import { showTrack, showTrackAF } from "./CurrentTrack.js";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MusicTimer = ({ userId }) => {
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30-minute countdown
  const [lastTrackId, setLastTrackId] = useState(null);
  const [formattedDate, setFormattedDate] = useState("");
  const [formattedTime, setFormattedTime] = useState("");

  let pollingInterval;

  useEffect(() => {
    if (isTimerActive) {
      // Start polling for new tracks when the timer starts
      pollingInterval = setInterval(async () => {
        const currentTrack = await showTrack();
        const currectTrackAF = await showTrackAF();
        if (currentTrack && currentTrack.id !== lastTrackId) {
          setLastTrackId(currentTrack.id);
          console.log("New track detected:", currentTrack);

          await storeTrack(
            userId,
            formattedDate,
            formattedTime,
            currentTrack,
            currectTrackAF
          );
          await StorePin(userId, formattedDate, formattedTime);
          AsyncStorage.setItem("PinEntry", formattedDate)
            .then(() => {
              console.log(
                "Selected entry updated to current date:",
                formattedDate
              );
            })
            .catch((error) => {
              console.error("Error updating selected entry:", error);
            });
        }
      }, 5000); // Poll every 5 seconds

      // Clear polling interval when time reaches zero or component unmounts
      return () => clearInterval(pollingInterval);
    }
  }, [isTimerActive, lastTrackId, formattedDate, formattedTime]);

  useEffect(() => {
    let timer;

    if (isTimerActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1); // Decrement time left
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerActive(false);
      clearInterval(timer);
      clearInterval(pollingInterval); // Stop polling when the timer ends
      console.log("Timer finished. Stopping track storage.");
    }

    return () => clearInterval(timer); // Clear timer on component unmount
  }, [isTimerActive, timeLeft]);

  const handlePress = () => {
    console.log("Pressed");
    if (!isTimerActive) {
      console.log("Timer active");
      setIsTimerActive(true); // Start the timer

      // Set the date and time when the timer is started
      const now = new Date();
      setFormattedDate(now.toLocaleDateString("en-GB").replace(/\//g, "-"));
      setFormattedTime(
        now.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      );
    }
  };

  const formatTimeLeft = (seconds) => {
    const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${minutes}:${secs}`;
  };

  return (
    <View style={styles.timerContainer}>
      <TouchableOpacity onPress={handlePress} disabled={isTimerActive}>
        <Text style={styles.timer}>{formatTimeLeft(timeLeft)}</Text>
      </TouchableOpacity>
    </View>
  );
};

const storeTrack = async (userId, formattedDate, formattedTime, track, af) => {
  try {
    const entriesDocRef = doc(db, "users", userId);
    const entriesCollectionRef = collection(entriesDocRef, "Entries");
    const entriesDateDocRef = doc(entriesCollectionRef, formattedDate);
    const entriesTimeRef = collection(entriesDateDocRef, "Time");
    const entriesTimeDocRef = doc(entriesTimeRef, formattedTime);
    const entriesPlaylistRef = collection(entriesTimeDocRef, "Playlist");
    const entriesPlaylistDocRef = doc(entriesPlaylistRef, track.title);

    await setDoc(entriesDateDocRef, {
      placeholder: formattedDate,
    });

    // Create the document for the new track
    await setDoc(entriesPlaylistDocRef, {
      createdAt: new Date(),
      artist: track.artist,
      title: track.title,
      danceability: af.danceability,
      energy: af.energy,
      loudness: af.loudness,
      speechiness: af.speechiness,
      acousticness: af.acousticness,
      instrumentalness: af.instrumentalness,
      liveness: af.liveness,
      tempo: af.tempo,
    });

    console.log("New track stored successfully");
  } catch (error) {
    console.error("Error storing new track:", error);
  }
};

// Styling for the timer container
const styles = StyleSheet.create({
  timer: {
    fontWeight: "bold",
  },
  timerContainer: {
    top: 20,
    left: 85,
    justifyContent: "center",
    flex: 1,
    zIndex: 1,
    width: "70%",
    position: "absolute",
    alignItems: "center",
    backgroundColor: "#EBEFF2",
    padding: 15,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 5, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 7,
    elevation: 2,
  },
});

export default MusicTimer;
