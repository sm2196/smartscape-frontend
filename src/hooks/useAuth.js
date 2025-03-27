"use client"

import { useState, useEffect } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth, db } from "@/lib/firebase/config"
import { doc, updateDoc, onSnapshot } from "firebase/firestore"
import { cacheUserInfo } from "@/lib/cacheUtils"

export function useAuth() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Set up auth state listener
  useEffect(() => {
    setLoading(true)

    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
        if (currentUser) {
          setUser(currentUser)
        } else {
          setUser(null)
          setProfile(null)
          setError(null)
        }

        // Don't show loading state when user is null (prevents "Account not found" flash)
        setLoading(currentUser !== null ? false : false)
      },
      (authError) => {
        console.error("Auth state change error:", authError)
        setError(`Authentication error: ${authError.message}`)
        setLoading(false)
      },
    )

    return () => unsubscribe()
  }, [])

  // Set up real-time listener for profile updates
  useEffect(() => {
    if (!user) return

    const userDocRef = doc(db, "Users", user.uid)

    const unsubscribe = onSnapshot(
      userDocRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const profileData = docSnapshot.data()

          // Convert Firestore timestamps to JS Dates if they exist
          const formattedProfile = {
            ...profileData,
            id: user.uid,
            firstName: profileData.firstName || "",
            lastName: profileData.lastName || "",
            email: user.email, // Get email directly from Auth
            phone: profileData.phone || "",
            verified: profileData.verified || false,
            isAdmin: profileData.isAdmin === true,
            profileImageUrl: profileData.profileImageUrl || null,
            createdAt: profileData.createdAt?.toDate() || null,
          }

          setProfile(formattedProfile)
          setError(null)

          // Update cached user information
          cacheUserInfo({
            ...user,
            isAdmin: profileData.isAdmin === true,
          })
        } else {
          setProfile(null)
          setError("Profile data not found")
        }
      },
      (err) => {
        console.error("Error in profile snapshot listener:", err)
        setError(`Failed to sync profile updates: ${err.message}`)
      },
    )

    return () => unsubscribe()
  }, [user])

  // Update the presence system to properly handle online status
  // Add a presence system to track online status
  useEffect(() => {
    if (user) {
      // Create a reference to the user's document
      const userStatusRef = doc(db, "Users", user.uid)

      // When the page is closed or the user navigates away
      const handleBeforeUnload = async () => {
        // Update the Firestore document to show user is offline
        try {
          await updateDoc(userStatusRef, { isOnline: false })
        } catch (error) {
          console.error("Error updating offline status:", error)
        }
      }

      window.addEventListener("beforeunload", handleBeforeUnload)

      // Update online status when the component mounts
      updateDoc(userStatusRef, { isOnline: true }).catch((error) =>
        console.error("Error updating online status:", error),
      )

      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload)
        // Update offline status when component unmounts
        updateDoc(userStatusRef, { isOnline: false }).catch((error) =>
          console.error("Error updating offline status on unmount:", error),
        )
      }
    }
  }, [user])

  return { user, profile, loading, error }
}

