"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { collection, doc, setDoc, getDoc, updateDoc, onSnapshot, serverTimestamp } from "firebase/firestore"
import { db } from "./config"

const FirebaseContext = createContext(null)

export const useFirebase = () => useContext(FirebaseContext)

// Use the user's Dashboard collection
const DEVICE_COLLECTION_ID = "Dashboard"

// Voltage threshold in watts
const VOLTAGE_THRESHOLD = 2000 // 2000W threshold

// Testing mode - set to true to force peak hour detection
const TESTING_MODE = false

// Default voltages for devices if not set
export const DEFAULT_DEVICE_VOLTAGES = {
  // Living Room
  living_lamp: 60,
  living_heater: 1500,
  living_fan: 75,
  living_lights: 120,
  living_tv: 150,
  living_speaker: 30,
  living_projector: 300,

  // Garage
  garage_lights: 100,
  garage_freezer: 700,
  garage_washer: 500,

  // Bedrooms
  master_lamp: 60,
  guest_light: 60,
  kids_water_heater: 1200, // Water heater uses a lot of power
  kids_lamp: 60,

  // Other devices
  front_notifications: 5,
}

export const FirebaseProvider = ({ children }) => {
  const [loading, setLoading] = useState(true)
  const [devices, setDevices] = useState({})
  const [totalVoltage, setTotalVoltage] = useState(0)
  const [isPeakHour, setIsPeakHour] = useState(false)
  const [showVoltageAlert, setShowVoltageAlert] = useState(false)

  // Check if current time is peak hour (6pm-8pm)
  useEffect(() => {
    const checkPeakHour = () => {
      if (TESTING_MODE) {
        // Force peak hour detection in testing mode
        setIsPeakHour(true)
      } else {
        const now = new Date()
        const hour = now.getHours()
        const isPeak = hour >= 18 && hour < 20 // 6pm-8pm
        setIsPeakHour(isPeak)
      }
    }

    // Check immediately
    checkPeakHour()

    // Then check every minute
    const interval = setInterval(checkPeakHour, 60000)

    return () => clearInterval(interval)
  }, [])

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

  // Calculate total voltage whenever devices change
  useEffect(() => {
    let total = 0

    Object.entries(devices).forEach(([deviceId, device]) => {
      // Only count active devices
      if (device.isActive) {
        // Use the device's voltage or the default if not set
        const voltage = device.voltage || DEFAULT_DEVICE_VOLTAGES[deviceId] || 0
        total += voltage
      }
    })

    setTotalVoltage(total)

    // Show alert if it's peak hour and voltage exceeds threshold
    if (isPeakHour && total > VOLTAGE_THRESHOLD) {
      setShowVoltageAlert(true)
    } else {
      setShowVoltageAlert(false)
    }
  }, [devices, isPeakHour])

  // Function to update a device state
  const updateDeviceState = async (deviceId, newState) => {
    try {
      const deviceRef = doc(db, DEVICE_COLLECTION_ID, deviceId)
      const deviceDoc = await getDoc(deviceRef)

      // Get the default voltage for this device
      const defaultVoltage = DEFAULT_DEVICE_VOLTAGES[deviceId] || 0

      if (deviceDoc.exists()) {
        // Get existing voltage if it exists
        const existingVoltage = deviceDoc.data().voltage || defaultVoltage

        // Update existing device
        await updateDoc(deviceRef, {
          ...newState,
          voltage: existingVoltage, // Preserve existing voltage
          updatedAt: serverTimestamp(),
        })
      } else {
        // Create new device document with default voltage
        await setDoc(deviceRef, {
          ...newState,
          voltage: defaultVoltage,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      }
    } catch (error) {
      console.error("Error updating device:", error)
    }
  }

  // Function to update a device's voltage
  const updateDeviceVoltage = async (deviceId, voltage) => {
    try {
      const deviceRef = doc(db, DEVICE_COLLECTION_ID, deviceId)
      const deviceDoc = await getDoc(deviceRef)

      if (deviceDoc.exists()) {
        // Update existing device with new voltage
        await updateDoc(deviceRef, {
          voltage: voltage,
          updatedAt: serverTimestamp(),
        })
      } else {
        // Create new device document with provided voltage
        await setDoc(deviceRef, {
          voltage: voltage,
          isActive: false,
          status: "Off",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      }
    } catch (error) {
      console.error("Error updating device voltage:", error)
    }
  }

  // Function to get a device state
  const getDeviceState = (deviceId) => {
    return devices[deviceId] || null
  }

  // Function to dismiss the voltage alert
  const dismissVoltageAlert = () => {
    setShowVoltageAlert(false)
  }

  // Function to manually trigger the voltage alert (for testing)
  const triggerVoltageAlert = () => {
    setShowVoltageAlert(true)
  }

  const value = {
    loading,
    devices,
    updateDeviceState,
    getDeviceState,
    updateDeviceVoltage,
    totalVoltage,
    isPeakHour,
    showVoltageAlert,
    dismissVoltageAlert,
    triggerVoltageAlert,
    VOLTAGE_THRESHOLD,
  }

  return <FirebaseContext.Provider value={value}>{children}</FirebaseContext.Provider>
}