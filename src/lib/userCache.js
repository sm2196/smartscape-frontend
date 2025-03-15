/**
 * Utility functions for caching and retrieving user information
 * to improve performance and reduce dependency on Firebase Auth loading
 */

// Constants for storage keys
const USER_ID_CACHE_KEY = "smartscape_user_id"
const USER_EMAIL_CACHE_KEY = "smartscape_user_email"
const USER_ADMIN_CACHE_KEY = "smartscape_user_is_admin"

/**
 * Store user information in localStorage
 * @param {Object} user - The user object containing id, email, and admin status
 */
export function cacheUserInfo(user) {
  if (!user) return

  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(USER_ID_CACHE_KEY, user.uid)
      if (user.email) {
        localStorage.setItem(USER_EMAIL_CACHE_KEY, user.email)
      }
      if (user.isAdmin !== undefined) {
        localStorage.setItem(USER_ADMIN_CACHE_KEY, user.isAdmin.toString())
      }
    }
  } catch (error) {
    console.error("Error caching user info:", error)
  }
}

/**
 * Get cached user ID from localStorage
 * @returns {string|null} The cached user ID or null if not found
 */
export function getCachedUserId() {
  try {
    // Check if window is defined (client-side) before accessing localStorage
    if (typeof window !== "undefined") {
      return localStorage.getItem(USER_ID_CACHE_KEY)
    }
    return null
  } catch (error) {
    console.error("Error getting cached user ID:", error)
    return null
  }
}

/**
 * Get cached user email from localStorage
 * @returns {string|null} The cached user email or null if not found
 */
export function getCachedUserEmail() {
  try {
    if (typeof window !== "undefined") {
      return localStorage.getItem(USER_EMAIL_CACHE_KEY)
    }
    return null
  } catch (error) {
    console.error("Error getting cached user email:", error)
    return null
  }
}

/**
 * Get cached user admin status from localStorage
 * @returns {boolean|null} The cached user admin status or null if not found
 */
export function getCachedUserIsAdmin() {
  try {
    if (typeof window !== "undefined") {
      const isAdmin = localStorage.getItem(USER_ADMIN_CACHE_KEY)
      return isAdmin ? isAdmin === "true" : null
    }
    return null
  } catch (error) {
    console.error("Error getting cached user admin status:", error)
    return null
  }
}

/**
 * Clear all cached user information from localStorage
 */
export function clearCachedUserInfo() {
  try {
    if (typeof window !== "undefined") {
      localStorage.removeItem(USER_ID_CACHE_KEY)
      localStorage.removeItem(USER_EMAIL_CACHE_KEY)
      localStorage.removeItem(USER_ADMIN_CACHE_KEY)
    }
  } catch (error) {
    console.error("Error clearing cached user info:", error)
  }
}

/**
 * Get user information from cache
 * @returns {Object|null} An object containing user information or null if not found
 */
export function getCachedUserInfo() {
  const uid = getCachedUserId()
  if (!uid) return null

  return {
    uid,
    email: getCachedUserEmail(),
    isAdmin: getCachedUserIsAdmin(),
  }
}

/**
 * Get user ID with priority from cache first, then from auth object if available
 * @param {Object|null} authUser - The current Firebase auth user object (optional)
 * @returns {string|null} The user ID or null if not found
 */
export function getUserId(authUser = null) {
  // Try to get from cache first (fastest)
  const cachedId = getCachedUserId()
  if (cachedId) return cachedId

  // Fall back to auth object if provided
  if (authUser && authUser.uid) return authUser.uid

  // If we have access to the Firebase auth object, try that as last resort
  try {
    const { auth } = require("./firebase/config")
    const currentUser = auth.currentUser
    return currentUser?.uid || null
  } catch (error) {
    console.error("Error accessing Firebase auth:", error)
    return null
  }
}

