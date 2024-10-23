import { setAccessToken, getAccessToken } from "./TokenStorage";

export const fetchUserProfile = async () => {
  let accessToken = getAccessToken();
  if (!accessToken || isTokenExpired(accessToken)) {
    accessToken = await refreshAccessToken(); // Refresh token if expired
  }
  try {
    const response = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    console.log("User Profile:", data); // Log the user profile data
    return data; // Return user profile data
  } catch (error) {
    console.error("Error fetching user profile:", error);
  }
};

// Function to fetch the currently playing track
export const fetchCurrentlyPlayingTrack = async () => {
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
        console.log("Currently Playing Track:", data.item); // Log the track information
        return data.item; // Return the track item if needed
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

export const startPollingForTrackChanges = (accessToken) => {
  let lastTrackId = null;

  setInterval(async () => {
    const track = await fetchCurrentlyPlayingTrack(accessToken);

    if (track && track.id !== lastTrackId) {
      // A new track is playing
      console.log("New song detected:", track.name);
      lastTrackId = track.id;

      // Perform any action you want when a new song starts
    }
  }, 5000); // Poll every 5 seconds (adjust the interval as needed)
};
