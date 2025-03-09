import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  writeBatch,
} from "firebase/firestore"
import firebase_app from "./config"
// Add this import at the top of the file
import { getCurrentUser } from "./auth"

// Initialize Firestore
const db = getFirestore(firebase_app)

// Profile collection reference
export const profilesCollection = collection(db, "profiles")

// Update the createProfile function to use DocumentReference
export async function createProfile(userId, profileData) {
  try {
    // Use the userId as the document ID for easy reference
    const profileRef = doc(profilesCollection, userId)

    // If there's an adminId, create a proper reference to it
    if (profileData.adminId) {
      // Store adminId as a string instead of a reference
      // This is simpler and avoids circular references
      profileData.adminId = profileData.adminId
      // Remove any adminRef if it exists
      delete profileData.adminRef
    }

    await setDoc(profileRef, {
      ...profileData,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    return { success: true, profileId: userId }
  } catch (error) {
    return {
      success: false,
      error: error.message || "Failed to create profile",
    }
  }
}

// Get a profile by user ID
export async function getProfileByUserId(userId) {
  try {
    const profileRef = doc(profilesCollection, userId)
    const profileSnap = await getDoc(profileRef)

    if (profileSnap.exists()) {
      return { success: true, profile: { id: profileSnap.id, ...profileSnap.data() } }
    } else {
      return { success: false, error: "Profile not found" }
    }
  } catch (error) {
    console.error("Error getting profile:", error)
    return { success: false, error: error.message }
  }
}

// Update a profile
export async function updateProfile(userId, profileData) {
  try {
    const profileRef = doc(profilesCollection, userId)
    await updateDoc(profileRef, {
      ...profileData,
      updatedAt: new Date(),
    })
    return { success: true }
  } catch (error) {
    console.error("Error updating profile:", error)
    return { success: false, error: error.message }
  }
}

// Delete a profile
export async function deleteProfile(userId) {
  try {
    const profileRef = doc(profilesCollection, userId)
    await deleteDoc(profileRef)
    return { success: true }
  } catch (error) {
    console.error("Error deleting profile:", error)
    return { success: false, error: error.message }
  }
}

// Update getProfilesByEmail to use adminId string instead of adminRef
export async function getProfilesByEmail(email) {
  try {
    // First get the user's own profile by the current user's ID
    const currentUser = getCurrentUser()
    if (!currentUser) {
      return { success: false, error: "No authenticated user" }
    }

    const userProfileRef = doc(profilesCollection, currentUser.uid)
    const userProfileSnap = await getDoc(userProfileRef)

    if (!userProfileSnap.exists()) {
      return { success: false, error: "Profile not found" }
    }

    const userProfile = { id: userProfileSnap.id, ...userProfileSnap.data() }
    const profiles = [userProfile]
    const isAdmin = userProfile.role === "admin"

    // If the user is an admin, get all profiles where adminId points to this user
    if (isAdmin) {
      const managedUsersQuery = query(profilesCollection, where("adminId", "==", userProfile.id))
      const managedUsersSnapshot = await getDocs(managedUsersQuery)

      managedUsersSnapshot.forEach((doc) => {
        // Avoid duplicates
        if (!profiles.some((p) => p.id === doc.id)) {
          profiles.push({ id: doc.id, ...doc.data() })
        }
      })
    }
    // If the user is not an admin, get the admin profile and other users under the same admin
    else if (userProfile.adminId) {
      // Get the admin profile
      const adminDocRef = doc(profilesCollection, userProfile.adminId)
      const adminDocSnap = await getDoc(adminDocRef)

      if (adminDocSnap.exists() && !profiles.some((p) => p.id === adminDocSnap.id)) {
        profiles.push({ id: adminDocSnap.id, ...adminDocSnap.data() })
      }

      // Get other users under the same admin
      const sameAdminQuery = query(profilesCollection, where("adminId", "==", userProfile.adminId))
      const sameAdminQuerySnapshot = await getDocs(sameAdminQuery)

      sameAdminQuerySnapshot.forEach((doc) => {
        if (!profiles.some((p) => p.id === doc.id)) {
          profiles.push({ id: doc.id, ...doc.data() })
        }
      })
    }

    return { success: true, profiles }
  } catch (error) {
    console.error("Error getting profiles by email:", error)
    return { success: false, error: error.message }
  }
}

// Fix the cleanupUserData function to handle permissions properly
export async function cleanupUserData(userId) {
  try {
    // Get the user profile to check if they're an admin
    const { success, profile, error } = await getProfileByUserId(userId)

    if (!success) {
      console.error("Error getting profile during cleanup:", error)
      // Continue with deletion even if we can't get the profile
      // This ensures the user account can still be deleted
      return { success: true }
    }

    // If the user is an admin, handle their managed users
    if (profile && profile.role === "admin") {
      try {
        // Find all users managed by this admin using adminId field
        const managedUsersQuery = query(profilesCollection, where("adminId", "==", userId))
        const managedUsersSnapshot = await getDocs(managedUsersQuery)

        // If there are managed users, try to delete them
        if (!managedUsersSnapshot.empty) {
          // Delete all managed users in a batch
          const batch = writeBatch(db)
          managedUsersSnapshot.forEach((userDoc) => {
            batch.delete(doc(profilesCollection, userDoc.id))
          })

          try {
            await batch.commit()
          } catch (batchError) {
            console.error("Error committing batch delete:", batchError)
            // Continue with deletion even if batch fails
          }
        }
      } catch (managedUsersError) {
        console.error("Error handling managed users:", managedUsersError)
        // Continue with deletion even if we can't delete managed users
      }
    }

    // Finally, try to delete the user's own profile
    try {
      await deleteProfile(userId)
    } catch (profileDeleteError) {
      console.error("Error deleting user profile:", profileDeleteError)
      // Continue with deletion even if we can't delete the profile
    }

    // Return success regardless of internal errors to ensure the auth account gets deleted
    return { success: true }
  } catch (error) {
    console.error("Error in cleanup:", error)
    // Return success anyway to ensure the auth account gets deleted
    return { success: true }
  }
}

