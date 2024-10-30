import { useState, useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import { setAccessToken, getAccessToken } from "../ApiAccess/TokenStorage"; // Ensure these functions are correctly implemented
import AsyncStorage from "@react-native-async-storage/async-storage";

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
          //   album: data.item.album.name,
        };

        await AsyncStorage.setItem("currentTrack", JSON.stringify(trackInfo));
        console.log("Currently Playing Track:", trackInfo); // Log the track information
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
  }, 10000); // Poll every 10 seconds (adjust as needed)

  return intervalId; // Return the interval ID for cleanup
};
