// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
// import "firebase/firestore";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Your web app's Firebase configuration
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBCAf_oh9fRRo_GU67WuIXGtKg3IoZr41w",
  authDomain: "spotifytracker-84fc3.firebaseapp.com",
  projectId: "spotifytracker-84fc3",
  storageBucket: "spotifytracker-84fc3.firebasestorage.app",
  messagingSenderId: "716703155637",
  appId: "1:716703155637:web:1c4466d5c262356641c5fc",
  measurementId: "G-K5Y285EC75",
};

// Check if there is already a Firebase app initialized
const firebase_app = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp();

export const db = getFirestore(firebase_app);
export const auth = getAuth(firebase_app);
