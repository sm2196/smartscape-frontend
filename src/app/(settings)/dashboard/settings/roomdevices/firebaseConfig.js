// Import the functions you need from Firebase SDKs
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, setDoc, doc } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAqRNlH_km9VO7dGkZ1M2PEMZLtNdaxgAM",
  authDomain: "firestore-d3a8b.firebaseapp.com",
  projectId: "firestore-d3a8b",
  storageBucket: "firestore-d3a8b.firebasestorage.app",
  messagingSenderId: "728375424214",
  appId: "1:728375424214:web:8c5c8a9ef8864f99d6c577",
  measurementId: "G-JHCWDLK9MX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);
