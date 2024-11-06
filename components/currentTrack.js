// Polls and renders the currently playing track

import { useState, useEffect } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { setAccessToken, getAccessToken } from "../ApiAccess/TokenStorage.js"; // Ensure these functions are correctly implemented
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, setDoc, collection } from "firebase/firestore";
import { db } from "../data/firebaseConfig.js";

export const CurrentlyPlayingTrack = () => {
  const [track, setTrack] = useState(null);
  const accessToken = getAccessToken(); // Retrieve the stored access token

  useEffect(() => {
    // Start polling for track changes when the component mounts
    const intervalId = startPollingForTrackChanges(accessToken, setTrack);

    // Initial fetch to set the current track
    const initialFetch = async () => {
      const storedTrack = await showTrack();
      if (storedTrack) {
        setTrack(storedTrack);
      }
    };
    initialFetch();

    // Cleanup on component unmount
    return () => clearInterval(intervalId); // Clear the interval on unmount
  }, [accessToken]);

  return (
    <View style={styles.container}>
      {track ? (
        <>
          <View style={styles.trackInfoContainer}>
            <View style={styles.albumCoverContainer}>
              <Image
                source={{ uri: track.albumCoverUrl }} // Use the album cover URL
                style={styles.albumCover} // Style the image
                resizeMode="cover" // Ensures the image covers the area nicely
              />
            </View>
            <View style={styles.trackDetails}>
              <Text style={styles.title}>{track.title}</Text>
              <Text style={styles.artist}>{track.artist}</Text>
              {/* Uncomment if you want to display the album name */}
              {/* <Text style={styles.album}>Album: {track.album}</Text> */}
            </View>
          </View>
        </>
      ) : (
        <Text>No track is currently playing.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    position: "absolute", // Position the track display absolutely
    bottom: 20, // Adjust bottom position as necessary
    left: 20, // Adjust left position as necessary
    zIndex: 1,
    backgroundColor: "#EBEFF2",
    width: "90%",
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000", // Color of the shadow
    shadowOffset: { width: 5, height: 2 }, // Offset shadow to the right by 5px (horizontal)
    shadowOpacity: 0.25, // Shadow opacity (simulating rgba(0, 0, 0, 0.25))
    shadowRadius: 7, // Shadow blur radius (simulating 7px)
    elevation: 2, // For Android shadow effect
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  artist: {
    fontSize: 15,
  },
  trackInfoContainer: {
    flexDirection: "row", // Arrange children in a row
    alignItems: "center", // Center vertically
  },
  albumCoverContainer: {
    width: 50, // Set the width of the album cover container
    height: 50, // Set the height of the album cover container
    borderRadius: 10, // Round the corners of the container
    borderWidth: 2, // Width of the stroke
    borderColor: "#D9D9D9", // Color of the stroke (change as needed)
    backgroundColor: "#D9D9D9", // Fill color
    shadowColor: "#000", // Color of the shadow
    shadowOffset: { width: 5, height: 2 }, // Offset shadow to the right by 5px (horizontal)
    shadowOpacity: 0.25, // Shadow opacity (simulating rgba(0, 0, 0, 0.25))
    shadowRadius: 7, // Shadow blur radius (simulating 7px)
    elevation: 2, // For Android shadow effect
    marginRight: 10, // Space between the album cover and text
    overflow: "hidden", // Ensures that the image doesn't overflow the border
  },

  albumCover: {
    width: "100%", // Set the width of the album cover to fill the container
    height: "100%", // Set the height of the album cover to fill the container
  },
});

const showTrack = async () => {
  const storedTrack = await AsyncStorage.getItem("currentTrack");
  if (storedTrack) {
    return JSON.parse(storedTrack); // Return the parsed track info
  }
  return null; // Return null if no track info found
};

const fetchCurrentlyPlayingTrack = async (accessToken) => {
  if (accessToken) {
    try {
      const response = await fetch(
        "https://api.spotify.com/v1/me/player/currently-playing",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        console.error(
          `Error fetching currently playing track: ${response.status} ${response.statusText}`
        );
        return null; // Exit if there was an error
      }

      if (response.status === 204) {
        console.log("No track is currently playing.");
        return null; // No track is playing
      }

      const data = await response.json();
      if (data && data.is_playing) {
        const trackInfo = {
          id: data.item.id, // Ensure you have a unique ID for the track
          title: data.item.name,
          artist: data.item.artists.map((artist) => artist.name).join(", "),
          albumCoverUrl:
            data.item.album.images && data.item.album.images.length > 0
              ? data.item.album.images[0].url
              : null,
          //   album: data.item.album.name,
        };

        return trackInfo; // Return the track item if needed
      } else {
        console.log("No track is currently playing.");
        return null; // Return null if no track is playing
      }
    } catch (error) {
      console.error("Error fetching currently playing track:", error);
    }
  } else {
    console.error("No access token available");
  }
};

const startPollingForTrackChanges = (accessToken, setTrack) => {
  let lastTrackId = null;

  const intervalId = setInterval(async () => {
    const track = await fetchCurrentlyPlayingTrack(accessToken);

    // Check if track is not null and has an ID
    if (track && track.id !== lastTrackId) {
      console.log("New song detected:", track);
      lastTrackId = track.id;

      // Update AsyncStorage
      await AsyncStorage.setItem("currentTrack", JSON.stringify(track));

      // Set the new track state to trigger a re-render
      setTrack(track);
    }
  }, 5000); // Poll every 10 seconds (adjust as needed)

  return intervalId; // Return the interval ID for cleanup
};
