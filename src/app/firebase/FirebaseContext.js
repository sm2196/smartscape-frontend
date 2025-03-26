"use client"

import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react"
import { collection, getDocs, doc, updateDoc, onSnapshot } from "firebase/firestore"
import { db, auth } from "./config"
import { generateMockHourlyData } from "../utils/mockHourlyData"

// Create context
const FirebaseContext = createContext()

// Map to store device document IDs to our local device IDs
const deviceDocToLocalId = new Map()
// Map to store room document IDs to room names
const roomIdToName = new Map()

// Mock mode - set to false to use real Firebase data
const MOCK_MODE = false

// Mock devices data (only used if MOCK_MODE is true)
const MOCK_DEVICES = {
  living_lamp: {
    deviceName: "Living Room Lamp",
    isActive: true,
    voltage: 60,
    status: "On",
    statusColor: "#4ade80",
    deviceType: "Light",
    deviceIcon: "lamp",
  },
  living_heater: {
    deviceName: "Living Room Heater",
    isActive: true,
    voltage: 1500,
    status: "On",
    statusColor: "#4ade80",
    deviceType: "Heater",
    deviceIcon: "heater",
  },
  living_fan: {
    deviceName: "Living Room Fan",
    isActive: false,
    voltage: 75,
    status: "Off",
    statusColor: "#ef4444",
    deviceType: "Fan",
    deviceIcon: "fan",
  },
  living_lights: {
    deviceName: "Living Room Lights",
    isActive: true,
    voltage: 120,
    status: "On",
    statusColor: "#4ade80",
    deviceType: "Light",
    deviceIcon: "lightbulb",
  },
  living_tv: {
    deviceName: "Living Room TV",
    isActive: true,
    voltage: 150,
    status: "On",
    statusColor: "#4ade80",
    deviceType: "TV",
    deviceIcon: "tv",
  },
  garage_freezer: {
    deviceName: "Garage Freezer",
    isActive: true,
    voltage: 700,
    status: "On",
    statusColor: "#4ade80",
    deviceType: "Freezer",
    deviceIcon: "refrigerator",
  },
  kids_water_heater: {
    deviceName: "Kids Room Water Heater",
    isActive: false,
    voltage: 1200,
    status: "Off",
    statusColor: "#ef4444",
    deviceType: "Heater",
    deviceIcon: "heater",
  },
}

