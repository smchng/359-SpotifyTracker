// Function to fetch the currently playing track
export const fetchCurrentlyPlayingTrack = async (accessToken) => {
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
      console.log("Currently Playing Track:", data.item); // Log the track information
      return data.item; // Return the track item if needed
    } else {
      console.log("No track is currently playing.");
    }
  } catch (error) {
    console.error("Error fetching currently playing track:", error);
  }
};
