import React, { useState, createContext, useContext, useEffect } from "react";
import { Button } from "react-native";
import { doc, setDoc, collection, addDoc } from "firebase/firestore";
import { db } from "../data/firebaseConfig.js"; // Update with your Firebase config path

// Create a context to hold the timer state
const TimerContext = createContext();

export const useTimer = () => {
  return useContext(TimerContext);
};

export const MusicTimerProvider = ({ children }) => {
  const [isTimerActive, setIsTimerActive] = useState(false); // State to track if timer is active
  const [timeLeft, setTimeLeft] = useState(30 * 60);

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
      // Handle collection creation here
    }

    return () => clearInterval(timer); // Clear interval on component unmount
  }, [isTimerActive, timeLeft]);

  return (
    <TimerContext.Provider
      value={{ isTimerActive, setIsTimerActive, timeLeft }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export const MusicTimer = () => {
  const { isTimerActive, setIsTimerActive, timeLeft } = useTimer();

  const handlePress = async () => {
    if (!isTimerActive) {
      setIsTimerActive(true); // Start the timer
      // Get current date and time
      const now = new Date();
      // Format the date to YYYY-MM-DD and time to HH-MM
      const formattedDate = now.toISOString().split("T")[0]; // Get YYYY-MM-DD
      const hours = String(now.getHours()).padStart(2, "0"); // Get HH
      const minutes = String(now.getMinutes()).padStart(2, "0"); // Get MM
      const newPlaylistCollection = `Playlist_${formattedDate}_${hours}-${minutes}`; // Unique collection name
      const newPinsCollection = `Pin_${formattedDate}_${hours}-${minutes}`;

      // Create new playlist document
      const docPlaylistRef = await addDoc(
        collection(db, newPlaylistCollection),
        {}
      );
      const profileCollectionRef = collection(docPlaylistRef, "profile"); // Reference to profile subcollection
      const docPinRef = await addDoc(collection(db, newPinsCollection), {});

      console.log("Created playlist document:", docPlaylistRef.id);
      console.log("Created pins document:", docPinRef.id);
    }
  };

  const formatTimeLeft = (seconds) => {
    const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${minutes}:${secs}`;
  };

  return (
    <Button
      title={formatTimeLeft(timeLeft)}
      onPress={handlePress}
      disabled={isTimerActive}
    />
  );
};
