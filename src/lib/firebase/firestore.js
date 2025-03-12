import { doc, getDoc, getDocs, updateDoc, deleteDoc, query, where, writeBatch } from "firebase/firestore"
import { db } from "./config"
import { auth } from "./config"
import { collection } from "firebase/firestore"

// Profile collection reference
const profilesCollection = "profiles"

// Enhance the updateProfile function to be more robust
export async function updateProfile(userId, profileData) {
  try {
    const userDocRef = doc(db, "Users", userId)
    const userDocSnap = await getDoc(userDocRef)

    if (!userDocSnap.exists()) {
      return { success: false, error: "Profile not found" }
    }

    // Validate fields before update
    const validatedData = {}
    const currentData = userDocSnap.data()

    if (profileData.firstName !== undefined || profileData.lastName !== undefined) {
      // Name validation
      const firstName = profileData.firstName?.trim() || currentData.firstName
      const lastName = profileData.lastName?.trim() || currentData.lastName

      if (!firstName) {
        return { success: false, error: "First name cannot be empty" }
      }

      if (!lastName) {
        return { success: false, error: "Last name cannot be empty" }
      }

      validatedData.firstName = firstName
      validatedData.lastName = lastName
    }

    if (profileData.email !== undefined) {
      // Email validation
      const email = profileData.email.trim()
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

      if (!email) {
        return { success: false, error: "Email cannot be empty" }
      }

      if (!emailPattern.test(email)) {
        return { success: false, error: "Please enter a valid email address" }
      }

      // Get current user's email from Firebase Auth
      const currentUser = auth.currentUser
      const currentEmail = currentUser ? currentUser.email : currentData.email

      // Check if email is different from current email
      if (email !== currentEmail) {
        // If we get here, we need to handle the email update through Firebase Auth only
        const { updateUserEmail } = require("./auth")
        try {
          const emailUpdateResult = await updateUserEmail(email)

          if (emailUpdateResult.verificationRequired) {
            // Return the verification message to the UI
            return {
              success: true,
              verificationRequired: true,
              message: emailUpdateResult.message,
            }
          } else if (!emailUpdateResult.success) {
            // If there was an error in the email update process
            return {
              success: false,
              error: emailUpdateResult.error,
            }
          }
        } catch (error) {
          console.error("Error in email verification process:", error)
          return {
            success: false,
            error: "Failed to update email: " + (error.message || "Unknown error"),
          }
        }
      }
    }

    if (profileData.phone !== undefined) {
      // Phone validation - using more comprehensive validation
      const phone = profileData.phone.trim()

      // Allow empty phone but validate if provided
      if (phone) {
        // Check if the phone number is valid using a more comprehensive regex
        // This regex allows for international format with country code
        const phonePattern = /^\+?[1-9]\d{1,14}$/

        if (!phonePattern.test(phone.replace(/\s+/g, ""))) {
          return { success: false, error: "Please enter a valid phone number" }
        }

        // Check if phone is different from current phone
        if (phone !== currentData.phone) {
          // Check if phone is already in use by another user
          try {
            const phoneQuery = query(collection(db, "Users"), where("phone", "==", phone))
            const querySnapshot = await getDocs(phoneQuery)

            if (!querySnapshot.empty) {
              // Check if the found document is not the current user
              const existingUser = querySnapshot.docs[0]
              if (existingUser.id !== userId) {
                return { success: false, error: "This phone number is already in use by another account" }
              }
            }

            validatedData.phone = phone
          } catch (error) {
            console.error("Error checking phone uniqueness:", error)
            return { success: false, error: "Failed to validate phone uniqueness" }
          }
        }
      } else {
        validatedData.phone = ""
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
      const currentUser = auth.currentUser

      // Format the data for consistency
      const formattedProfile = {
        id: userDocSnap.id,
        firstName: profileData.firstName || "",
        lastName: profileData.lastName || "",
        email: currentUser ? currentUser.email : "",
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

