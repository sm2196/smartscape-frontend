"use client"

import { useState, useEffect } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth, db } from "@/lib/firebase/config"
import { doc, getDoc } from "firebase/firestore"

export function useAuth() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user)

        // Fetch the user's profile using DocumentReference
        try {
          const userDocRef = doc(db, "Users", user.uid)
          const userDocSnap = await getDoc(userDocRef)

          if (userDocSnap.exists()) {
            // Format dates and add the id to the profile data
            const profileData = userDocSnap.data()

            // Convert Firestore timestamps to JS Dates if they exist
            const formattedProfile = {
              ...profileData,
              id: user.uid,
              createdAt: profileData.createdAt?.toDate() || null,
              updatedAt: profileData.updatedAt?.toDate() || null,
            }

            setProfile(formattedProfile)
          } else {
            console.log("No profile data found for this user")
            setProfile(null)
          }
        } catch (error) {
          console.error("Error fetching user profile:", error)
          setProfile(null)
        }
      } else {
        setUser(null)
        setProfile(null)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return { user, profile, loading }
}

