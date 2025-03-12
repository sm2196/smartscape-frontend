import { doc, getDoc, getDocs, updateDoc, deleteDoc, query, where, writeBatch } from "firebase/firestore"
import { db } from "./config"
import { auth } from "./config"
import { collection } from "firebase/firestore"

// Profile collection reference
const profilesCollection = "profiles"

// Update a profile with field validation - used in ProfileContent.jsx
export async function updateProfile(userId, profileData) {
  try {
    const userDocRef = doc(db, "Users", userId)
    const userDocSnap = await getDoc(userDocRef)

    if (!userDocSnap.exists()) {
      return { success: false, error: "Profile not found" }
    }

    // Validate fields before update
    const validatedData = {}

    if (profileData.firstName !== undefined || profileData.lastName !== undefined) {
      // Name validation
      const firstName = profileData.firstName?.trim() || userDocSnap.data().firstName
      const lastName = profileData.lastName?.trim() || userDocSnap.data().lastName

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

    if (profileData.phone !== undefined) {
      // Phone validation - basic format check
      const phone = profileData.phone.trim()
      if (phone && /^[\d\s+()-]+$/.test(phone)) {
        validatedData.phone = phone
      } else if (phone) {
        // Allow empty phone but validate if provided
        return { success: false, error: "Invalid phone number format" }
      }
    }

    // Add timestamp
    validatedData.updatedAt = new Date()

    // Update only if we have valid data
    if (Object.keys(validatedData).length > 0) {
      await updateDoc(userDocRef, validatedData)
      return { success: true, data: validatedData }
    }

    return { success: false, error: "No valid fields to update" }
  } catch (error) {
    console.error("Error updating profile:", error)
    return { success: false, error: error.message }
  }
}

// Get a profile by user ID with error handling - used in useAuth.js
export async function getProfileByUserId(userId) {
  try {
    // Create a document reference directly
    const userDocRef = doc(db, "Users", userId)
    const userDocSnap = await getDoc(userDocRef)

    if (userDocSnap.exists()) {
      const profileData = userDocSnap.data()

      // Format the data for consistency
      const formattedProfile = {
        id: userDocSnap.id,
        firstName: profileData.firstName || "",
        lastName: profileData.lastName || "",
        email: profileData.email || "",
        phone: profileData.phone || "",
        verified: profileData.verified || false,
        admin: profileData.admin === true,
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

// Delete a profile - used in cleanupUserData
export async function deleteProfile(userId) {
  try {
    const profileRef = doc(db, profilesCollection, userId)
    await deleteDoc(profileRef)
    return { success: true }
  } catch (error) {
    console.error("Error deleting profile:", error)
    return { success: false, error: error.message }
  }
}

// Get profiles by email - used in ProfileContent.jsx
export async function getProfilesByEmail(email) {
  try {
    // First get the user's own profile by the current user's ID
    const currentUser = auth.currentUser
    if (!currentUser) {
      return { success: false, error: "No authenticated user" }
    }

    const userDocRef = doc(db, "Users", currentUser.uid)
    const userDocSnap = await getDoc(userDocRef)

    if (!userDocSnap.exists()) {
      return { success: false, error: "Profile not found" }
    }

    const userProfile = { id: userDocSnap.id, ...userDocSnap.data() }
    const profiles = [userProfile]
    const isAdmin = userProfile.admin === true

    // If the user is an admin, get all profiles where adminId points to this user
    if (isAdmin) {
      const managedUsersQuery = query(collection(db, "Users"), where("adminId", "==", userProfile.id))
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
      // Get the admin profile using DocumentReference
      const adminDocRef = doc(db, "Users", userProfile.adminId)
      const adminDocSnap = await getDoc(adminDocRef)

      if (adminDocSnap.exists() && !profiles.some((p) => p.id === adminDocSnap.id)) {
        profiles.push({ id: adminDocSnap.id, ...adminDocSnap.data() })
      }

      // Get other users under the same admin
      const sameAdminQuery = query(collection(db, "Users"), where("adminId", "==", userProfile.adminId))
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

// Cleanup user data - used in deleteUserAccount
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
        const managedUsersQuery = query(collection(db, profilesCollection), where("adminId", "==", userId))
        const managedUsersSnapshot = await getDocs(managedUsersQuery)

        // If there are managed users, try to delete them
        if (!managedUsersSnapshot.empty) {
          // Delete all managed users in a batch
          const batch = writeBatch(db)
          managedUsersSnapshot.forEach((userDoc) => {
            batch.delete(doc(db, profilesCollection, userDoc.id))
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

