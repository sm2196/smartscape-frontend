import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { getAuth, signInAnonymously } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAlcx97VjChNpSbLZbvfeMkremnLXHJgo0",
  authDomain: "smartscape-e062e.firebaseapp.com",
  projectId: "smartscape-e062e",
  storageBucket: "smartscape-e062e.appspot.com", // FIXED
  messagingSenderId: "10186914859",
  appId: "1:10186914859:web:fa2ce3e7c403d15ca6fe6e",
  measurementId: "G-XD1W6VEJ36",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Sign in user anonymously
signInAnonymously(auth)
  .then(() => console.log("Signed in anonymously"))
  .catch((error) => console.error("Auth Error:", error));

export { db, collection, addDoc, getDocs, deleteDoc, doc };
