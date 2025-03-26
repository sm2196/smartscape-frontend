import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"

// Initialize Firebase Admin SDK
const initializeAdmin = () => {
  // Check if any Firebase admin apps have been initialized
  const apps = getApps()

  if (!apps.length) {
    try {
      // Initialize with service account credentials
      const serviceAccount = {
        projectId: process.env.NEXT_FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.NEXT_FIREBASE_ADMIN_CLIENT_EMAIL,
        // The private key needs to be properly formatted from the environment variable
        privateKey: process.env.NEXT_FIREBASE_ADMIN_PRIVATE_KEY
          ? process.env.NEXT_FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, "\n")
          : undefined,
      }

      // Initialize the app
      return initializeApp({
        credential: cert(serviceAccount),
        databaseURL: `https://${process.env.NEXT_FIREBASE_ADMIN_PROJECT_ID}.firebaseio.com`,
      })
    } catch (error) {
      console.error("Error initializing Firebase Admin SDK:", error)
      throw error
    }
  }

  // Return the first app if it exists
  return apps[0]
}

// Get the admin app instance
const adminApp = initializeAdmin()

// Export the admin auth and firestore instances
export const adminAuth = getAuth(adminApp)
export const adminDb = getFirestore(adminApp)

// Helper function to verify ID token
export const verifyIdToken = async (token) => {
  try {
    const decodedToken = await adminAuth.verifyIdToken(token)
    return { success: true, uid: decodedToken.uid }
  } catch (error) {
    console.error("Error verifying ID token:", error)
    return { success: false, error: error.message }
  }
}

// Helper function to delete a user by UID
export const deleteUserByUid = async (uid) => {
  try {
    await adminAuth.deleteUser(uid)
    return { success: true }
  } catch (error) {
    console.error(`Error deleting user ${uid}:`, error)
    return { success: false, error: error.message }
  }
}

// Helper function to get user by email
export const getUserByEmail = async (email) => {
  try {
    const userRecord = await adminAuth.getUserByEmail(email)
    return { success: true, user: userRecord }
  } catch (error) {
    console.error(`Error getting user by email ${email}:`, error)
    return { success: false, error: error.message }
  }
}

