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

// Update a profile with field validation
export async function updateProfile(userId, profileData) {
  try {
    const profileRef = doc(profilesCollection, userId)
    const profileDoc = await getDoc(profileRef)

    if (!profileDoc.exists()) {
      return { success: false, error: "Profile not found" }
    }

    // Validate fields before update
    const validatedData = {}

    if (profileData.firstName !== undefined || profileData.lastName !== undefined) {
      // Name validation
      const firstName = profileData.firstName?.trim() || profileDoc.data().firstName
      const lastName = profileData.lastName?.trim() || profileDoc.data().lastName

      if (firstName) validatedData.firstName = firstName
      if (lastName) validatedData.lastName = lastName
    }

    if (profileData.email !== undefined) {
      // Email validation
      const email = profileData.email.trim()
      if (email && email.includes("@")) {
        validatedData.email = email
      } else {
        return { success: false, error: "Invalid email format" }
      }
    }

    if (profileData.phoneNumbers !== undefined) {
      // Phone validation - basic format check
      const phone = profileData.phoneNumbers.trim()
      if (phone && /^[\d\s+()-]+$/.test(phone)) {
        validatedData.phoneNumbers = phone
      } else if (phone) {
        // Allow empty phone but validate if provided
        return { success: false, error: "Invalid phone number format" }
      }
    }

    if (profileData.address !== undefined) {
      // Address validation - just trim and ensure not empty if provided
      const address = profileData.address.trim()
      if (address) {
        validatedData.address = address
      }
    }

    // Add timestamp
    validatedData.updatedAt = new Date()

    // Update only if we have valid data
    if (Object.keys(validatedData).length > 0) {
      await updateDoc(profileRef, validatedData)
      return { success: true, data: validatedData }
    }

    return { success: false, error: "No valid fields to update" }
  } catch (error) {
    console.error("Error updating profile:", error)
    return { success: false, error: error.message }
  }
}

// Get a profile by user ID with error handling
export async function getProfileByUserId(userId) {
  try {
    const profileRef = doc(profilesCollection, userId)
    const profileSnap = await getDoc(profileRef)

    if (profileSnap.exists()) {
      const profileData = profileSnap.data()

      // Format the data for consistency
      const formattedProfile = {
        id: profileSnap.id,
        firstName: profileData.firstName || "",
        lastName: profileData.lastName || "",
        email: profileData.email || "",
        phoneNumbers: profileData.phoneNumbers || "",
        address: profileData.address || "",
        admin: profileData.admin === true,
        adminId: profileData.adminId || null,
        profileImageUrl: profileData.profileImageUrl || null,
        createdAt: profileData.createdAt?.toDate() || null,
        updatedAt: profileData.updatedAt?.toDate() || null,
      }

      return { success: true, profile: formattedProfile }
    } else {
      return { success: false, error: "Profile not found" }
    }
  } catch (error) {
    console.error("Error getting profile:", error)
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
    const isAdmin = userProfile.admin === true

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
    if (profile && profile.admin === true) {
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

