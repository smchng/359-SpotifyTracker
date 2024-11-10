import { doc, getDoc } from "firebase/firestore";
import { db } from "../data/firebaseConfig";

export const fetchUserProfileFromFirestore = async (userId) => {
  try {
    const userDocRef = doc(db, "users", userId); // Reference to the user document
    const userDocSnap = await getDoc(userDocRef);

    console.log(userDocSnap); // Log the fetched data

    if (userDocSnap.exists()) {
      // Directly access the document data
      const userDocData = userDocSnap.data();
      console.log("Fetched User Data:", userDocData); // Log the fetched data
      return userDocData; // Return the user profile data
    } else {
      console.error("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user profile from Firestore:", error);
    return null;
  }
};
