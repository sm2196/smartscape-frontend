// firebaseConfig.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAlcx97VjChNpSbLZbvfeMkremnLXHJgo0",
  authDomain: "smartscape-e062e.firebaseapp.com",
  projectId: "smartscape-e062e",
  storageBucket: "smartscape-e062e.firebasestorage.app",
  messagingSenderId: "10186914859",
  appId: "1:10186914859:web:fa2ce3e7c403d15ca6fe6e"
};

// Prevent Firebase duplicate initialization
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Get Firestore instance
const db = getFirestore(app);

export { db, collection, getDocs };
