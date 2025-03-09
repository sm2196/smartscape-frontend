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
    let adminRef = null
    if (profileData.adminId) {
      adminRef = doc(profilesCollection, profileData.adminId)
      // Replace the adminId string with the reference
      profileData.adminRef = adminRef
      delete profileData.adminId // Remove the string ID
    }

    await setDoc(profileRef, {
      ...profileData,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    return { success: true, profileId: userId }
  } catch (error) {
    console.error("Error creating profile:", error)
    return { success: false, error: error.message }
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

// Update getProfilesByEmail to also get profiles where adminRef points to the user
export async function getProfilesByEmail(email) {
  try {
    // First get the user's own profile by the current user's ID instead of querying by email
    const currentUser = getCurrentUser() // Add this import at the top of the file
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

    // If the user is an admin, get all profiles where adminRef points to this user
    if (isAdmin) {
      const userRef = doc(profilesCollection, userProfile.id)
      const adminQuery = query(profilesCollection, where("adminRef", "==", userRef))
      const adminQuerySnapshot = await getDocs(adminQuery)

      adminQuerySnapshot.forEach((doc) => {
        // Avoid duplicates
        if (!profiles.some((p) => p.id === doc.id)) {
          profiles.push({ id: doc.id, ...doc.data() })
        }
      })
    }
    // If the user is not an admin, get the admin profile and other users under the same admin
    else if (userProfile.adminRef) {
      // Get the admin profile
      const adminDoc = await getDoc(userProfile.adminRef)
      if (adminDoc.exists() && !profiles.some((p) => p.id === adminDoc.id)) {
        profiles.push({ id: adminDoc.id, ...adminDoc.data() })
      }

      // Get other users under the same admin
      const sameAdminQuery = query(profilesCollection, where("adminRef", "==", userProfile.adminRef))
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

// Add this function to clean up user data when deleting an account
export async function cleanupUserData(userId) {
  try {
    // Get the user profile to check if they're an admin or regular user
    const { success, profile } = await getProfileByUserId(userId)

    if (!success) {
      return { success: false, error: "Profile not found" }
    }

    // If the user is an admin, handle their managed users
    if (profile.role === "admin") {
      // Find all users managed by this admin
      const userRef = doc(profilesCollection, userId)
      const managedUsersQuery = query(profilesCollection, where("adminRef", "==", userRef))
      const managedUsersSnapshot = await getDocs(managedUsersQuery)

      // Delete all managed users or reassign them
      const batch = writeBatch(db)
      managedUsersSnapshot.forEach((userDoc) => {
        // Option 1: Delete managed users
        batch.delete(doc(profilesCollection, userDoc.id))

        // Option 2: Update managed users to remove admin reference
        // batch.update(doc(profilesCollection, userDoc.id), {
        //   adminRef: null,
        //   updatedAt: new Date()
        // });
      })

      await batch.commit()
    }

    // Finally, delete the user's own profile
    await deleteProfile(userId)

    return { success: true }
  } catch (error) {
    console.error("Error cleaning up user data:", error)
    return { success: false, error: error.message }
  }
}

