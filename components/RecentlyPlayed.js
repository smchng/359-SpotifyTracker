import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, FlatList } from "react-native";
import { getAccessToken } from "../ApiAccess/TokenStorage";

// Recently Played Component
export function RecentlyPlayed({ navigation }) {
  const accessToken = getAccessToken();
  const [tracks, setTracks] = useState([]); // Store all recently played tracks

  async function fetchRecentlyPlayed() {
    if (!accessToken) return; // Exit if no access token

    try {
      const response = await fetch(
        "https://api.spotify.com/v1/me/player/recently-played?limit=50", // Fetch 50 recently played tracks
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      const data = await response.json();
      if (data && data.items && data.items.length > 0) {
        const fetchedTracks = data.items.map((item) => item.track); // Extract track data

        // Update state to include previously fetched tracks
        setTracks((prevTracks) => {
          const uniqueTracks = [...prevTracks, ...fetchedTracks]; // Merge with previous tracks
          return uniqueTracks.filter(
            (track, index, self) =>
              index === self.findIndex((t) => t.id === track.id) // Ensure uniqueness
          );
        });

        // Log track titles and artists
        fetchedTracks.forEach((trackItem) => {
          const artists = trackItem.artists
            .map((artist) => artist.name)
            .join(", ");
          console.log(`Track: ${trackItem.name}, Artist(s): ${artists}`);
        });
      }
    } catch (error) {
      console.error("Error fetching tracks:", error);
    }
  }

  useEffect(() => {
    if (accessToken) {
      fetchRecentlyPlayed(); // Initial fetch
      // Polling to update the recently played track every 30 seconds
      const interval = setInterval(() => {
        fetchRecentlyPlayed();
      }, 30000); // Change to 30000 for 30 seconds
      return () => clearInterval(interval);
    }
  }, [accessToken]);

  return (
    <View style={styles.container}>
      {tracks.length > 0 ? (
        <FlatList
          data={tracks} // Set the data prop to the tracks state
          renderItem={recentlyPlayedTracks} // Set the render function for items
          keyExtractor={(item) => item.id} // Set unique key for each item
        />
      ) : (
        <Text>No track data</Text>
      )}
    </View>
  );
}
const recentlyPlayedTracks = ({ item }) => (
  <View style={{ marginBottom: 10 }}>
    <Text style={{ fontWeight: "bold" }}>Track: {item.name}</Text>
    <Text>
      Artist(s): {item.artists.map((artist) => artist.name).join(", ")}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 20,
    height: " 60%", // Set height to 40vh for the container
  },
  flatList: {
    height: "100%", // Make FlatList occupy full height of the container
  },
  flatListContent: {
    paddingBottom: 10, // Optional: adds padding to the bottom of the FlatList
  },
});
