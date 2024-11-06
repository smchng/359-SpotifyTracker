import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { db } from "../data/firebaseConfig.js"; // Update with your Firebase config path
import { addDoc, collection, query, where, getDocs } from "firebase/firestore"; // Firebase Firestore functions

const MusicTimer = ({ userId }) => {
  const [isTimerActive, setIsTimerActive] = useState(false); // State to track if timer is active
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes countdown

  useEffect(() => {
    let timer;

    if (isTimerActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1); // Decrement time left
      }, 1000);
    } else if (timeLeft === 0) {
      // Timer finished
      setIsTimerActive(false);
      clearInterval(timer);
      // Handle collection creation here if needed
    }

    return () => clearInterval(timer); // Clear interval on component unmount
  }, [isTimerActive, timeLeft]);

  const handlePress = async () => {
    console.log("Pressed");
    if (!isTimerActive) {
      console.log("Timer active");
      setIsTimerActive(true); // Start the timer

      // Get current date and time
      const now = new Date();
      const formattedDate = now.toLocaleDateString("en-GB").replace(/\//g, "-"); // Format as dd-mm-yyyy
      const formattedTime = now
        .toLocaleTimeString("en-GB", { hour12: false })
        .replace(/:/g, ":"); // Format time as HH-mm-ss
      console.log("User ID:", userId);

      console.log(formattedDate, formattedTime);
      // Reference to the Entries collection under the user's ID
      const entriesDocRef = doc(db, "users", userId);
      console.log("Entries Doc Ref Created");
      const entriesCollectionRef = collection(entriesDocRef, "Entries");
      const entriesDateDocRef = doc(entriesCollectionRef, formattedDate);
      const entriesTimeRef = collection(entriesDateDocRef, "Time");
      const entriesTimeDocRef = doc(entriesTimeRef, formattedTime);
      const entriesPlaylistRef = collection(entriesTimeDocRef, "Playlist");
      const entriesPlaylistDocRef = doc(entriesPlaylistRef, formattedTime);

      try {
        // Step 1: Create the outermost document (Playlist document)
        await setDoc(entriesPlaylistDocRef, {
          createdAt: now,
        });

        console.log("Playlist document created");

        // Step 2: Create intermediate subcollections (optional) if needed
        // Firestore will automatically create subcollections when you add documents in them
        console.log("Document and subcollection created successfully");
      } catch (error) {
        console.error("Error creating document:", error);
      }
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

// Styling for the container and map
const styles = StyleSheet.create({
  timer: {
    fontWeight: "bold",
  },
  timerContainer: {
    top: 20,
    left: 85,
    justifyContent: "center",
    flex: 1,
    width: "70%", // Ensure the container takes up full width
    position: "absolute", // Position the track display absolutely
    alignItems: "center", // Horizontally center the timer
    justifyContent: "center", // Vertically center the timer
    zIndex: 1,
    backgroundColor: "#EBEFF2",
    padding: 15,
    borderRadius: 20,
    shadowColor: "#000", // Color of the shadow
    shadowOffset: { width: 5, height: 2 }, // Offset shadow to the right by 5px (horizontal)
    shadowOpacity: 0.25, // Shadow opacity (simulating rgba(0, 0, 0, 0.25))
    shadowRadius: 7, // Shadow blur radius (simulating 7px)
    elevation: 2, // For Android shadow effect
  },
});

export default MusicTimer;
