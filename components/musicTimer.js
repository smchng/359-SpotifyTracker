// 30 min timer that starts profile and pin collection

import React from "react";
import { Button } from "react-native";
import { doc, setDoc, collection } from "firebase/firestore";
import { db } from "../data/firebaseConfig.js"; // Update with your Firebase config path

export default MusicTimer = () => {
  const handlePress = async () => {
    // Get current date and time
    const now = new Date();

    // Format the date to YYYY-MM-DD and time to HH-MM
    const formattedDate = now.toISOString().split("T")[0]; // Get YYYY-MM-DD
    const hours = String(now.getHours()).padStart(2, "0"); // Get HH
    const minutes = String(now.getMinutes()).padStart(2, "0"); // Get MM
    const newCollectionName = `${formattedDate}_${hours}-${minutes}`; // Unique collection name

    const docRef = doc(collection(db, newCollectionName)); // Creates a new collection

    try {
      // Create a new document in the new collection
      await setDoc(docRef, {
        exampleField: "exampleValue",
        timestamp: now, // Store the actual timestamp
      });
      console.log(`Document added to new collection: ${newCollectionName}`);
    } catch (error) {
      console.error("Error creating new collection:", error);
    }
  };

  return <Button title="Create New Collection" onPress={handlePress} />;
};
