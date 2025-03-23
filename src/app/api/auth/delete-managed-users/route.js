import { adminAuth, adminDb, verifyIdToken } from "@/lib/firebase/admin"
import { NextResponse } from "next/server"

export async function POST(request) {
  // Add CORS headers
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json",
  }

  // Handle OPTIONS request (preflight)
  if (request.method === "OPTIONS") {
    return new NextResponse(null, { status: 204, headers: corsHeaders })
  }

  try {
    // Get the request body
    const body = await request.json()
    const { idToken, adminUserId, managedUserIds } = body

    // Verify the ID token to authenticate the request
    const authResult = await verifyIdToken(idToken)
    if (!authResult.success) {
      console.error("Token verification failed:", authResult.error)
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        {
          status: 401,
          headers: corsHeaders,
        },
      )
    }

    // Get the authenticated user's UID
    const authenticatedUid = authResult.uid

    // Ensure the authenticated user is the admin trying to delete managed users
    if (authenticatedUid !== adminUserId) {
      console.error("User mismatch:", authenticatedUid, "vs", adminUserId)
      return NextResponse.json(
        { success: false, error: "Unauthorized. You can only delete your own managed users." },
        {
          status: 403,
          headers: corsHeaders,
        },
      )
    }

    // Get the user record to check if they're an admin
    let isAdmin = false
    try {
      const userRecord = await adminAuth.getUser(authenticatedUid)
      isAdmin = userRecord.customClaims?.admin === true
    } catch (error) {
      console.error("Error getting user record:", error)
    }

    // Check if the user is an admin in Firestore as a fallback
    if (!isAdmin) {
      try {
        const userDoc = await adminDb.collection("Users").doc(authenticatedUid).get()
        if (userDoc.exists) {
          isAdmin = userDoc.data().isAdmin === true
        }
      } catch (error) {
        console.error("Error checking admin status in Firestore:", error)
      }
    }

    if (!isAdmin) {
      console.error("User is not an admin:", authenticatedUid)
      return NextResponse.json(
        { success: false, error: "Unauthorized. Only admins can delete managed users." },
        {
          status: 403,
          headers: corsHeaders,
        },
      )
    }

    // If specific managed user IDs are provided, use those
    const managedUserIdsToDelete = managedUserIds || []

    // If no specific IDs are provided, find all users managed by this admin
    if (managedUserIdsToDelete.length === 0) {
      try {
        const managedUsersSnapshot = await adminDb
          .collection("Users")
          .where("adminRef", "==", adminDb.collection("Users").doc(adminUserId))
          .get()

        if (managedUsersSnapshot.empty) {
          console.log("No managed users found for admin:", adminUserId)
          return NextResponse.json({ success: true, count: 0 }, { headers: corsHeaders })
        }

        managedUsersSnapshot.forEach((doc) => {
          managedUserIdsToDelete.push(doc.id)
        })
      } catch (error) {
        console.error("Error finding managed users:", error)
        return NextResponse.json(
          { success: false, error: "Failed to find managed users" },
          {
            status: 500,
            headers: corsHeaders,
          },
        )
      }
    }

    console.log(`Found ${managedUserIdsToDelete.length} managed users to delete:`, managedUserIdsToDelete)

    // Delete each managed user from Authentication
    const deletionPromises = []

    for (const managedUserId of managedUserIdsToDelete) {
      console.log(`Attempting to delete managed user ${managedUserId} from Authentication`)

      deletionPromises.push(
        adminAuth
          .deleteUser(managedUserId)
          .then(() => {
            console.log(`Successfully deleted managed user ${managedUserId} from Authentication`)
            return { success: true, userId: managedUserId }
          })
          .catch((error) => {
            console.error(`Error deleting managed user ${managedUserId}:`, error)
            return { error, userId: managedUserId }
          }),
      )
    }

    // Wait for all deletion operations to complete
    const results = await Promise.all(deletionPromises)

    // Count successful deletions and collect errors
    const errors = results.filter((result) => result && result.error)
    const successCount = results.filter((result) => !result.error).length

    console.log(`Deletion results: ${successCount} successful, ${errors.length} failed`)

    // Return a proper JSON response
    return NextResponse.json(
      {
        success: true,
        count: successCount,
        totalAttempted: managedUserIdsToDelete.length,
        errors: errors.length > 0 ? errors.map((e) => ({ userId: e.userId, message: e.error.message })) : undefined,
      },
      { headers: corsHeaders },
    )
  } catch (error) {
    console.error("Error in delete-managed-users API route:", error)
    return NextResponse.json(
      { success: false, error: error.message || "Internal server error" },
      {
        status: 500,
        headers: corsHeaders,
      },
    )
  }
}

