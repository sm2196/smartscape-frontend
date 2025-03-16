"use client"

import { useState, useEffect, useCallback } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth, db } from "@/lib/firebase/config"
import { doc, getDoc, updateDoc, onSnapshot } from "firebase/firestore"
import { cacheUserInfo, getUserId } from "@/lib/cacheUtils"

export function useAuth() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Function to fetch profile data
  const fetchProfile = useCallback(async (userId) => {
    try {
      const userDocRef = doc(db, "Users", userId)
      const userDocSnap = await getDoc(userDocRef)

      if (userDocSnap.exists()) {
        // Format dates and add the id to the profile data
        const profileData = userDocSnap.data()
        const currentUser = auth.currentUser

        // Convert Firestore timestamps to JS Dates if they exist
        const formattedProfile = {
          ...profileData,
          id: userId,
          email: currentUser ? currentUser.email : "", // Get email directly from Auth
          createdAt: profileData.createdAt?.toDate() || null,
        }

        setProfile(formattedProfile)
        setError(null)

        // Cache user information including admin status
        if (currentUser) {
          cacheUserInfo({
            ...currentUser,
            isAdmin: profileData.isAdmin === true,
          })
        }
      } else {
        console.log("No profile data found for this user")
        setProfile(null)
        setError("Profile data not found")
      }
    } catch (err) {
      console.error("Error fetching user profile:", err)
      setProfile(null)
      setError(`Failed to load profile: ${err.message}`)
    }
  }, [])

  // Replace the useEffect that checks for cached user ID with this improved version
  // Check for cached user ID on initial load
  useEffect(() => {
    // Get user ID with priority from cache
    const userId = getUserId(user)

    if (userId && !user) {
      // If we have a user ID but no user object yet,
      // fetch the profile data using the ID and set loading to true
      setLoading(true)
      fetchProfile(userId)
        .then(() => setLoading(false))
        .catch(() => setLoading(false))
    }
  }, [fetchProfile, user])

  // Set up auth state listener
  useEffect(() => {
    setLoading(true)

    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
        if (currentUser) {
          setUser(currentUser)
          await fetchProfile(currentUser.uid)
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
  }, [fetchProfile])

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
            email: user.email, // Get email directly from Auth
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

  // Add a presence system to track online status
  useEffect(() => {
    if (user) {
      // Create a reference to the user's document
      const userStatusRef = doc(db, "Users", user.uid)

      // Create a reference to the Realtime Database for connection status
      const isOfflineForDatabase = {
        isOnline: false,
      }

      const isOnlineForDatabase = {
        isOnline: true,
      }

      // When the page is closed or the user navigates away
      const handleBeforeUnload = async () => {
        // Update the Firestore document to show user is offline
        try {
          await updateDoc(userStatusRef, isOfflineForDatabase)
        } catch (error) {
          console.error("Error updating offline status:", error)
        }
      }

      window.addEventListener("beforeunload", handleBeforeUnload)

      // Update online status when the component mounts
      updateDoc(userStatusRef, isOnlineForDatabase).catch((error) =>
        console.error("Error updating online status:", error),
      )

      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload)
        // Update offline status when component unmounts
        updateDoc(userStatusRef, isOfflineForDatabase).catch((error) =>
          console.error("Error updating offline status on unmount:", error),
        )
      }
    }
  }, [user])

  // Function to refresh profile data manually
  const refreshProfile = useCallback(async () => {
    if (user) {
      setLoading(true)
      await fetchProfile(user.uid)
      setLoading(false)
    }
  }, [user, fetchProfile])

  return { user, profile, loading, error, refreshProfile }
}

