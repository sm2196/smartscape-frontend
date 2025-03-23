import { doc, getDoc, getDocs, updateDoc, deleteDoc, query, where, writeBatch } from "firebase/firestore"
import { db } from "./config"
import { auth } from "./config"
import { collection } from "firebase/firestore"
import { clearAllCache } from "@/hooks/useFirestoreData"

// User collection reference
const usersCollection = "Users"

// Enhance the updateProfile function to be more robust and fix caching issues
export async function updateProfile(userId, profileData) {
  try {
    const userDocRef = doc(db, usersCollection, userId)
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
            const phoneQuery = query(collection(db, usersCollection), where("phone", "==", phone))
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
        } else {
          // Phone is the same as current, no need to update
          validatedData.phone = phone
        }
      } else {
        validatedData.phone = ""
      }
    }

    // Update only if we have valid data
    if (Object.keys(validatedData).length > 0) {
      await updateDoc(userDocRef, validatedData)

      // Clear cache when profile is updated to ensure fresh data
      clearAllCache()

      return { success: true, data: validatedData }
    }

    return { success: true, message: "No changes detected" }
  } catch (error) {
    console.error("Error updating profile:", error)
    return { success: false, error: error.message }
  }
}

// Get a profile by user ID with error handling - used in useAuth.js
export async function getProfileByUserId(userId) {
  try {
    // Create a document reference directly
    const userDocRef = doc(db, usersCollection, userId)
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
        // Check specifically for isAdmin field, not admin
        isAdmin: profileData.isAdmin === true,
        profileImageUrl: profileData.profileImageUrl || null,
        createdAt: profileData.createdAt?.toDate() || null,
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
    const userDocRef = doc(db, usersCollection, userId)
    await deleteDoc(userDocRef)
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

    const userDocRef = doc(db, usersCollection, currentUser.uid)
    const userDocSnap = await getDoc(userDocRef)

    if (!userDocSnap.exists()) {
      return { success: false, error: "Profile not found" }
    }

    const userProfile = { id: userDocSnap.id, ...userDocSnap.data() }
    const profiles = [userProfile]
    const isAdmin = userProfile.admin === true // Changed from admin to isAdmin

    // If the user is an admin, get all profiles where adminRef points to this user
    if (isAdmin) {
      const managedUsersQuery = query(
        collection(db, usersCollection),
        where("adminRef", "==", doc(db, "Users", userProfile.id)),
      )
      const managedUsersSnapshot = await getDocs(managedUsersQuery)

      managedUsersSnapshot.forEach((doc) => {
        // Avoid duplicates
        if (!profiles.some((p) => p.id === doc.id)) {
          profiles.push({ id: doc.id, ...doc.data() })
        }
      })
    }
    // If the user is not an admin, get the admin profile and other users under the same admin
    else if (userProfile.adminRef) {
      // Get the admin profile using the adminRef DocumentReference
      const adminRef = userProfile.adminRef
      const adminDocSnap = await getDoc(adminRef)

      if (adminDocSnap.exists() && !profiles.some((p) => p.id === adminDocSnap.id)) {
        profiles.push({ id: adminDocSnap.id, ...adminDocSnap.data() })
      }

      // Get other users under the same admin
      const sameAdminQuery = query(collection(db, usersCollection), where("adminRef", "==", adminRef))
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

// Update the cleanupUserData function to ensure isOnline is set to false when account is deleted
export async function cleanupUserData(userId) {
  try {
    // Get the user profile to check if they're an admin
    const { success, profile, error } = await getProfileByUserId(userId)

    if (!success) {
      console.error("Error getting profile during cleanup:", error)
      return { success: true }
    }

    // Create a batch for atomic operations
    const batch = writeBatch(db)

    // Only delete rooms and devices if the user is an admin
    if (profile && profile.isAdmin === true) {
      // Find and delete all rooms owned by this user
      const roomsRef = collection(db, "Rooms")
      const roomsQuery = query(roomsRef, where("userRef", "==", doc(db, "Users", userId)))
      const roomsSnapshot = await getDocs(roomsQuery)

      // Store room IDs to delete associated devices
      const roomIds = []

      // Add room deletions to batch
      roomsSnapshot.forEach((roomDoc) => {
        roomIds.push(roomDoc.id)
        batch.delete(roomDoc.ref)
      })

      // Find and delete all devices that reference these rooms
      const devicesRef = collection(db, "Devices")
      for (const roomId of roomIds) {
        const devicesQuery = query(devicesRef, where("roomRef", "==", doc(db, "Rooms", roomId)))
        const devicesSnapshot = await getDocs(devicesQuery)

        devicesSnapshot.forEach((deviceDoc) => {
          batch.delete(deviceDoc.ref)
        })
      }
    } else {
      console.log("User is not an admin, skipping deletion of rooms and devices")
    }

    // If the user is an admin, handle their managed users
    if (profile && profile.isAdmin === true) {
      const managedUsersQuery = query(collection(db, "Users"), where("adminRef", "==", doc(db, "Users", userId)))
      const managedUsersSnapshot = await getDocs(managedUsersQuery)

      for (const userDoc of managedUsersSnapshot.docs) {
        const managedUserId = userDoc.id

        // Set managed users to offline
        batch.update(doc(db, "Users", managedUserId), { isOnline: false })

        // Delete managed user's rooms
        const roomsRef = collection(db, "Rooms")
        const managedRoomsQuery = query(roomsRef, where("userRef", "==", doc(db, "Users", managedUserId)))
        const managedRoomsSnapshot = await getDocs(managedRoomsQuery)

        const managedRoomIds = []
        managedRoomsSnapshot.forEach((roomDoc) => {
          managedRoomIds.push(roomDoc.id)
          batch.delete(roomDoc.ref)
        })

        // Delete managed user's devices
        const devicesRef = collection(db, "Devices")
        for (const roomId of managedRoomIds) {
          const managedDevicesQuery = query(devicesRef, where("roomRef", "==", doc(db, "Rooms", roomId)))
          const managedDevicesSnapshot = await getDocs(managedDevicesQuery)

          managedDevicesSnapshot.forEach((deviceDoc) => {
            batch.delete(deviceDoc.ref)
          })
        }

        // Delete the managed user document
        batch.delete(doc(db, "Users", managedUserId))
      }
    }

    // Delete the user's own document
    batch.delete(doc(db, "Users", userId))

    // Commit all the batch operations
    await batch.commit()
    console.log("Successfully cleaned up all user data")
    return { success: true }
  } catch (error) {
    console.error("Error in cleanup:", error)
    // Return success anyway to ensure the auth account gets deleted
    return { success: true }
  }
}

// New function to delete all managed users for an admin
export async function deleteManagedUsers(adminUserId) {
  try {
    console.log(`Starting deletion of managed users for admin: ${adminUserId}`)

    // Find all users managed by this admin
    const managedUsersQuery = query(
      collection(db, usersCollection),
      where("adminRef", "==", doc(db, "Users", adminUserId)),
    )

    const managedUsersSnapshot = await getDocs(managedUsersQuery)

    if (managedUsersSnapshot.empty) {
      console.log("No managed users found for this admin")
      return { success: true, count: 0, userIds: [] }
    }

    console.log(`Found ${managedUsersSnapshot.size} managed users to delete`)

    // Create a batch for atomic operations
    const batch = writeBatch(db)
    const managedUserIds = []

    // Add all managed users to the batch for deletion
    managedUsersSnapshot.forEach((userDoc) => {
      const managedUserId = userDoc.id
      managedUserIds.push(managedUserId)
      batch.delete(userDoc.ref)
      console.log(`Added managed user ${managedUserId} to deletion batch`)
    })

    // For each managed user, delete their rooms and devices
    for (const managedUserId of managedUserIds) {
      // Find and delete all rooms owned by this managed user
      const roomsRef = collection(db, "Rooms")
      const roomsQuery = query(roomsRef, where("userRef", "==", doc(db, "Users", managedUserId)))
      const roomsSnapshot = await getDocs(roomsQuery)

      // Store room IDs to delete associated devices
      const roomIds = []

      // Add room deletions to batch
      roomsSnapshot.forEach((roomDoc) => {
        roomIds.push(roomDoc.id)
        batch.delete(roomDoc.ref)
        console.log(`Added room ${roomDoc.id} to deletion batch`)
      })

      // Find and delete all devices that reference these rooms
      const devicesRef = collection(db, "Devices")
      for (const roomId of roomIds) {
        const devicesQuery = query(devicesRef, where("roomRef", "==", doc(db, "Rooms", roomId)))
        const devicesSnapshot = await getDocs(devicesQuery)

        devicesSnapshot.forEach((deviceDoc) => {
          batch.delete(deviceDoc.ref)
          console.log(`Added device ${deviceDoc.id} to deletion batch`)
        })
      }
    }

    // Commit all the batch operations
    await batch.commit()
    console.log(`Successfully deleted ${managedUserIds.length} managed users and their data`)

    // Clear all cache to ensure fresh data
    clearAllCache()

    return { success: true, count: managedUserIds.length, userIds: managedUserIds }
  } catch (error) {
    console.error("Error deleting managed users:", error)
    return { success: false, error: error.message }
  }
}

