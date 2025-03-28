import {
  createUserWithEmailAndPassword,
  signOut,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
  signInWithEmailAndPassword as firebaseSignIn,
  updatePassword,
  verifyBeforeUpdateEmail,
} from "firebase/auth"
import { auth, db } from "./config"
import { doc, updateDoc, getDoc } from "firebase/firestore"
import { clearAuthData, clearAllAppData } from "../clearAppData"

// Add this helper function at the top of the file
function setAuthCookie() {
  document.cookie = `auth-session=true; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Strict; ${
    window.location.protocol === "https:" ? "Secure;" : ""
  }`
}

// Helper function to check if a response is HTML
function isHtmlResponse(text) {
  return (
    text.trim().startsWith("<!DOCTYPE html>") ||
    text.trim().startsWith("<html") ||
    text.includes("</html>") ||
    text.includes("<script") ||
    text.includes("<body")
  )
}

// Update the signUpWithEmailAndPassword function to set isOnline to false by default
export async function signUpWithEmailAndPassword(email, password) {
  try {
    // Add validation for password length
    const passwordPattern = /^(?=.*\d)(?=.*[@$!%*?&])(?=.*[A-Za-z]).{8,}$/
    if (!passwordPattern.test(password)) {
      return {
        success: false,
        error:
          "Password must be at least 8 characters long and include one special character (@$!%*?&) and one number.",
      }
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password)

    // Set user's online status to false by default in Firestore
    const userDocRef = doc(db, "Users", userCredential.user.uid)
    await updateDoc(userDocRef, {
      isOnline: false,
    })

    // Cache user information
    clearAuthData(userCredential.user)

    return { success: true, user: userCredential.user }
  } catch (error) {
    // Return a more user-friendly error message based on Firebase error codes
    if (error.code === "auth/email-already-in-use") {
      return {
        success: false,
        error: "This email is already in use. Please use a different email.",
      }
    } else if (error.code === "auth/invalid-email") {
      return { success: false, error: "The email address is not valid." }
    } else if (error.code === "auth/operation-not-allowed") {
      return {
        success: false,
        error: "Email/password accounts are not enabled. Please contact support.",
      }
    } else if (error.code === "auth/weak-password") {
      return {
        success: false,
        error: "The password is too weak. Please use a stronger password.",
      }
    }
    return { success: false, error: error.message }
  }
}

