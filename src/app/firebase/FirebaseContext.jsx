"use client"

import { createContext, useContext, useState, useEffect } from "react"
import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
  limit,
} from "firebase/firestore"
import { db, auth } from "./config"
import { generateMockHourlyData } from "../utils/mockHourlyData"

const FirebaseContext = createContext(null)

export const useFirebase = () => useContext(FirebaseContext)

// Use the user's Dashboard collection
const DEVICE_COLLECTION_ID = "Dashboard"
const HOURLY_DATA_COLLECTION_ID = "HourlyData"

// Voltage threshold in watts
const VOLTAGE_THRESHOLD = 2000 // 2000W threshold

// Testing mode - set to true to force peak hour detection
const TESTING_MODE = true // Set to true for testing

// Mock mode - set to true to use mock data instead of Firebase
const MOCK_MODE = true // Set to true for development without Firebase

// Default voltages for devices if not set
export const DEFAULT_DEVICE_VOLTAGES = {
  // Living Room
  lamp: 60,
  heater: 1500,
  ceiling_fan: 75,
  pendant_lights: 120,
  sony_tv: 150,
  jbl_go_4: 30,
  epson_projector: 300,

  // Garage
  garage_door: 100,
  garage_lights: 100,
  washing_machine: 500,

  // Bedrooms
  bedside_lamp: 60,
  main_light: 60,
  ac: 1200, // AC uses a lot of power
  night_light: 20,
  smart_bed: 50,
  study_lamp: 60,

  // Other devices
  blinds: 25,
  door: 15,
}

// Mock devices data
const MOCK_DEVICES = {
  lamp: { isActive: true, voltage: 60, status: "On" },
  heater: { isActive: true, voltage: 1500, status: "On" },
  ceiling_fan: { isActive: false, voltage: 75, status: "Off" },
  pendant_lights: { isActive: true, voltage: 120, status: "On" },
  sony_tv: { isActive: true, voltage: 150, status: "On" },
  washing_machine: { isActive: true, voltage: 500, status: "On" },
  ac: { isActive: false, voltage: 1200, status: "Off" },
}

