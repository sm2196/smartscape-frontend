"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { clearAllCache } from "@/hooks/useFirestoreData" // Import the cache clearing function

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Only redirect if we're not loading and there's no user
    if (!loading && !user) {
      // Clear all cache when logging out to prevent data leakage
      clearAllCache()
      router.replace("/auth")
    }
  }, [user, loading, router])

  // Always render children - this prevents the loading flash
  // The middleware.js will handle unauthorized access
  return children
}

