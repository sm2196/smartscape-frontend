import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"
import firebase_app from "./config"

// Initialize Firebase Storage with CORS configuration
const storage = getStorage(firebase_app)

// Upload profile image with CORS handling
export async function uploadProfileImage(userId, file) {
  try {
    // Create storage reference
    const storageRef = ref(storage, `profile-images/${userId}`)

    // Create file metadata including CORS settings
    const metadata = {
      contentType: file.type,
      customMetadata: {
        "Access-Control-Allow-Origin": "*",
      },
    }

    // Upload the file with metadata
    const snapshot = await uploadBytes(storageRef, file, metadata)
    const downloadURL = await getDownloadURL(snapshot.ref)

    return { success: true, imageUrl: downloadURL }
  } catch (error) {
    console.error("Error uploading profile image:", error)
    return {
      success: false,
      error: error.message || "Failed to upload profile image",
    }
  }
}

// Get profile image URL
export async function getProfileImageUrl(userId) {
  try {
    const storageRef = ref(storage, `profile-images/${userId}`)
    const downloadURL = await getDownloadURL(storageRef)

    return { success: true, imageUrl: downloadURL }
  } catch (error) {
    // If the image doesn't exist, return null without error
    if (error.code === "storage/object-not-found") {
      return { success: true, imageUrl: null }
    }

    console.error("Error getting profile image:", error)
    return {
      success: false,
      error: error.message || "Failed to get profile image",
    }
  }
}