export const FirebaseProvider = ({ children }) => {
  const [loading, setLoading] = useState(true)
  const [devices, setDevices] = useState({})
  const [totalVoltage, setTotalVoltage] = useState(0)
  const [isPeakHour, setIsPeakHour] = useState(false)
  const [showVoltageAlert, setShowVoltageAlert] = useState(false)
  const [notificationHistory, setNotificationHistory] = useState([])
  const [hourlyData, setHourlyData] = useState({
    electricity: {},
    water: {},
  })
  const [firebaseError, setFirebaseError] = useState(null)

  // Load mock data if in mock mode
  useEffect(() => {
    if (MOCK_MODE) {
      console.log("Using mock data instead of Firebase")

      // Set mock devices
      setDevices(MOCK_DEVICES)

      // Set mock hourly data
      setHourlyData(generateMockHourlyData())

      // Finish loading
      setLoading(false)
    }
  }, [MOCK_MODE])

  // Load hourly data from Firebase if not in mock mode
  useEffect(() => {
    if (MOCK_MODE) return

    try {
      const hourlyDataRef = collection(db, HOURLY_DATA_COLLECTION_ID)
      const q = query(hourlyDataRef, orderBy("timestamp", "desc"), limit(24))

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const electricityData = {}
          const waterData = {}

          snapshot.forEach((doc) => {
            const data = doc.data()
            if (data.timestamp) {
              const hour = new Date(data.timestamp.toDate()).getHours()

              electricityData[hour] = data.electricity || 0
              waterData[hour] = data.water || 0
            }
          })

          setHourlyData({
            electricity: electricityData,
            water: waterData,
          })
        },
        (error) => {
          console.error("Error loading hourly data:", error)
          setFirebaseError(error.message)
          // Use mock data as fallback
          setHourlyData(generateMockHourlyData())
        },
      )

      return () => unsubscribe()
    } catch (error) {
      console.error("Error setting up hourly data listener:", error)
      setFirebaseError(error.message)
      // Use mock data as fallback
      setHourlyData(generateMockHourlyData())
    }
  }, [MOCK_MODE])

  // Check if current time is peak hour based on consumption data
  useEffect(() => {
    const checkPeakHour = () => {
      if (TESTING_MODE) {
        // Force peak hour detection in testing mode
        setIsPeakHour(true)
        return
      }

      const now = new Date()
      const currentHour = now.getHours()

      // We're specifically interested in 6 PM (18:00)
      if (currentHour === 18) {
        // Get electricity data for the current hour
        const currentElectricityUsage = hourlyData.electricity[currentHour] || 0
        const currentWaterUsage = hourlyData.water[currentHour] || 0

        // Find the maximum hourly usage
        const maxElectricityUsage = Math.max(...Object.values(hourlyData.electricity), 0)
        const maxWaterUsage = Math.max(...Object.values(hourlyData.water), 0)

        // Calculate if this is a peak hour
        const isElectricityPeak = currentElectricityUsage >= maxElectricityUsage * 0.9 // 90% of max is considered peak
        const isWaterPeak = currentWaterUsage >= maxWaterUsage * 0.9

        // Set peak hour if either electricity or water is at peak
        const isPeak = isElectricityPeak || isWaterPeak
        setIsPeakHour(isPeak)

        // For debugging
        console.log("Peak hour calculation:", {
          currentHour,
          currentElectricityUsage,
          maxElectricityUsage,
          isElectricityPeak,
          currentWaterUsage,
          maxWaterUsage,
          isWaterPeak,
          isPeak,
        })
      } else {
        setIsPeakHour(false)
      }
    }

    // Check immediately
    checkPeakHour()

    // Then check every minute
    const interval = setInterval(checkPeakHour, 60000)

    return () => clearInterval(interval)
  }, [hourlyData])

  // Load devices data from Firebase if not in mock mode
  useEffect(() => {
    if (MOCK_MODE) return

    try {
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
          setFirebaseError(error.message)
          // Use mock devices as fallback
          setDevices(MOCK_DEVICES)
          setLoading(false)
        },
      )

      return () => unsubscribe()
    } catch (error) {
      console.error("Error setting up devices listener:", error)
      setFirebaseError(error.message)
      // Use mock devices as fallback
      setDevices(MOCK_DEVICES)
      setLoading(false)
    }
  }, [MOCK_MODE])

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

      // Add to notification history
      const now = new Date()
      setNotificationHistory((prev) => [
        ...prev,
        {
          id: now.getTime(),
          timestamp: now,
          message: `Peak hour alert: Consumption of ${total}W exceeds threshold of ${VOLTAGE_THRESHOLD}W`,
          read: false,
        },
      ])
    } else {
      setShowVoltageAlert(false)
    }
  }, [devices, isPeakHour])

  // Function to update a device state
  const updateDeviceState = async (deviceId, newState) => {
    if (MOCK_MODE) {
      // Update mock devices directly
      setDevices((prev) => ({
        ...prev,
        [deviceId]: {
          ...prev[deviceId],
          ...newState,
          voltage: prev[deviceId]?.voltage || DEFAULT_DEVICE_VOLTAGES[deviceId] || 0,
        },
      }))
      return
    }

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
          voltage: newState.voltage || existingVoltage, // Use provided voltage or preserve existing
          updatedAt: serverTimestamp(),
        })
      } else {
        // Create new device document with default voltage
        await setDoc(deviceRef, {
          ...newState,
          voltage: newState.voltage || defaultVoltage,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      }

      // Update hourly data
      updateHourlyData()
    } catch (error) {
      console.error("Error updating device:", error)
      setFirebaseError(error.message)
    }
  }

  // Function to update hourly data
  const updateHourlyData = async () => {
    if (MOCK_MODE) {
      // In mock mode, just regenerate the hourly data
      setHourlyData(generateMockHourlyData())
      return
    }

    try {
      const now = new Date()
      const currentHour = now.getHours()
      const hourlyDataRef = doc(db, HOURLY_DATA_COLLECTION_ID, `hour-${currentHour}`)

      // Calculate total electricity and water usage
      let totalElectricity = 0
      let totalWater = 0

      Object.entries(devices).forEach(([deviceId, device]) => {
        if (device.isActive) {
          // Electricity calculation
          const voltage = device.voltage || DEFAULT_DEVICE_VOLTAGES[deviceId] || 0
          totalElectricity += voltage / 1000 // Convert to kWh

          // Water calculation (mock data for demonstration)
          if (deviceId.includes("washer") || deviceId.includes("water")) {
            totalWater += 10 // Add 10 liters for water-using devices
          }
        }
      })

      // Update or create hourly data document
      await setDoc(
        hourlyDataRef,
        {
          electricity: totalElectricity,
          water: totalWater,
          timestamp: serverTimestamp(),
        },
        { merge: true },
      )
    } catch (error) {
      console.error("Error updating hourly data:", error)
      setFirebaseError(error.message)
    }
  }

  // Function to update a device's voltage
  const updateDeviceVoltage = async (deviceId, voltage) => {
    if (MOCK_MODE) {
      // Update mock devices directly
      setDevices((prev) => ({
        ...prev,
        [deviceId]: {
          ...prev[deviceId],
          voltage: voltage,
        },
      }))
      return
    }

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

      // Update hourly data
      updateHourlyData()
    } catch (error) {
      console.error("Error updating device voltage:", error)
      setFirebaseError(error.message)
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

    // Add to notification history
    const now = new Date()
    setNotificationHistory((prev) => [
      ...prev,
      {
        id: now.getTime(),
        timestamp: now,
        message: `Peak hour alert: Consumption of ${totalVoltage}W exceeds threshold of ${VOLTAGE_THRESHOLD}W`,
        read: false,
      },
    ])
  }

  // Function to mark a notification as read
  const markNotificationAsRead = (notificationId) => {
    setNotificationHistory((prev) =>
      prev.map((notification) => (notification.id === notificationId ? { ...notification, read: true } : notification)),
    )
  }

  // Function to clear all notifications
  const clearAllNotifications = () => {
    setNotificationHistory([])
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
    notificationHistory,
    markNotificationAsRead,
    clearAllNotifications,
    hourlyData,
    updateHourlyData,
    firebaseError,
    auth,
  }

  return <FirebaseContext.Provider value={value}>{children}</FirebaseContext.Provider>
}

