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

export const showTrack = async () => {
  const storedTrack = await AsyncStorage.getItem("currentTrack");
  if (storedTrack) {
    return JSON.parse(storedTrack); // Return the parsed track info
  }
  return null; // Return null if no track info found
};

export const showTrackAF = async () => {
  const storedTrack = await AsyncStorage.getItem("trackAF");
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
  let trackStartTime = null; // Variable to store when the current track started playing

  const intervalId = setInterval(async () => {
    const track = await fetchCurrentlyPlayingTrack(accessToken);

    // Check if a new track is detected
    if (track && track.id !== lastTrackId) {
      console.log("New song detected:", track);
      lastTrackId = track.id;

      // Record the start time of the new track
      trackStartTime = new Date();

      // Set the new track state to trigger a re-render
      setTrack(track);
    } else if (track && track.id === lastTrackId && trackStartTime) {
      try {
        // Fetch audio features for the track
        const audioFeatures = await fetchAudioFeatures(track.id);
        if (audioFeatures) {
          // Store audio features in AsyncStorage
          await AsyncStorage.setItem(`trackAF`, JSON.stringify(audioFeatures));

          console.log("Audio features fetched and stored for track:", track.id);
        } else {
          console.log("No audio features available for this track.");
        }

        // If there's any additional logic after fetching the audio features, continue here
        console.log("Audio features fetched for track:", track.id);
      } catch (error) {
        console.error("Error fetching audio features:", error);
      }
      // Calculate how long the current track has been playing
      const currentTime = new Date();
      const elapsedTime = (currentTime - trackStartTime) / 1000; // Convert milliseconds to seconds

      // Only store the track if it has been playing for more than 10 seconds
      if (elapsedTime > 10) {
        console.log("Track played for over 10 seconds:", track);

        // Update AsyncStorage
        await AsyncStorage.setItem("currentTrack", JSON.stringify(track));

        // Reset `trackStartTime` to avoid repeated storage of the same track
        trackStartTime = null;
      }
    }
  }, 5000); // Poll every 5 seconds (adjust as needed)

  return intervalId; // Return the interval ID for cleanup
};

const fetchAudioFeatures = async (songId) => {
  const accessToken = getAccessToken(); // Retrieve the stored access token
  try {
    // Make a request to Spotify's Audio Features API endpoint
    const response = await fetch(
      `https://api.spotify.com/v1/audio-features/${songId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // Check if the response is successful
    if (!response.ok) {
      throw new Error("Failed to fetch audio features");
    }

    // Parse the JSON response
    const audioFeatures = await response.json();

    // Log or return the audio features
    console.log(audioFeatures);

    return audioFeatures;
  } catch (error) {
    // console.error("Error fetching audio features:", error);
    return null; // Return null if there's an error
  }
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "absolute",
    bottom: 20,
    left: 20,
    zIndex: 1,
    backgroundColor: "#EBEFF2",
    width: "90%",
    padding: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 5, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 7,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  artist: {
    fontSize: 15,
  },
  trackInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  trackDetails: {
    flex: 1,
  },
  albumCoverContainer: {
    width: 50,
    height: 50,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#D9D9D9",
    backgroundColor: "#D9D9D9",
    shadowColor: "#000",
    shadowOffset: { width: 5, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 7,
    elevation: 2,
    marginRight: 10,
    overflow: "hidden",
  },
  albumCover: {
    width: "100%",
    height: "100%",
  },
});
