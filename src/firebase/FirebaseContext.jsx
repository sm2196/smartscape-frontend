"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { collection, doc, setDoc, getDoc, updateDoc, onSnapshot, serverTimestamp } from "firebase/firestore"
import { db } from "./config"

const FirebaseContext = createContext(null)

export const useFirebase = () => useContext(FirebaseContext)

// Use the user's Dashboard collection
const DEVICE_COLLECTION_ID = "Dashboard"

export const FirebaseProvider = ({ children }) => {
  const [loading, setLoading] = useState(true)
  const [devices, setDevices] = useState({})

  // Load devices data without authentication
  useEffect(() => {
    const devicesRef = collection(db, DEVICE_COLLECTION_ID)

    // Create a listener for real-time updates
    const unsubscribe = onSnapshot(
      devicesRef,
      (snapshot) => {
        const devicesData = {}
        snapshot.forEach((doc) => {
          devicesData[doc.id] = doc.data()
        })
        setDevices(devicesData)
        setLoading(false)
      },
      (error) => {
        console.error("Error loading devices:", error)
        setLoading(false)
      },
    )

    return () => unsubscribe()
  }, [])

  // Function to update a device state
  const updateDeviceState = async (deviceId, newState) => {
    try {
      const deviceRef = doc(db, DEVICE_COLLECTION_ID, deviceId)
      const deviceDoc = await getDoc(deviceRef)

      // Remove any fields with undefined values
      const validState = Object.fromEntries(
        Object.entries(newState).filter(([_, value]) => value !== undefined)
      )

      if (deviceDoc.exists()) {
        // Update existing device
        await updateDoc(deviceRef, {
          ...validState,
          updatedAt: serverTimestamp(),
        })
      } else {
        // Create new device document
        await setDoc(deviceRef, {
          ...validState,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      }
    } catch (error) {
      console.error("Error updating device:", error)
    }
  }

  // Function to get a device state
  const getDeviceState = (deviceId) => {
    return devices[deviceId] || null
  }

  const value = {
    loading,
    devices,
    updateDeviceState,
    getDeviceState,
  }

  return <FirebaseContext.Provider value={value}>{children}</FirebaseContext.Provider>
}

