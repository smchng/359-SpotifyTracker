import React, { useEffect, useState } from "react";
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
  if (!closestVibe) closestVibe = "no match";
  return closestVibe;
};

export const profileHandler = (songs) => {
  const avgAttributes = calculateAverage(songs);
  const mood = determineProfile(avgAttributes);
  console.log("profile:", mood);

  if (mood) {
    // Find the profile category based on the mood
    const profileCategory = profileDetails.find((profile) => profile[mood]);
    if (profileCategory) {
      // Retrieve the array of emojis for the current mood category
      const emojis = profileCategory[mood];

      // Randomly select one emoji
      const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

      // Extract the key and values (img and string)
      const emojiKey = Object.keys(randomEmoji)[0]; // happy1, sad2, etc.
      const emojiDetails = randomEmoji[emojiKey];

      console.log(`Random Emoji: ${emojiKey}`);
      console.log(`Image: ${emojiDetails.img}`);
      console.log(`String: ${emojiDetails.string}`);
      return {
        mood: mood,
        img: emojiDetails.img,
        tagline: emojiDetails.string,
      };
    } else {
      console.log("No profile found for mood:", mood);
    }
  } else {
    console.log("Mood is undefined or not set.");
  }

  return mood;
};

const profileDetails = [
  {
    Happy: [
      {
        happy1: {
          img: "Happy1",
          string: "Happy string1",
        },
      },
      {
        happy2: {
          img: "Happy2",
          string: "Happy string2",
        },
      },
      {
        happy3: {
          img: "Happy3",
          string: "Happy string3",
        },
      },
    ],
  },
  {
    Sad: [
      {
        sad1: {
          img: "Sad1",
          string: "Sad string1",
        },
      },
      {
        sad2: {
          img: "Sad2",
          string: "Sad string2",
        },
      },
      {
        sad3: {
          img: "Sad3",
          string: "Sad string3",
        },
      },
    ],
  },
  {
    Freak: [
      {
        freak1: {
          img: "Freak1",
          string: "Freak string1",
        },
      },
      {
        freak2: {
          img: "Freak2",
          string: "Freak string2",
        },
      },
      {
        freak3: {
          img: "Freak3",
          string: "Freak string3",
        },
      },
    ],
  },
  {
    Chilling: [
      {
        chilling1: {
          img: "Chilling1",
          string: "Chilling string1",
        },
      },
      {
        chilling2: {
          img: "Chilling2",
          string: "Chilling string2",
        },
      },
      {
        chilling3: {
          img: "Chilling3",
          string: "Chilling string3",
        },
      },
    ],
  },
  {
    Angry: [
      {
        angry1: {
          img: "Angry1",
          string: "Angry string1",
        },
      },
      {
        angry2: {
          img: "Angry2",
          string: "Angry string2",
        },
      },
      {
        angry3: {
          img: "Angry3",
          string: "Angry string3",
        },
      },
    ],
  },
  {
    Everywhere: [
      {
        everywhere1: {
          img: "Everywhere1",
          string: "Everywhere string1",
        },
      },
      {
        everywhere2: {
          img: "Everywhere2",
          string: "Everywhere string2",
        },
      },
      {
        everywhere3: {
          img: "Everywhere3",
          string: "Everywhere string3",
        },
      },
    ],
  },
  {
    Sleepy: [
      {
        sleepy1: {
          img: "Sleepy1",
          string: "Sleepy string1",
        },
      },
      {
        sleepy2: {
          img: "Sleepy2",
          string: "Sleepy string2",
        },
      },
      {
        sleepy3: {
          img: "Sleepy3",
          string: "Sleepy string3",
        },
      },
    ],
  },
  {
    "Late Night Feels": [
      {
        late1: {
          img: "LateNight1",
          string: "Late Night Feels string1",
        },
      },
      {
        late2: {
          img: "LateNight2",
          string: "Late Night Feels string2",
        },
      },
      {
        late3: {
          img: "LateNight3",
          string: "Late Night Feels string3",
        },
      },
    ],
  },
  {
    "Classical Connoisseur": [
      {
        classical1: {
          img: "Classical1",
          string: "Classical string1",
        },
      },
      {
        classical2: {
          img: "Classical2",
          string: "Classical string2",
        },
      },
      {
        classical3: {
          img: "Classical3",
          string: "Classical string3",
        },
      },
    ],
  },
];