// Update the signInWithEmailAndPassword function to set isOnline to true
export async function signInWithEmailAndPassword(email, password) {
  try {
    const userCredential = await firebaseSignIn(auth, email, password)

    // Set auth cookie on successful login
    setAuthCookie()

    // Update user's online status to true in Firestore
    const userDocRef = doc(db, "Users", userCredential.user.uid)
    await updateDoc(userDocRef, {
      isOnline: true,
    })

    // Cache user information
    clearAuthData(userCredential.user)

    return { success: true, user: userCredential.user }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Update the signOutUser function to ensure isOnline is set to false
export async function signOutUser() {
  try {
    // Get current user before signing out
    const user = auth.currentUser

    // Update user's online status to false if user exists
    if (user) {
      const userDocRef = doc(db, "Users", user.uid)
      await updateDoc(userDocRef, {
        isOnline: false,
      })
    }

    // Clear all application data
    clearAllAppData()

    // Sign out from Firebase Auth
    await signOut(auth)

    return { success: true }
  } catch (error) {
    console.error("Error during sign out:", error)
    return { success: false, error: error.message }
  }
}

// Get current user
export function getCurrentUser() {
  return auth.currentUser
}

// Update the deleteUserAccount function to use the Admin SDK API
export async function deleteUserAccount(password) {
  try {
    const user = auth.currentUser
    if (!user) {
      return { success: false, error: "auth/no-user" }
    }

    // First verify the password without making any changes
    try {
      const credential = EmailAuthProvider.credential(user.email, password)
      await reauthenticateWithCredential(user, credential)
    } catch (error) {
      // Return early if password verification fails
      if (error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") {
        return { success: false, error: "Current password is incorrect" }
      }
      if (error.code === "auth/too-many-requests") {
        return { success: false, error: "Too many attempts. Please try again later." }
      }
      return { success: false, error: "Authentication failed. Please check your current password." }
    }

    // Check if user is an admin by directly querying Firestore
    let isAdmin = false
    try {
      const userDocRef = doc(db, "Users", user.uid)
      const userDoc = await getDoc(userDocRef)
      if (userDoc.exists()) {
        // Check specifically for isAdmin field, not admin
        isAdmin = userDoc.data().isAdmin === true
        console.log("User admin status:", isAdmin)
      }
    } catch (error) {
      console.error("Error checking admin status:", error)
    }

    // If user is an admin, delete managed users first
    if (isAdmin) {
      console.log("User is an admin. Deleting managed users first...")

      try {
        // First delete managed users from Firestore including their rooms and devices
        const { deleteManagedUsers } = require("./firestore")
        const firestoreResult = await deleteManagedUsers(user.uid)
        console.log(`Successfully deleted ${firestoreResult.count} managed users from Firestore`)

        // Now delete managed users from Authentication using the Admin SDK
        if (firestoreResult.userIds && firestoreResult.userIds.length > 0) {
          console.log(`Attempting to delete ${firestoreResult.userIds.length} managed users from Authentication`)

          try {
            // Get ID token for authentication with the Admin SDK API
            const idToken = await user.getIdToken(true) // Force refresh to get a fresh token

            // Call the Admin SDK API to delete managed users with improved error handling
            const response = await fetch("/api/auth/delete-managed-users", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                // Add cache control headers to prevent caching
                "Cache-Control": "no-cache, no-store, must-revalidate",
                Pragma: "no-cache",
                Expires: "0",
              },
              body: JSON.stringify({
                idToken,
                adminUserId: user.uid,
                managedUserIds: firestoreResult.userIds, // Pass the specific user IDs to delete
              }),
              // Add credentials to ensure cookies are sent
              credentials: "same-origin",
            })

            // Check if response is OK
            if (!response.ok) {
              console.error(`Server responded with status: ${response.status}`)
              // Try to get the response text for debugging
              const errorText = await response.text()
              console.error("Error response:", errorText.substring(0, 200) + "...")
              throw new Error(`Server responded with status: ${response.status}`)
            }

            // Parse the response as JSON with better error handling
            let result
            try {
              const responseText = await response.text()

              // Check if the response is HTML instead of JSON
              if (isHtmlResponse(responseText)) {
                console.error("Received HTML response instead of JSON:", responseText.substring(0, 200) + "...")
                // Continue with account deletion even if managed user deletion fails
                console.log("Continuing with account deletion despite HTML response")
              } else {
                // Try to parse as JSON
                result = JSON.parse(responseText)

                if (result.success) {
                  console.log(`Successfully deleted ${result.count} managed users from Authentication`)
                } else {
                  console.error("Error deleting managed users:", result.error)
                  // Continue with account deletion even if managed user deletion fails
                }
              }
            } catch (jsonError) {
              console.error("Error parsing response:", jsonError)
              // Continue with account deletion even if managed user deletion fails
              console.log("Continuing with account deletion despite parsing error")
            }
          } catch (error) {
            console.error("Error deleting managed users from Authentication:", error)
            // Continue with account deletion even if managed user deletion fails
          }
        } else {
          console.log("No managed users to delete from Authentication")
        }
      } catch (error) {
        console.error("Error deleting managed users:", error)
        // Continue with account deletion even if managed user deletion fails
      }
    }

    // Attempt to clean up user data
    try {
      const { cleanupUserData } = require("./firestore")
      await cleanupUserData(user.uid)
    } catch (cleanupError) {
      console.error("Error during data cleanup:", cleanupError)
      // Continue with account deletion even if cleanup fails
    }

    // Clear all application data
    clearAllAppData()

    // Delete the user account directly using client-side Firebase Auth
    try {
      await deleteUser(user)
      console.log("Successfully deleted user account using client-side Firebase Auth")
      return { success: true }
    } catch (error) {
      console.error("Error deleting user account:", error)
      return { success: false, error: error.message || "Failed to delete account" }
    }
  } catch (error) {
    console.error("Error deleting user account:", error)
    return { success: false, error: error.code || "auth/unknown" }
  }
}

