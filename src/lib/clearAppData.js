/**
 * Utility functions for clearing application data
 * This centralizes all data clearing operations to ensure consistency
 */

import { clearAllCache } from "@/hooks/useFirestoreData"
import { clearCachedUserInfo, clearRelatedCollectionsCache } from "./cacheUtils"

/**
 * Clear all application data from localStorage, sessionStorage, and cookies
 * @returns {void}
 */
export function clearAllAppData() {
  // Clear Firestore data cache
  clearAllCache()

  // Clear user cache
  clearCachedUserInfo()

  // Clear specific collections using the new utility
  clearRelatedCollectionsCache("Rooms", "Devices")

  // Clear other app-specific localStorage keys
  const localStorageItemsToClear = [
    "notifications",
    "linkedThirdPartyApp",
    // Add any other app-specific localStorage keys here
  ]

  localStorageItemsToClear.forEach((key) => {
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error(`Error removing localStorage item ${key}:`, error)
    }
  })

  // Clear all sessionStorage
  try {
    sessionStorage.clear()
  } catch (error) {
    console.error("Error clearing sessionStorage:", error)
  }

  // Clear cookies
  clearAllCookies()
}

/**
 * Clear all cookies
 * @returns {void}
 */
function clearAllCookies() {
  try {
    document.cookie.split(";").forEach((cookie) => {
      const name = cookie.trim().split("=")[0]
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
    })
  } catch (error) {
    console.error("Error clearing cookies:", error)
  }
}

/**
 * Clear auth-specific data only
 * @returns {void}
 */
export function clearAuthData() {
  // Clear auth cookie
  document.cookie = "auth-session=; path=/; max-age=0; SameSite=Strict;"

  // Clear user cache
  clearCachedUserInfo()
}

