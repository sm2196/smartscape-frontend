import { adminAuth, verifyIdToken } from "@/lib/firebase/admin"
import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    // Get the request body
    const body = await request.json()
    const { idToken, userIdToDelete } = body

    // Verify the ID token to authenticate the request
    const authResult = await verifyIdToken(idToken)
    if (!authResult.success) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    // Get the authenticated user's UID
    const authenticatedUid = authResult.uid

    // Ensure the authenticated user is the one being deleted
    if (authenticatedUid !== userIdToDelete) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. You can only delete your own account." },
        { status: 403 },
      )
    }

    // Delete the user from Firebase Authentication
    await adminAuth.deleteUser(userIdToDelete)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in delete-user API route:", error)
    return NextResponse.json({ success: false, error: error.message || "Internal server error" }, { status: 500 })
  }
}