// Add this function to handle password changes
export async function changeUserPassword(currentPassword, newPassword) {
  try {
    const user = auth.currentUser
    if (!user) {
      return { success: false, error: "No authenticated user found" }
    }

    // Validate the new password against the required pattern
    const passwordPattern = /^(?=.*\d)(?=.*[@$!%*?&])(?=.*[A-Za-z]).{8,}$/
    if (!passwordPattern.test(newPassword)) {
      return {
        success: false,
        error:
          "Password must be at least 8 characters long and include one special character (@$!%*?&) and one number.",
      }
    }

    // Re-authenticate the user first
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword)
      await reauthenticateWithCredential(user, credential)
    } catch (error) {
      if (error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") {
        return { success: false, error: "Current password is incorrect" }
      }
      if (error.code === "auth/too-many-requests") {
        return { success: false, error: "Too many attempts. Please try again later." }
      }
      return { success: false, error: "Authentication failed. Please check your current password." }
    }

    // Update the password
    await updatePassword(user, newPassword)

    // Update the password change timestamp in Firestore
    const userDocRef = doc(db, "Users", user.uid)
    await updateDoc(userDocRef, {})

    return { success: true }
  } catch (error) {
    console.error("Error changing password:", error)
    return { success: false, error: error.message || "Failed to change password" }
  }
}

// Replace the updateUserEmail function with this updated version
export async function updateUserEmail(newEmail) {
  try {
    const user = auth.currentUser
    if (!user) {
      return { success: false, error: "No authenticated user found" }
    }

    // Validate email format
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailPattern.test(newEmail)) {
      return { success: false, error: "Please enter a valid email address" }
    }

    try {
      // Configure action code settings - redirect to auth page after verification
      const actionCodeSettings = {
        url: `${window.location.origin}/auth`,
        handleCodeInApp: true,
      }

      // Use verifyBeforeUpdateEmail to send a verification email to the new address
      await verifyBeforeUpdateEmail(user, newEmail, actionCodeSettings)

      return {
        success: true,
        verificationRequired: true,
        message:
          "A verification email has been sent to your new address. Please check your email and verify before the change takes effect.",
      }
    } catch (error) {
      if (error.code === "auth/requires-recent-login") {
        return {
          success: false,
          error: "For security reasons, please log out and log back in before changing your email.",
        }
      } else if (error.code === "auth/invalid-continue-uri") {
        return {
          success: false,
          error: "Unable to send verification email. Please try again later or contact support.",
        }
      }
      throw error // Re-throw for the outer catch block to handle
    }
  } catch (error) {
    console.error("Error updating email:", error)

    // Handle specific error cases
    if (error.code === "auth/requires-recent-login") {
      return {
        success: false,
        error: "For security reasons, please log out and log back in before changing your email.",
      }
    } else if (error.code === "auth/email-already-in-use") {
      return {
        success: false,
        error: "This email is already in use by another account.",
      }
    } else if (error.code === "auth/invalid-email") {
      return {
        success: false,
        error: "The email address is not valid.",
      }
    }

    return {
      success: false,
      error: error.message || "Failed to update email. Please try again later.",
    }
  }
}

// Update the completeEmailUpdate function to handle the verification
export async function completeEmailUpdate(user, newEmail) {
  try {
    if (!user) {
      return { success: false, error: "No authenticated user found" }
    }

    // The email in Firebase Auth should already be updated by verifyBeforeUpdateEmail
    // Now we update Firestore to match the new email from Auth
    const userDocRef = doc(db, "Users", user.uid)
    await updateDoc(userDocRef, {
      email: user.email, // Use the email from Auth
    })

    // Clear all Firestore data cache
    try {
      const { clearAllCache } = require("@/hooks/useFirestoreData")
      clearAllCache()
    } catch (cacheError) {
      console.error("Error clearing Firestore cache:", cacheError)
    }

    // Update cached user information with new email
    clearAuthData({
      ...user,
      email: user.email,
    })

    return { success: true }
  } catch (error) {
    console.error("Error completing email update:", error)

    if (error.code === "auth/requires-recent-login") {
      return {
        success: false,
        error: "For security reasons, please log out and log back in to complete your email update.",
      }
    }

    return {
      success: false,
      error: error.message || "Failed to complete email update.",
    }
  }
}

