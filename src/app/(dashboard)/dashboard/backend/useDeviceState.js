"use client"

import { useState, useEffect } from "react"
import { useFirebase } from "./FirebaseContext"

export function useDeviceState(deviceId, initialState) {
  const { devices, updateDeviceState, loading } = useFirebase()
  const [state, setState] = useState(initialState)
  const [initialized, setInitialized] = useState(false)

  // Load initial state from Firebase
  useEffect(() => {
    if (loading) return

    // Check if the device exists in the devices object
    if (devices && devices[deviceId]) {
      // Use the stored state from Firebase
      setState(devices[deviceId])
    } else {
      // If no stored state, save the initial state to Firebase
      updateDeviceState(deviceId, initialState)
    }

    setInitialized(true)
  }, [deviceId, loading, devices, updateDeviceState, initialState])

  // Function to update state both locally and in Firebase
  const updateState = (newState) => {
    const updatedState = { ...state, ...newState }
    setState(updatedState)
    updateDeviceState(deviceId, updatedState)
  }

  return [state, updateState, initialized]
}

