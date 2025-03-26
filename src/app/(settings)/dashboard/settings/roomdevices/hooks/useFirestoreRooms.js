import { useState, useEffect, useCallback } from "react"
import { collection, query, where, getDocs, doc } from "firebase/firestore"
import { db } from "@/lib/firebase/config"
import { getRelatedCollectionsFromCache, saveRelatedCollectionsToCache } from "@/lib/cacheUtils"

// Add these constants for cache keys and expiration time
const CACHE_EXPIRATION = 30 * 60 * 1000 // 30 minutes in milliseconds

// Define the collections array
const CACHE_COLLECTIONS = ["Rooms", "Devices"]

export const useFirestoreRooms = (userId) => {
  const [rooms, setRooms] = useState([])
  const [devices, setDevices] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchRooms = useCallback(
    async (skipCache = false) => {
      try {
        if (!userId) return

        // Check cache first if not skipping cache
        if (!skipCache) {
          const cachedData = getRelatedCollectionsFromCache(CACHE_COLLECTIONS, CACHE_EXPIRATION)
          if (cachedData) {
            setRooms(cachedData.rooms)
            setDevices(cachedData.devices)
            setError(null)
            setLoading(false)
            return
          }
        }

        setLoading(true)

        // Fetch from Firestore if cache is invalid or we're skipping cache
        const roomsRef = collection(db, "Rooms")
        const q = query(roomsRef, where("userRef", "==", doc(db, "Users", userId)))
        const querySnapshot = await getDocs(q)

        const roomsData = []
        querySnapshot.forEach((doc) => {
          roomsData.push({
            id: doc.id,
            ...doc.data(),
          })
        })

        setRooms(roomsData)

        // Fetch devices for each room
        const devicesByRoom = {}
        for (const room of roomsData) {
          const devicesRef = collection(db, "Devices")
          const devicesQuery = query(devicesRef, where("roomRef", "==", doc(db, "Rooms", room.id)))
          const devicesSnapshot = await getDocs(devicesQuery)

          const roomDevices = []
          devicesSnapshot.forEach((deviceDoc) => {
            roomDevices.push({
              id: deviceDoc.id,
              ...deviceDoc.data(),
            })
          })

          devicesByRoom[room.id] = roomDevices
        }

        setDevices(devicesByRoom)
        setError(null)

        // Update cache with fresh data
        saveRelatedCollectionsToCache(CACHE_COLLECTIONS, [roomsData, devicesByRoom])
      } catch (error) {
        console.error("Error fetching rooms and devices: ", error)
        setError("Failed to load rooms and devices. Please try again.")
      } finally {
        setLoading(false)
      }
    },
    [userId]
  )

  useEffect(() => {
    if (userId) {
      fetchRooms()
    }
  }, [fetchRooms, userId])

  return {
    rooms,
    setRooms,
    devices,
    setDevices,
    loading,
    error,
    fetchRooms,
  }
}
