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
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    return { success: true, user: userCredential.user }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Sign in with email and password
export async function signInWithEmailAndPassword(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
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
      return { success: false, error: "No user is currently signed in" }
    }

    // Re-authenticate the user before deletion (required by Firebase for security)
    const credential = EmailAuthProvider.credential(user.email, password)
    await reauthenticateWithCredential(user, credential)

    // Delete the user from Firebase Authentication
    await deleteUser(user)

    return { success: true }
  } catch (error) {
    console.error("Error deleting user account:", error)
    return { success: false, error: error.message }
  }
}

