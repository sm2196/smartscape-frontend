"use client"

import { useState, useEffect, useCallback } from "react"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "@/lib/firebase/config"

// In-memory cache to store data between component renders and navigation
const cache = new Map()

/**
 * Custom hook for fetching and caching Firestore data
 * @param {string} collectionName - Firestore collection name
 * @param {string} documentId - Document ID to fetch
 * @param {Object} options - Additional options
 * @param {boolean} options.localStorageCache - Whether to also cache in localStorage
 * @param {number} options.cacheDuration - How long to cache data in milliseconds (default: 5 minutes)
 * @param {Object} options.defaultData - Default data to use if no data is found
 * @returns {Object} - { data, loading, error, refetch, updateData }
 */
export function useFirestoreData(
  collectionName,
  documentId,
  {
    localStorageCache = false,
    cacheDuration = 5 * 60 * 1000, // 5 minutes
    defaultData = null,
  } = {},
) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Create a cache key based on collection and document ID
  const cacheKey = `${collectionName}/${documentId}`

  // Function to get data from cache
  const getFromCache = useCallback(() => {
    // Check in-memory cache first
    const cachedData = cache.get(cacheKey)

    if (cachedData && Date.now() - cachedData.timestamp < cacheDuration) {
      return cachedData.data
    }

    // If not in memory and localStorage caching is enabled, check localStorage
    if (localStorageCache) {
      try {
        const localData = localStorage.getItem(cacheKey)
        if (localData) {
          const parsedData = JSON.parse(localData)
          if (Date.now() - parsedData.timestamp < cacheDuration) {
            // Also update in-memory cache
            cache.set(cacheKey, {
              data: parsedData.data,
              timestamp: parsedData.timestamp,
            })
            return parsedData.data
          }
        }
      } catch (e) {
        console.error("Error reading from localStorage:", e)
      }
    }

    return null
  }, [cacheKey, cacheDuration, localStorageCache])

  // Function to save data to cache
  const saveToCache = useCallback(
    (data) => {
      const timestamp = Date.now()

      // Save to in-memory cache
      cache.set(cacheKey, { data, timestamp })

      // If localStorage caching is enabled, save there too
      if (localStorageCache) {
        try {
          localStorage.setItem(cacheKey, JSON.stringify({ data, timestamp }))
        } catch (e) {
          console.error("Error writing to localStorage:", e)
        }
      }
    },
    [cacheKey, localStorageCache],
  )

  // Function to fetch data from Firestore
  const fetchData = useCallback(
    async (skipCache = false) => {
      setLoading(true)

      try {
        // Check cache first if not skipping cache
        if (!skipCache) {
          const cachedData = getFromCache()
          if (cachedData) {
            setData(cachedData)
            setLoading(false)
            return cachedData
          }
        }

        // If no cached data or skipping cache, fetch from Firestore
        const docRef = doc(db, collectionName, documentId)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          const fetchedData = docSnap.data()
          setData(fetchedData)
          saveToCache(fetchedData)
          setError(null)
          return fetchedData
        } else if (defaultData) {
          // If document doesn't exist but we have default data, use and save it
          await setDoc(docRef, defaultData)
          setData(defaultData)
          saveToCache(defaultData)
          setError(null)
          return defaultData
        } else {
          setData(null)
          setError("Document does not exist")
          return null
        }
      } catch (err) {
        console.error(`Error fetching ${collectionName}/${documentId}:`, err)
        setError(err.message || "Failed to fetch data")
        return null
      } finally {
        setLoading(false)
      }
    },
    [collectionName, documentId, defaultData, getFromCache, saveToCache],
  )

  // Function to update data in Firestore and cache
  const updateData = useCallback(
    async (newData, merge = true) => {
      try {
        const docRef = doc(db, collectionName, documentId)

        // Update Firestore
        await setDoc(docRef, newData, { merge })

        // If merge is true, merge with existing data
        let updatedData
        if (merge && data) {
          updatedData = { ...data, ...newData }
        } else {
          updatedData = newData
        }

        // Update state and cache
        setData(updatedData)
        saveToCache(updatedData)

        return { success: true, data: updatedData }
      } catch (err) {
        console.error(`Error updating ${collectionName}/${documentId}:`, err)
        setError(err.message || "Failed to update data")
        return { success: false, error: err.message }
      }
    },
    [collectionName, documentId, data, saveToCache],
  )

  // Function to manually refetch data
  const refetch = useCallback(() => {
    return fetchData(true) // Skip cache when manually refetching
  }, [fetchData])

  // Function to clear cache for this document
  const clearCache = useCallback(() => {
    cache.delete(cacheKey)
    if (localStorageCache) {
      try {
        localStorage.removeItem(cacheKey)
      } catch (e) {
        console.error("Error removing from localStorage:", e)
      }
    }
  }, [cacheKey, localStorageCache])

  // Fetch data on mount and when dependencies change
  useEffect(() => {
    fetchData()

    // Cleanup function to handle component unmount
    return () => {
      // No cleanup needed for cache as we want to keep it
    }
  }, [fetchData])

  return { data, loading, error, refetch, updateData, clearCache }
}

// Utility function to clear all cache
export function clearAllCache() {
  // Clear in-memory cache
  cache.clear()

  // Clear localStorage cache for Firestore data
  try {
    const keys = Object.keys(localStorage)
    keys.forEach((key) => {
      if (key.includes("/")) {
        // Simple heuristic to identify Firestore cache keys
        localStorage.removeItem(key)
      }
    })
  } catch (e) {
    console.error("Error clearing localStorage cache:", e)
  }
}

