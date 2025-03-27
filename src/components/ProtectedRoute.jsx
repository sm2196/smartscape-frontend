"use client"

import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { useEffect, useState } from "react"

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isClient, setIsClient] = useState(false)

  // Set isClient to true when component mounts (client-side only)
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    // Only run this effect on the client side
    if (!isClient) return

    // Skip this check during loading
    if (loading) return

    // If user is not authenticated and not on a public path, redirect to login
    if (!user) {
      const isPublicPath =
        pathname.startsWith("/auth") ||
        pathname === "/" ||
        pathname === "/about" ||
        pathname === "/services" ||
        pathname === "/contact" ||
        pathname === "/faq"

      if (!isPublicPath) {
        router.push("/auth")
      }
    }
  }, [user, loading, router, pathname, isClient])

  // During server-side rendering or initial load, return children
  // This prevents the flash of redirect before hydration
  if (!isClient || loading) {
    return children
  }

  return children
}

