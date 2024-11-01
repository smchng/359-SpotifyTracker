// Stores and Authenticates App User Profile

const storeFirebase = async (username, password) => {
  try {
    const docRef = doc(collection(db, "spotify-user"));

    // Add user information to Firestore
    await setDoc(docRef, {
      username: username,
      password: password,
      timestamp: new Date(),
    });

    console.log("User stored with ID: ", docRef.id);
  } catch (error) {
    console.error("Error saving to Firebase:", error);
  }
};