// Provider component
export const FirebaseProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [devices, setDevices] = useState({})
  const [rooms, setRooms] = useState([])
  const [totalVoltage, setTotalVoltage] = useState(0)
  const [isPeakHour, setIsPeakHour] = useState(false)
  const [showVoltageAlert, setShowVoltageAlert] = useState(false)
  const [notificationHistory, setNotificationHistory] = useState([])
  const [hourlyData, setHourlyData] = useState({
    electricity: {},
    water: {},
  })
  const [loading, setLoading] = useState(true)
  const [firebaseError, setFirebaseError] = useState(null)
  const VOLTAGE_THRESHOLD = 2000

  // Use refs to track if data is already loaded and prevent duplicate fetches
  const isInitialLoadDone = useRef(false)
  const isListenerActive = useRef(false)
  const updateQueue = useRef({})
  const updateTimeoutRef = useRef(null)

  // Load mock data if in mock mode
  useEffect(() => {
    if (MOCK_MODE) {
      console.log("Using mock data instead of Firebase")

      // Set mock devices
      setDevices(MOCK_DEVICES)

      // Set mock hourly data
      setHourlyData(generateMockHourlyData())

      // Calculate total voltage for mock devices
      calculateTotalVoltage(MOCK_DEVICES)

      // Finish loading
      setLoading(false)
      isInitialLoadDone.current = true
    }
  }, [])

  // Set up auth state listener
  useEffect(() => {
    if (MOCK_MODE) return

    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser)
      if (!authUser && !MOCK_MODE) {
        // Reset state when user logs out
        setDevices({})
        setRooms([])
        deviceDocToLocalId.clear()
        roomIdToName.clear()
        isInitialLoadDone.current = false
        isListenerActive.current = false
      }
    })

    return () => unsubscribe()
  }, [])

  // Calculate total voltage based on active devices
  const calculateTotalVoltage = useCallback(
    (currentDevices) => {
      const devicesToUse = currentDevices || devices
      let total = 0

      Object.values(devicesToUse).forEach((device) => {
        if (device.isActive) {
          total += device.voltage || 0
        }
      })

      setTotalVoltage(total)

      // Check if we're in peak hour and over threshold
      const hour = new Date().getHours()
      const isPeak = hour >= 18 && hour <= 20 // 6PM-8PM

      if (isPeak && total > VOLTAGE_THRESHOLD) {
        setIsPeakHour(true)
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
        setIsPeakHour(isPeak)
        setShowVoltageAlert(false)
      }
    },
    [devices, VOLTAGE_THRESHOLD],
  )

  // Extract ID from DocRef objects
  const getIdFromRef = (roomRef) => {
    if (!roomRef) return null
    const segments = roomRef._key.path.segments
    return segments.length > 0 ? segments[segments.length - 1] : null
  }

  // Fetch rooms and devices from Firestore
  const fetchRoomsAndDevices = useCallback(async () => {
    if (MOCK_MODE) return

    try {
      setLoading(true)

      // If no user is logged in, use mock data
      if (!user) {
        console.log("No user logged in, using mock data")
        setDevices(MOCK_DEVICES)
        setHourlyData(generateMockHourlyData())
        calculateTotalVoltage(MOCK_DEVICES)
        setLoading(false)
        return
      }

      // Clear maps before fetching
      deviceDocToLocalId.clear()
      roomIdToName.clear()

      // Fetch devices directly from the Dashboard collection
      const devicesRef = collection(db, "Dashboard")
      const devicesSnapshot = await getDocs(devicesRef)

      const devicesData = {}
      devicesSnapshot.forEach((deviceDoc) => {
        const deviceId = deviceDoc.id
        const deviceData = deviceDoc.data()

        // Store only the necessary data in the devices state
        devicesData[deviceId] = {
          isActive: deviceData.isActive || false,
          status: deviceData.isActive ? "On" : "Off",
          statusColor: deviceData.isActive ? "#4ade80" : "#ef4444",
          voltage: deviceData.voltage || 0,
        }
      })

      setDevices(devicesData)
      calculateTotalVoltage(devicesData)

      // Also set hourly data
      setHourlyData(generateMockHourlyData())

      isInitialLoadDone.current = true
      setLoading(false)
    } catch (error) {
      console.error("Error fetching devices:", error)
      setFirebaseError(error.message)

      // Use mock data as fallback
      setDevices(MOCK_DEVICES)
      setHourlyData(generateMockHourlyData())
      calculateTotalVoltage(MOCK_DEVICES)

      setLoading(false)
    }
  }, [user, calculateTotalVoltage])

  // Update device state in Firestore and local state
  const updateDeviceState = useCallback(
    async (deviceId, newState) => {
      if (MOCK_MODE) {
        // Update mock devices directly
        setDevices((prev) => ({
          ...prev,
          [deviceId]: {
            ...prev[deviceId],
            ...newState,
          },
        }))

        // Recalculate total voltage
        setTimeout(() => {
          calculateTotalVoltage()
        }, 0)

        return
      }

      try {
        // Update in Firestore
        const deviceRef = doc(db, "Dashboard", deviceId)
        await updateDoc(deviceRef, newState)

        // Update local state
        setDevices((prev) => ({
          ...prev,
          [deviceId]: {
            ...prev[deviceId],
            ...newState,
          },
        }))

        // Recalculate total voltage
        setTimeout(() => {
          calculateTotalVoltage()
        }, 0)
      } catch (error) {
        console.error("Error updating device state:", error)
        setFirebaseError(error.message)
      }
    },
    [calculateTotalVoltage],
  )

  // Update device's voltage
  const updateDeviceVoltage = useCallback(
    async (deviceId, voltage) => {
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
        // Update in Firestore
        const deviceRef = doc(db, "Dashboard", deviceId)
        await updateDoc(deviceRef, { voltage })

        // Update local state
        setDevices((prev) => ({
          ...prev,
          [deviceId]: {
            ...prev[deviceId],
            voltage: voltage,
          },
        }))

        // Recalculate total voltage
        setTimeout(() => {
          calculateTotalVoltage()
        }, 0)
      } catch (error) {
        console.error("Error updating device voltage:", error)
        setFirebaseError(error.message)
      }
    },
    [calculateTotalVoltage],
  )

  // Function to get a device state
  const getDeviceState = useCallback(
    (deviceId) => {
      return devices[deviceId] || null
    },
    [devices],
  )

  // Trigger voltage alert
  const triggerVoltageAlert = useCallback(() => {
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
  }, [totalVoltage, VOLTAGE_THRESHOLD])

  // Dismiss voltage alert
  const dismissVoltageAlert = useCallback(() => {
    setShowVoltageAlert(false)
  }, [])

  // Function to mark a notification as read
  const markNotificationAsRead = useCallback((notificationId) => {
    setNotificationHistory((prev) =>
      prev.map((notification) => (notification.id === notificationId ? { ...notification, read: true } : notification)),
    )
  }, [])

  // Function to clear all notifications
  const clearAllNotifications = useCallback(() => {
    setNotificationHistory([])
  }, [])

  // Set up real-time listeners for devices
  useEffect(() => {
    if (MOCK_MODE) return

    // Set up a single listener for the Dashboard collection
    const devicesRef = collection(db, "Dashboard")

    const unsubscribe = onSnapshot(
      devicesRef,
      (snapshot) => {
        let needsUpdate = false
        const updatedDevices = { ...devices }

        snapshot.docChanges().forEach((change) => {
          const deviceId = change.doc.id
          const newData = change.doc.data()

          if (change.type === "modified" || change.type === "added") {
            updatedDevices[deviceId] = {
              ...updatedDevices[deviceId],
              isActive: newData.isActive || false,
              status: newData.isActive ? "On" : "Off",
              statusColor: newData.isActive ? "#4ade80" : "#ef4444",
              voltage: newData.voltage || 0,
            }
            needsUpdate = true
          }
        })

        if (needsUpdate) {
          setDevices(updatedDevices)
          calculateTotalVoltage(updatedDevices)
        }
      },
      (error) => {
        console.error("Error in device listener:", error)
        setFirebaseError(error.message)
      },
    )

    isListenerActive.current = true

    return () => {
      unsubscribe()
      isListenerActive.current = false
    }
  }, [devices, calculateTotalVoltage])

  // Initial data fetch
  useEffect(() => {
    // Fetch data on initial load
    if (!isInitialLoadDone.current) {
      fetchRoomsAndDevices()
    }

    // Add a safety timeout to prevent getting stuck in loading state
    const safetyTimer = setTimeout(() => {
      if (loading) {
        console.log("Safety timeout triggered - forcing loading to complete")
        setLoading(false)

        // If we're still loading after timeout, use mock data as fallback
        if (Object.keys(devices).length === 0) {
          console.log("No devices loaded, using mock devices")
          setDevices(MOCK_DEVICES)
          setHourlyData(generateMockHourlyData())
          calculateTotalVoltage(MOCK_DEVICES)
        }

        isInitialLoadDone.current = true
      }
    }, 5000) // 5 second timeout

    return () => clearTimeout(safetyTimer)
  }, [fetchRoomsAndDevices, loading, devices, calculateTotalVoltage])

  // Function to update hourly data
  const updateHourlyData = useCallback(() => {
    // Just regenerate mock data for now
    setHourlyData(generateMockHourlyData())
  }, [])

  const value = {
    loading,
    devices,
    rooms,
    totalVoltage,
    isPeakHour,
    showVoltageAlert,
    updateDeviceState,
    getDeviceState,
    updateDeviceVoltage,
    triggerVoltageAlert,
    dismissVoltageAlert,
    VOLTAGE_THRESHOLD,
    notificationHistory,
    markNotificationAsRead,
    clearAllNotifications,
    hourlyData,
    updateHourlyData,
    firebaseError,
    fetchRoomsAndDevices,
    auth,
  }

  return <FirebaseContext.Provider value={value}>{children}</FirebaseContext.Provider>
}

// Custom hook to use the Firebase context
export const useFirebase = () => {
  const context = useContext(FirebaseContext)
  if (!context) {
    throw new Error("useFirebase must be used within a FirebaseProvider")
  }
  return context
}

