"use client"

import { useState, useEffect } from "react"
import { useFirebase } from "../firebase/FirebaseContext"

export function useDeviceState(deviceId, initialState) {
  const { getDeviceState, updateDeviceState, loading } = useFirebase()
  const [state, setState] = useState(initialState)
  const [initialized, setInitialized] = useState(false)

  // Load initial state from Firebase
  useEffect(() => {
    if (loading) return

    const storedState = getDeviceState(deviceId)
    if (storedState) {
      // Use the saved state from Firebase
      setState(storedState)
    } else {
      // If no stored state, save the initial state to Firebase
      updateDeviceState(deviceId, initialState)
    }

    setInitialized(true)
  }, [deviceId, loading, getDeviceState, updateDeviceState, initialState])

  // Function to update state both locally and in Firebase
  const updateState = (newState) => {
    const updatedState = { ...state, ...newState }
    setState(updatedState)
    updateDeviceState(deviceId, updatedState)
  }

  return [state, updateState, initialized]
}