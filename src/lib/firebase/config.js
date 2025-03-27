// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const firebase_app = getApps().length
  ? getApps()[0]
  : initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(firebase_app);
const db = getFirestore(firebase_app);
const storage = getStorage(firebase_app);

// Set persistence for auth
setPersistence(auth, browserLocalPersistence)
  .then(() => console.log("Persistence set"))
  .catch((error) => console.error("Error setting persistence:", error));

export { firebase_app as app, auth, db, storage };
