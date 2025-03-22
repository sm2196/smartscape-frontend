"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { clearAllCache } from "@/hooks/useFirestoreData" // Import the cache clearing function
import { getUserId } from "@/lib/cacheUtils" // Import the getUserId function

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Try to get user ID from cache or auth
    const userId = getUserId(user)

    // Only redirect if we're not loading and there's no user ID available
    if (!loading && !userId) {
      // Clear all cache when logging out to prevent data leakage
      clearAllCache()
      router.replace("/")
    }
  }, [user, loading, router])

  // Always render children - this prevents the loading flash
  // The middleware.js will handle unauthorized access
  return children
}

