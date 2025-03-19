/**
 * Unified utility functions for caching and retrieving data
 * to improve performance and reduce database queries
 */

// Constants for user cache storage keys
const USER_ID_CACHE_KEY = "smartscape_user_id"
const USER_EMAIL_CACHE_KEY = "smartscape_user_email"
const USER_ADMIN_CACHE_KEY = "smartscape_user_is_admin"

// Prefix for all collection cache keys to avoid conflicts
const CACHE_PREFIX = "smartscape_"

/**
 * USER CACHING FUNCTIONS
 */

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

/**
 * COLLECTION DATA CACHING FUNCTIONS
 */

/**
 * Generate a cache key for a specific collection and optional document ID
 * @param {string} collection - The collection name
 * @param {string|null} documentId - Optional document ID
 * @param {string|null} suffix - Optional suffix for the key
 * @returns {string} The generated cache key
 */
export function generateCacheKey(collection, documentId = null, suffix = null) {
  let key = `${CACHE_PREFIX}${collection}`
  if (documentId) key += `_${documentId}`
  if (suffix) key += `_${suffix}`
  return key
}

/**
 * Generate a timestamp key for a collection
 * @param {string} collection - The collection name
 * @returns {string} The timestamp key
 */
export function generateTimestampKey(collection) {
  return `${CACHE_PREFIX}${collection}_timestamp`
}

/**
 * Cache data in localStorage
 * @param {string} key - The cache key
 * @param {any} data - The data to cache
 * @returns {boolean} Whether the operation was successful
 */
export function cacheData(key, data) {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(data))
      // Update timestamp
      const timestampKey = key.includes("_")
        ? `${key.split("_")[0]}_${key.split("_")[1]}_timestamp`
        : `${key}_timestamp`
      localStorage.setItem(timestampKey, Date.now().toString())
      return true
    }
    return false
  } catch (error) {
    console.error(`Error caching data for key ${key}:`, error)
    return false
  }
}

/**
 * Get cached data from localStorage
 * @param {string} key - The cache key
 * @param {number} cacheDuration - How long the cache is valid in milliseconds
 * @returns {any|null} The cached data or null if not found or expired
 */
export function getCachedData(key, cacheDuration = 5 * 60 * 1000) {
  try {
    if (typeof window !== "undefined") {
      // Get timestamp
      const timestampKey = key.includes("_")
        ? `${key.split("_")[0]}_${key.split("_")[1]}_timestamp`
        : `${key}_timestamp`
      const timestamp = localStorage.getItem(timestampKey)

      // Check if cache is valid
      if (timestamp && Date.now() - Number.parseInt(timestamp) < cacheDuration) {
        const data = localStorage.getItem(key)
        return data ? JSON.parse(data) : null
      }
    }
    return null
  } catch (error) {
    console.error(`Error getting cached data for key ${key}:`, error)
    return null
  }
}

/**
 * Clear cached data for a specific key
 * @param {string} key - The cache key
 * @returns {boolean} Whether the operation was successful
 */
export function clearCachedData(key) {
  try {
    if (typeof window !== "undefined") {
      localStorage.removeItem(key)
      // Remove timestamp
      const timestampKey = key.includes("_")
        ? `${key.split("_")[0]}_${key.split("_")[1]}_timestamp`
        : `${key}_timestamp`
      localStorage.removeItem(timestampKey)
      return true
    }
    return false
  } catch (error) {
    console.error(`Error clearing cached data for key ${key}:`, error)
    return false
  }
}

/**
 * Clear all cached data for a collection
 * @param {string} collection - The collection name
 * @returns {boolean} Whether the operation was successful
 */
export function clearCollectionCache(collection) {
  try {
    if (typeof window !== "undefined") {
      const prefix = `${CACHE_PREFIX}${collection}`
      const keys = Object.keys(localStorage)

      keys.forEach((key) => {
        if (key.startsWith(prefix)) {
          localStorage.removeItem(key)
        }
      })

      // Also clear any in-memory cache for this collection
      try {
        const { cache } = require("@/hooks/useFirestoreData")
        if (cache) {
          for (const key of cache.keys()) {
            if (key.startsWith(collection)) {
              cache.delete(key)
            }
          }
        }
      } catch (e) {
        console.error("Error clearing in-memory cache:", e)
      }

      return true
    }
    return false
  } catch (error) {
    console.error(`Error clearing collection cache for ${collection}:`, error)
    return false
  }
}

/**
 * Check if cache is valid for a collection
 * @param {string} collection - The collection name
 * @param {number} cacheDuration - How long the cache is valid in milliseconds
 * @returns {boolean} Whether the cache is valid
 */
