import admin from "firebase-admin"

// Initialize the Firebase Admin SDK if it hasn't been initialized already
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    })
    console.log("Firebase Admin SDK initialized successfully")
  } catch (error) {
    console.error("Error initializing Firebase Admin SDK:", error)
  }
}

// Export the admin SDK
export const adminAuth = admin.auth()
export const adminDb = admin.firestore()

// Helper function to verify ID tokens
export async function verifyIdToken(idToken) {
  try {
    if (!idToken) {
      return { success: false, error: "No ID token provided" }
    }

    const decodedToken = await adminAuth.verifyIdToken(idToken)
    return { success: true, uid: decodedToken.uid, token: decodedToken }
  } catch (error) {
    console.error("Error verifying ID token:", error)
    return { success: false, error: error.message }
  }
}

