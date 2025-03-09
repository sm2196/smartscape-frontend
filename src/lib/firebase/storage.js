import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"
import firebase_app from "./config"

// Initialize Firebase Storage
const storage = getStorage(firebase_app)

// Upload profile image
export async function uploadProfileImage(userId, file) {
  try {
    const storageRef = ref(storage, `profile-images/${userId}`)
    const snapshot = await uploadBytes(storageRef, file)
    const downloadURL = await getDownloadURL(snapshot.ref)

    return { success: true, imageUrl: downloadURL }
  } catch (error) {
    console.error("Error uploading profile image:", error)
    return { success: false, error: error.message }
  }
}

// Get profile image URL
export async function getProfileImageUrl(userId) {
  try {
    const storageRef = ref(storage, `profile-images/${userId}`)
    const downloadURL = await getDownloadURL(storageRef)

    return { success: true, imageUrl: downloadURL }
  } catch (error) {
    // If the image doesn't exist, return a default image
    if (error.code === "storage/object-not-found") {
      return { success: false, error: "No profile image found" }
    }

    console.error("Error getting profile image:", error)
    return { success: false, error: error.message }
  }
}

