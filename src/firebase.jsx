import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAlcx97VjChNpSbLZbvfeMkremnLXHJgo0",
  authDomain: "smartscape-e062e.firebaseapp.com",
  projectId: "smartscape-e062e",
  storageBucket: "smartscape-e062e.appspot.com",
  messagingSenderId: "10186914859",
  appId: "1:10186914859:web:fa2ce3e7c403d15ca6fe6e",
  measurementId: "G-XD1W6VEJ36"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth and Firestore
const auth = getAuth(app);
const db = getFirestore(app);

// Set persistence for auth
setPersistence(auth, browserLocalPersistence)
  .then(() => console.log("Persistence set"))
  .catch((error) => console.error("Error setting persistence:", error));

export { auth, db };