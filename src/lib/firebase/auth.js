import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth"
import firebase_app from "./config"

// Initialize Firebase Authentication
const auth = getAuth(firebase_app)

// Sign up with email and password
export async function signUpWithEmailAndPassword(email, password) {
  try {
    // Add validation for password length
    if (password.length < 6) {
      return {
        success: false,
        error: "Password must be at least 6 characters long",
      }
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    return { success: true, user: userCredential.user }
  } catch (error) {
    // Return a more user-friendly error message based on Firebase error codes
    if (error.code === "auth/email-already-in-use") {
      return { success: false, error: "This email is already in use. Please use a different email." }
    } else if (error.code === "auth/invalid-email") {
      return { success: false, error: "The email address is not valid." }
    } else if (error.code === "auth/operation-not-allowed") {
      return { success: false, error: "Email/password accounts are not enabled. Please contact support." }
    } else if (error.code === "auth/weak-password") {
      return { success: false, error: "The password is too weak. Please use a stronger password." }
    }
    return { success: false, error: error.message }
  }
}

// Sign in with email and password
export async function signInWithEmailAndPassword(email, password) {
  try {
    // Import the function from firebase/auth to avoid name collision
    const { signInWithEmailAndPassword: firebaseSignIn } = require("firebase/auth")
    const userCredential = await firebaseSignIn(auth, email, password)
    return { success: true, user: userCredential.user }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Sign out
export async function signOutUser() {
  try {
    await signOut(auth)
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Get current user
export function getCurrentUser() {
  return auth.currentUser
}

// Delete user account
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

    // Proceed with user deletion regardless of cleanup success
    await deleteUser(user)
    return { success: true }
  } catch (error) {
    console.error("Error deleting user account:", error)
    return { success: false, error: error.code || "auth/unknown" }
  }
}

