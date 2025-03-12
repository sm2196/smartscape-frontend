"use client"

import { useState, useEffect } from "react"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import firebase_app from "@/lib/firebase/config"
import { getProfileByUserId } from "@/lib/firebase/firestore"

const auth = getAuth(firebase_app)

export function useAuth() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user)

        // Fetch the user's profile
        const { success, profile } = await getProfileByUserId(user.uid)
        if (success) {
          setProfile(profile)
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

