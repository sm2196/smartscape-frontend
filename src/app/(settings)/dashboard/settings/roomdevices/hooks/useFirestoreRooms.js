"use client"

import { useState, useEffect, useCallback } from "react"
import { collection, query, where, getDocs, doc } from "firebase/firestore"
import { db } from "@/lib/firebase/config"

export const useFirestoreRooms = (userId) => {
  const [rooms, setRooms] = useState([])
  const [devices, setDevices] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchRooms = useCallback(async () => {
    try {
      if (!userId) {
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      // Fetch from Firestore directly without checking cache
      const roomsRef = collection(db, "Rooms")
      const q = query(roomsRef, where("userRef", "==", doc(db, "Users", userId)))
      const querySnapshot = await getDocs(q)

      const roomsData = []
      querySnapshot.forEach((doc) => {
        if (doc.exists()) {
          roomsData.push({
            id: doc.id,
            ...doc.data(),
          })
        }
      })

      setRooms(roomsData)

      // Fetch devices for each room
      const devicesByRoom = {}
      for (const room of roomsData) {
        if (!room.id) continue

        const devicesRef = collection(db, "Devices")
        const devicesQuery = query(devicesRef, where("roomRef", "==", doc(db, "Rooms", room.id)))
        const devicesSnapshot = await getDocs(devicesQuery)

        const roomDevices = []
        devicesSnapshot.forEach((deviceDoc) => {
          if (deviceDoc.exists()) {
            roomDevices.push({
              id: deviceDoc.id,
              ...deviceDoc.data(),
            })
          }
        })

        devicesByRoom[room.id] = roomDevices
      }

      setDevices(devicesByRoom)
      setError(null)
    } catch (error) {
      console.error("Error fetching rooms and devices: ", error)
      setError("Failed to load rooms and devices. Please try again.")
      setRooms([])
      setDevices({})
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    if (userId) {
      fetchRooms()
    } else {
      setLoading(false)
      setRooms([])
      setDevices({})
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

