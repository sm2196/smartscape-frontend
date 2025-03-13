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
import { doc, updateDoc } from "firebase/firestore"
import { cacheUserInfo, clearCachedUserInfo } from "../userCache"

// Add this helper function at the top of the file
function setAuthCookie() {
  document.cookie = `auth-session=true; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Strict; ${
    window.location.protocol === "https:" ? "Secure;" : ""
  }`
}

// Add these functions to your existing auth.js file

// Clear auth cookie when user logs out
function clearAuthCookie() {
  document.cookie = "auth-session=; path=/; max-age=0; SameSite=Strict;"
}

// Sign up with email and password
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

    // Update user's online status to true in Firestore
    const userDocRef = doc(db, "Users", userCredential.user.uid)
    await updateDoc(userDocRef, {
      isOnline: true,
    })

    // Cache user information
    cacheUserInfo(userCredential.user)

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

// Update the signInWithEmailAndPassword function
export async function signInWithEmailAndPassword(email, password) {
  try {
    const userCredential = await firebaseSignIn(auth, email, password)

    // Set auth cookie on successful login
    setAuthCookie()

    // Cache user information
    cacheUserInfo(userCredential.user)

    return { success: true, user: userCredential.user }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Sign out
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

    // Clear any local storage items related to the app
    localStorage.removeItem("notifications")
    localStorage.removeItem("linkedThirdPartyApp")

    // Clear any session storage items
    sessionStorage.clear()

    // Clear the auth cookie
    clearAuthCookie()

    // Clear cached user information
    clearCachedUserInfo()

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

// Delete user account - this is used in ProfileContent.jsx
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
      // This prevents any data deletion
      if (error.code === "auth/wrong-password") {
        return { success: false, error: "auth/wrong-password" }
      }
      if (error.code === "auth/too-many-requests") {
        return { success: false, error: "auth/too-many-requests" }
      }
      return { success: false, error: error.code || "auth/unknown" }
    }

    // Attempt to clean up user data first
    try {
      const { cleanupUserData } = require("./firestore")
      await cleanupUserData(user.uid)
    } catch (cleanupError) {
      console.error("Error during data cleanup:", cleanupError)
      // Continue with account deletion even if cleanup fails
    }

    // Clear all local storage and session storage
    localStorage.clear()
    sessionStorage.clear()

    // Clear cached user information
    const { clearCachedUserInfo } = require("../userCache")
    clearCachedUserInfo()

    // Clear all Firestore data cache
    try {
      const { clearAllCache } = require("@/hooks/useFirestoreData")
      clearAllCache()
    } catch (cacheError) {
      console.error("Error clearing Firestore cache:", cacheError)
    }

    // Clear auth cookie
    document.cookie = "auth-session=; path=/; max-age=0; SameSite=Strict;"

    // Proceed with user deletion regardless of cleanup success
    await deleteUser(user)
    return { success: true }
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
      if (error.code === "auth/wrong-password") {
        return { success: false, error: "Current password is incorrect" }
      }
      if (error.code === "auth/too-many-requests") {
        return { success: false, error: "Too many attempts. Please try again later." }
      }
      return { success: false, error: error.code || "Authentication failed" }
    }

    // Update the password
    await updatePassword(user, newPassword)

    // Update the password change timestamp in Firestore
    const userDocRef = doc(db, "Users", user.uid)
    await updateDoc(userDocRef, {
      // Remove passwordLastChanged: new Date(),
      // Remove updatedAt: new Date(),
    })

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
        url: `${window.location.origin}/auth?newEmail=${encodeURIComponent(newEmail)}&emailChanged=true`,
        handleCodeInApp: true,
      }

      // Use verifyBeforeUpdateEmail to send a verification email to the new address
      await verifyBeforeUpdateEmail(user, newEmail, actionCodeSettings)

      return {
        success: true,
        verificationRequired: true,
        message:
          "A verification email has been sent to your new address. Please check your email and verify before the change takes effect. You'll be redirected to the login page after verification.",
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
      // Remove updatedAt: new Date(),
    })

    // Clear all Firestore data cache
    try {
      const { clearAllCache } = require("@/hooks/useFirestoreData")
      clearAllCache()
    } catch (cacheError) {
      console.error("Error clearing Firestore cache:", cacheError)
    }

    // Update cached user information with new email
    cacheUserInfo({
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