export function isCacheValid(collection, cacheDuration = 5 * 60 * 1000) {
  try {
    if (typeof window !== "undefined") {
      const timestampKey = generateTimestampKey(collection)
      const timestamp = localStorage.getItem(timestampKey)

      return timestamp && Date.now() - Number.parseInt(timestamp) < cacheDuration
    }
    return false
  } catch (error) {
    console.error(`Error checking cache validity for ${collection}:`, error)
    return false
  }
}

/**
 * Cache collection data with timestamp
 * @param {string} collection - The collection name
 * @param {any} data - The data to cache
 * @returns {boolean} Whether the operation was successful
 */
export function cacheCollectionData(collection, data) {
  try {
    if (typeof window !== "undefined") {
      const key = generateCacheKey(collection)
      const timestampKey = generateTimestampKey(collection)

      localStorage.setItem(key, JSON.stringify(data))
      localStorage.setItem(timestampKey, Date.now().toString())
      return true
    }
    return false
  } catch (error) {
    console.error(`Error caching collection data for ${collection}:`, error)
    return false
  }
}

/**
 * Get cached collection data
 * @param {string} collection - The collection name
 * @param {number} cacheDuration - How long the cache is valid in milliseconds
 * @returns {any|null} The cached data or null if not found or expired
 */
export function getCachedCollectionData(collection, cacheDuration = 5 * 60 * 1000) {
  try {
    if (typeof window !== "undefined") {
      if (isCacheValid(collection, cacheDuration)) {
        const key = generateCacheKey(collection)
        const data = localStorage.getItem(key)
        return data ? JSON.parse(data) : null
      }
    }
    return null
  } catch (error) {
    console.error(`Error getting cached collection data for ${collection}:`, error)
    return null
  }
}

// Replace the existing related collections functions with these more dynamic versions

/**
 * Get cached data for multiple related collections
 * @param {string[]} collections - Array of collection names
 * @param {number} cacheDuration - How long the cache is valid in milliseconds
 * @returns {Object|null} Object containing all collections' data or null if not found or expired
 */
export function getRelatedCollectionsFromCache(collections, cacheDuration = 5 * 60 * 1000) {
  try {
    // Check if we're in a browser environment
    if (typeof window === "undefined") {
      return null
    }

    // Validate input
    if (!Array.isArray(collections) || collections.length === 0) {
      console.error("Invalid collections parameter: must be a non-empty array")
      return null
    }

    // Generate cache keys for all collections
    const cacheKeys = collections.map((collection) => generateCacheKey(collection))

    // Check if primary collection cache is valid (we use the first collection as the reference)
    if (isCacheValid(collections[0], cacheDuration)) {
      const result = {}
      let allDataFound = true

      // Try to get data for all collections
      for (let i = 0; i < collections.length; i++) {
        const data = getCachedData(cacheKeys[i], cacheDuration)
        if (data) {
          result[collections[i].toLowerCase()] = data
        } else {
          allDataFound = false
          break
        }
      }

      if (allDataFound) {
        console.log(`Using cached data for collections: ${collections.join(", ")}`)
        return result
      }
    }

    return null
  } catch (e) {
    console.error("Error reading from cache:", e)
    return null
  }
}

/**
 * Save data for multiple related collections to cache
 * @param {string[]} collections - Array of collection names
 * @param {Array} collectionsData - Array of data for each collection (in same order as collections)
 * @returns {boolean} Whether the operation was successful
 */
export function saveRelatedCollectionsToCache(collections, collectionsData) {
  try {
    // Check if we're in a browser environment
    if (typeof window === "undefined") {
      return false
    }

    // Validate input
    if (
      !Array.isArray(collections) ||
      !Array.isArray(collectionsData) ||
      collections.length === 0 ||
      collections.length !== collectionsData.length
    ) {
      console.error("Invalid parameters: collections and collectionsData must be arrays of the same length")
      return false
    }

    // Save each collection's data to cache
    let allSaved = true
    for (let i = 0; i < collections.length; i++) {
      const cacheKey = generateCacheKey(collections[i])
      const saved = cacheData(cacheKey, collectionsData[i])
      if (!saved) {
        allSaved = false
      }
    }

    return allSaved
  } catch (e) {
    console.error("Error writing to cache:", e)
    return false
  }
}

/**
 * Clear cache for multiple related collections
 * @param {string[]} collections - Array of collection names
 * @returns {boolean} Whether the operation was successful
 */
export function clearRelatedCollectionsCache(collections) {
  try {
    // Check if we're in a browser environment
    if (typeof window === "undefined") {
      return false
    }

    // Validate input
    if (!Array.isArray(collections) || collections.length === 0) {
      console.error("Invalid collections parameter: must be a non-empty array")
      return false
    }

    // Clear cache for each collection
    let allCleared = true
    for (const collection of collections) {
      const cacheKey = generateCacheKey(collection)
      const cleared = clearCachedData(cacheKey)
      if (!cleared) {
        allCleared = false
      }
    }

    return allCleared
  } catch (e) {
    console.error("Error clearing cache:", e)
    return false
  }
}

