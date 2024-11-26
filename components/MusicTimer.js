import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
} from "react-native";
import { db } from "../data/firebaseConfig.js"; // Update with your Firebase config path
import { doc, setDoc, collection } from "firebase/firestore"; // Firebase Firestore functions
import { StorePin } from "./DropPins.js";
import { showTrack, showTrackAF } from "./CurrentTrack.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationButton } from "../components/UI/buttons";

const MusicTimer = ({ userId, navigation }) => {
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30-minute countdown
  const [lastTrackId, setLastTrackId] = useState(null);
  const [formattedDate, setFormattedDate] = useState("");
  const [formattedTime, setFormattedTime] = useState("");
  const pollingIntervalRef = useRef(null);
  const timerRef = useRef(null);
  const [isModalVisible, setIsModalVisible] = useState(true);
  let pollingInterval;
  useEffect(() => {
    if (isTimerActive) {
      AsyncStorage.setItem("isTimerActive", "true");
      AsyncStorage.setItem("timeLeft", timeLeft.toString());
    } else {
      AsyncStorage.setItem("isTimerActive", "false");
    }
  }, [isTimerActive, timeLeft]);
  // Load the timer state from AsyncStorage when the component mounts
  useEffect(() => {
    const loadTimerState = async () => {
      try {
        const storedIsTimerActive = await AsyncStorage.getItem("isTimerActive");
        const storedTimeLeft = await AsyncStorage.getItem("timeLeft");
        console.log("timer", storedIsTimerActive);
        if (storedIsTimerActive === "true") {
          setIsTimerActive(true);
          setTimeLeft(parseInt(storedTimeLeft, 10));
        } else {
          setIsTimerActive(false);
          setTimeLeft(30 * 60); // Reset timeLeft if the session is not active
        }
      } catch (error) {
        console.error("Error loading timer state from AsyncStorage:", error);
      }
    };

    loadTimerState();

    // Clear interval when component unmounts
    return () => {
      clearInterval(pollingIntervalRef.current);
      clearInterval(timerRef.current);
    };
  }, []);

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
    if (isTimerActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          const newTime = prevTime - 1;
          AsyncStorage.setItem("timeLeft", newTime.toString()); // Save the timeLeft in AsyncStorage
          return newTime;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerActive(false);
      clearInterval(timerRef.current);
      clearInterval(pollingIntervalRef.current); // Stop polling when the timer ends

      console.log("Timer finished. Stopping track storage.");
    }

    return () => clearInterval(timerRef.current);
  }, [isTimerActive, timeLeft]);

  const handlePress = () => {
    console.log("Pressed");
    if (isTimerActive) {
      // Ask if the user wants to end the session
      Alert.alert(
        "End Session?",
        "Do you want to end the current session?",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: () => {
              AsyncStorage.setItem("timeLeft", 30 * 60);
              AsyncStorage.setItem("isTimerActive", false);
              // Stop the timer and polling
              setIsTimerActive(false);
              clearInterval(timerRef.current);
              clearInterval(pollingIntervalRef.current);

              setTimeLeft(30 * 60); // Reset timer to 30 minutes

              console.log("Session ended and timer reset");
            },
          },
        ],
        { cancelable: false }
      );
    } else {
      console.log("Timer active");
      setIsTimerActive(true);

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
      <TouchableOpacity onPress={handlePress}>
        {isTimerActive ? (
          <Text style={styles.timer}>{formatTimeLeft(timeLeft)}</Text>
        ) : (
          <Text style={styles.timer}>START SESSION</Text>
        )}
      </TouchableOpacity>
      {timeLeft === 0 && isModalVisible && (
        <Modal transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                A new profile was generated!
              </Text>
              <NavigationButton
                text="Go"
                page="ProfileStorage"
                navigation={navigation}
                buttonStyle={styles.loginButton}
                textColor="#FFFFFF"
              />
              <Text
                style={styles.closeButton}
                onPress={() => setIsModalVisible(false)} // Close the modal
              >
                Close
              </Text>
            </View>
          </View>
        </Modal>
      )}
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
    const now = new Date();
    const time = now.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    // Create the document for the new track
    await setDoc(entriesPlaylistDocRef, {
      createdAt: time,
      artist: track.artist,
      title: track.title,
      danceability: af.danceability,
      energy: af.energy,
      loudness: af.loudness,
      acousticness: af.acousticness,
      tempo: af.tempo,
      valence: af.valence,
    });

    console.log("New track stored successfully");
  } catch (error) {
    console.error("Error storing new track:", error);
  }
};

// Styling for the timer container
const styles = StyleSheet.create({
  timer: {
    //fontWeight: "bold",
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

  loginButton: {
    backgroundColor: "#303030",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: 200,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 12,
    color: "grey",
    textAlign: "center",
    marginBottom: 10,
  },

  closeButton: {
    marginTop: 20,
    color: "blue",
    textAlign: "center",
  },
});

export default MusicTimer;
