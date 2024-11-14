const calculateAverage = (songs) => {
  const averages = {
    acousticness: 0,
    danceability: 0,
    energy: 0,
    loudness: 0,
    tempo: 0,
    valence: 0,
  };

  songs.forEach((song) => {
    averages.acousticness += song.acousticness;
    averages.danceability += song.danceability;
    averages.energy += song.energy;
    averages.loudness += song.loudness;
    averages.tempo += song.tempo;
    averages.valence += song.valence;
  });

  const numSongs = songs.length;

  for (const key in averages) {
    if (averages.hasOwnProperty(key)) {
      averages[key] /= numSongs;
    }
  }

  return averages;
};

const determineProfile = (avgAttributes) => {
  const profiles = {
    Happy: {
      valence: 0.7,
      energy: 0.7,
      danceability: 0.6,
      loudness: -5,
      tempo: 120,
      acousticness: 0.2,
    },
    Sad: {
      valence: 0.3,
      energy: 0.3,
      danceability: 0.3,
      loudness: -20,
      tempo: 60,
      acousticness: 0.7,
    },
    Freak: {
      valence: 0.5,
      energy: 0.9,
      danceability: 0.8,
      loudness: -3,
      tempo: 140,
      acousticness: 0.3,
    },
    Chilling: {
      valence: 0.5,
      energy: 0.4,
      danceability: 0.4,
      loudness: -15,
      tempo: 80,
      acousticness: 0.6,
    },
    Angry: {
      valence: 0.3,
      energy: 0.9,
      danceability: 0.6,
      loudness: -4,
      tempo: 150,
      acousticness: 0.1,
    },
    Everywhere: {
      valence: 0.6,
      energy: 0.8,
      danceability: 0.7,
      loudness: -7,
      tempo: 130,
      acousticness: 0.3,
    },
    Sleepy: {
      valence: 0.2,
      energy: 0.2,
      danceability: 0.2,
      loudness: -25,
      tempo: 50,
      acousticness: 0.8,
    },
    "Late Night Feels": {
      valence: 0.3,
      energy: 0.5,
      danceability: 0.4,
      loudness: -15,
      tempo: 70,
      acousticness: 0.6,
    },
    "Classical Connoisseur": {
      valence: 0.5,
      energy: 0.3,
      danceability: 0.2,
      loudness: -15,
      tempo: 90,
      acousticness: 0.9,
    },
  };

  const weights = {
    valence: 1.0,
    energy: 0.8,
    danceability: 0.6,
    loudness: 0.5,
    tempo: 0.4,
    acousticness: 0.3,
  };

  console.log("Profile Generating...");
  let lowestDifference = Infinity; // Initialize lowestDifference
  let closestVibe = "";
  for (const [vibeName, vibeAttributes] of Object.entries(profiles)) {
    let totalDifference = 0;
    console.log(`Checking vibe: ${vibeName}`);

    for (const key in vibeAttributes) {
      if (avgAttributes.hasOwnProperty(key)) {
        const difference = Math.abs(avgAttributes[key] - vibeAttributes[key]);
        console.log(
          `Key: ${key}, Avg: ${avgAttributes[key]}, Vibe: ${vibeAttributes[key]}, Diff: ${difference}`
        );
        totalDifference += difference;
      } else {
        console.log(`Key ${key} not found in avgAttributes`);
      }
    }

    if (totalDifference < lowestDifference) {
      lowestDifference = totalDifference;
      closestVibe = vibeName;
    }
  }

  console.log("Closest vibe determined:", closestVibe);
  return closestVibe;
};

export const profileHandler = (songs) => {
  const avgAttributes = calculateAverage(songs);
  const profile = determineProfile(avgAttributes);
  console.log("profile:", profile);
  return profile;
};
