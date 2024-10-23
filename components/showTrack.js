import { useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import { setAccessToken, getAccessToken } from "../TokenStorage";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const CurrentlyPlayingTrack = () => {
  const [track, setTrack] = useState(null);

  startPollingForTrackChanges();

  const displayStoredTrack = async () => {
    const storedTrack = await showTrack();
    if (storedTrack) {
      setTrack(storedTrack); // Set the track state to the stored track info
    }
  };

  useEffect(() => {
    startPollingForTrackChanges();
    displayStoredTrack(); // Display stored track info on component mount
  }, []); // Start polling on component mount

  return (
    <View style={styles.container}>
      {track ? (
        <>
          <Text style={styles.title}>Title: {track.title}</Text>
          <Text style={styles.artist}>Artist: {track.artist}</Text>
          {/* <Text style={styles.album}>Album: {track.album}</Text> */}
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
    alignItems: "center",
    justifyContent: "center",
  },
});

const showTrack = async () => {
  const storedTrack = await AsyncStorage.getItem("currentTrack");
  if (storedTrack) {
    const trackInfo = JSON.parse(storedTrack);
    return trackInfo; // Return the parsed track info
  }
  return null; // Return null if no track info found
};

const fetchCurrentlyPlayingTrack = async () => {
  let accessToken = getAccessToken(); // Retrieve the stored access token

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
        throw new Error(
          `Error fetching currently playing track: ${response.status}`
        );
      }

      // Check if the response is OK
      if (!response.ok) {
        // Log the status and status text for debugging
        console.error(
          `Error fetching currently playing track: ${response.status} ${response.statusText}`
        );
        return; // Exit if there was an error
      }

      // Check if the response has content
      if (response.status === 204) {
        console.log("No track is currently playing.");
        return; // No track is playing
      }

      const data = await response.json();

      // Check if there is a currently playing track
      if (data && data.is_playing) {
        const trackInfo = {
          title: data.item.name,
          artist: data.item.artists.map((artist) => artist.name).join(", "),
          //   album: data.item.album.name,
        };

        // Store the track info in AsyncStorage
        await AsyncStorage.setItem("currentTrack", JSON.stringify(trackInfo));

        console.log("Currently Playing Track:", trackInfo); // Log the track information
        return trackInfo; // Return the track item if needed
      } else {
        console.log("No track is currently playing.");
      }
    } catch (error) {
      console.error("Error fetching currently playing track:", error);
    }
  } else {
    console.error("No access token available");
  }
};

const startPollingForTrackChanges = (accessToken) => {
  let lastTrackId = null;

  setInterval(async () => {
    const track = await fetchCurrentlyPlayingTrack(accessToken);

    if (track && track.id !== lastTrackId) {
      // A new track is playing
      console.log("New song detected");
      lastTrackId = track.id;

      // Perform any action you want when a new song starts
    }
  }, 50000); // Poll every 5 seconds (adjust the interval as needed)
};
