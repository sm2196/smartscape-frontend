"use client"

import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react"
import { collection, query, where, getDocs, getDoc, doc, updateDoc, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase/config"
import { useAuth } from "@/hooks/useAuth"

// Create context
const FirebaseContext = createContext()

// Map to store device document IDs to our local device IDs
const deviceDocToLocalId = new Map()
// Map to store room document IDs to room names
const roomIdToName = new Map()

// Provider component
export const FirebaseProvider = ({ children }) => {
  const { user } = useAuth()
  const [devices, setDevices] = useState({})
  const [rooms, setRooms] = useState([])
  const [totalVoltage, setTotalVoltage] = useState(0)
  const [isPeakHour, setIsPeakHour] = useState(false)
  const [showVoltageAlert, setShowVoltageAlert] = useState(false)
  const VOLTAGE_THRESHOLD = 2000

  // Use refs to track if data is already loaded and prevent duplicate fetches
  const isInitialLoadDone = useRef(false)
  const isListenerActive = useRef(false)
  const updateQueue = useRef({})
  const updateTimeoutRef = useRef(null)

  // Debounce updates to prevent rapid consecutive updates
  const processUpdateQueue = useCallback(() => {
    if (Object.keys(updateQueue.current).length === 0) return

    const updatedDevices = { ...devices }
    let hasChanges = false

    // Process all queued updates
    Object.entries(updateQueue.current).forEach(([deviceId, newState]) => {
      if (
        JSON.stringify(updatedDevices[deviceId]) !==
        JSON.stringify({ ...updatedDevices[deviceId], ...newState })
      ) {
        updatedDevices[deviceId] = {
          ...updatedDevices[deviceId],
          ...newState,
        }
        hasChanges = true
      }
    })

    // Only update state if there are actual changes
    if (hasChanges) {
      setDevices(updatedDevices)
      calculateTotalVoltage(updatedDevices)
    }

    // Clear the queue
    updateQueue.current = {}
  }, [devices])

  // Extract ID from DocRef objects
  const getIdFromRef = (roomRef) => {
    if (!roomRef) return null
    const segments = roomRef._key.path.segments
    return segments.length > 0 ? segments[segments.length - 1] : null
  }

  // Fetch rooms and devices from Firestore
  const fetchRoomsAndDevices = useCallback(async () => {
    if (!user || isInitialLoadDone.current) return;

    try {
      // Clear maps before fetching
      deviceDocToLocalId.clear();
      roomIdToName.clear();

      let effectiveUserId;

      // Fetch the user's document to get the adminRef field
      const userDocSnap = await getDoc(doc(db, "Users", user.uid));
      if (userDocSnap.exists()) {
        // Ensure adminRef is a simple doc id, not a full path.
        const adminRefRaw = userDocSnap.data().adminRef;
        if (adminRefRaw) effectiveUserId = getIdFromRef(adminRefRaw);
        else effectiveUserId = user.uid;
      } else {
        console.error("User document does not exist!");
        return;
      }

      // Build the user document reference using the effective id
      const userDocRef = doc(db, "Users", effectiveUserId);

      // Fetch rooms for the current user (or admin)
      const roomsRef = collection(db, "Rooms");
      const roomsQuery = query(roomsRef, where("userRef", "==", userDocRef));
      const roomsSnapshot = await getDocs(roomsQuery);

      const roomsData = [];
      roomsSnapshot.forEach((roomDoc) => {
        const roomData = {
          id: roomDoc.id,
          ...roomDoc.data(),
        };
        roomsData.push(roomData);

        // Store room name for later use
        roomIdToName.set(roomDoc.id, roomData.roomName);
      });
      setRooms(roomsData);

      // Fetch devices for each room
      const devicesData = {};
      for (const room of roomsData) {
        const devicesRef = collection(db, "Devices");
        const devicesQuery = query(
          devicesRef,
          where("roomRef", "==", doc(db, "Rooms", room.id))
        );
        const devicesSnapshot = await getDocs(devicesQuery);

        devicesSnapshot.forEach((deviceDoc) => {
          const deviceData = deviceDoc.data();
          // Create a unique ID for the device that includes room info
          const deviceId = `${room.id.substring(0, 4)}_${deviceDoc.id.substring(
            0,
            8
          )}`;

          // Store mapping for future reference
          deviceDocToLocalId.set(deviceDoc.id, deviceId);

          // Store only the necessary data in the devices state
          devicesData[deviceId] = {
            deviceName: deviceData.deviceName,
            status: deviceData.status || "Off",
            isActive: deviceData.isActive || false,
            statusColor: deviceData.statusColor || "",
            voltage: deviceData.voltage || 0,
            deviceType: deviceData.deviceType || "",
            deviceIcon: deviceData.deviceIcon || "",
            roomRef: deviceData.roomRef || null,
          };
        });
      }

      setDevices(devicesData);
      calculateTotalVoltage(devicesData);
      isInitialLoadDone.current = true;
    } catch (error) {
      console.error("Error fetching rooms and devices:", error);
    }
  }, [user]);

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

      // Check if we're in peak hour (over threshold)
      if (total > VOLTAGE_THRESHOLD) {
        setIsPeakHour(true)
      } else {
        setIsPeakHour(false)
      }
    },
    [devices, VOLTAGE_THRESHOLD]
  )

  // Update device state in Firestore and local state
  const updateDeviceState = useCallback(
    async (deviceId, newState) => {
      try {
        // Find the Firestore document ID for this device
        const deviceDocId = Array.from(deviceDocToLocalId.entries()).find(
          ([_, localId]) => localId === deviceId
        )?.[0]

        if (!deviceDocId) {
          console.error("Device document ID not found for:", deviceId)
          return
        }

        // Update in Firestore
        const deviceRef = doc(db, "Devices", deviceDocId)
        await updateDoc(deviceRef, newState)

        // Queue the update instead of immediately updating state
        updateQueue.current[deviceId] = newState

        // Debounce the state update
        if (updateTimeoutRef.current) {
          clearTimeout(updateTimeoutRef.current)
        }

        updateTimeoutRef.current = setTimeout(() => {
          processUpdateQueue()
          updateTimeoutRef.current = null
        }, 300) // 300ms debounce
      } catch (error) {
        console.error("Error updating device state:", error)
      }
    },
    [processUpdateQueue]
  )

  // Trigger voltage alert
  const triggerVoltageAlert = useCallback(() => {
    setShowVoltageAlert(true)
  }, [])

  // Dismiss voltage alert
  const dismissVoltageAlert = useCallback(() => {
    setShowVoltageAlert(false)
  }, [])

  // Set up real-time listeners for devices
  useEffect(() => {
    if (!user || !isInitialLoadDone.current || isListenerActive.current) return

    // Set up a single listener for the Devices collection
    const devicesRef = collection(db, "Devices")

    const unsubscribe = onSnapshot(
      devicesRef,
      (snapshot) => {
        let needsUpdate = false
        const updatedDevices = { ...devices }

        snapshot.docChanges().forEach((change) => {
          const deviceDocId = change.doc.id
          const localDeviceId = deviceDocToLocalId.get(deviceDocId)

          if (
            localDeviceId &&
            (change.type === "modified" || change.type === "added")
          ) {
            const newData = change.doc.data()

            // Only update if there's an actual change
            const currentDevice = devices[localDeviceId]
            if (
              currentDevice &&
              (currentDevice.isActive !== newData.isActive ||
                currentDevice.status !== newData.status ||
                currentDevice.statusColor !== newData.statusColor)
            ) {
              updatedDevices[localDeviceId] = {
                ...currentDevice,
                isActive: newData.isActive,
                status: newData.status,
                statusColor: newData.statusColor,
              }
              needsUpdate = true
            }
          }
        })

        if (needsUpdate) {
          setDevices(updatedDevices)
          calculateTotalVoltage(updatedDevices)
        }
      },
      (error) => {
        console.error("Error in device listener:", error)
      }
    )

    isListenerActive.current = true

    return () => {
      unsubscribe()
      isListenerActive.current = false
    }
  }, [user, devices, calculateTotalVoltage, isInitialLoadDone])

  // Initial data fetch
  useEffect(() => {
    if (user && !isInitialLoadDone.current) {
      fetchRoomsAndDevices()
    }

    // Reset state when user changes
    if (!user) {
      setDevices({})
      setRooms([])
      deviceDocToLocalId.clear()
      roomIdToName.clear()
      isInitialLoadDone.current = false
      isListenerActive.current = false
    }
  }, [user, fetchRoomsAndDevices])

  // Simulate peak hours based on time of day (for demo purposes)
  useEffect(() => {
    const checkPeakHour = () => {
      const hour = new Date().getHours()
      // Peak hours: 7-9 AM and 6-8 PM
      const isPeak = (hour >= 7 && hour <= 9) || (hour >= 18 && hour <= 20)
      setIsPeakHour(isPeak)
    }

    checkPeakHour()
    const interval = setInterval(checkPeakHour, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [])

  // Helper function to get room name from roomRef
  const getRoomNameFromRef = useCallback((roomRef) => {
    const roomId = getIdFromRef(roomRef)
    return roomId ? roomIdToName.get(roomId) : "Unknown Room"
  }, [])

  return (
    <FirebaseContext.Provider
      value={{
        devices,
        rooms,
        totalVoltage,
        isPeakHour,
        showVoltageAlert,
        updateDeviceState,
        triggerVoltageAlert,
        dismissVoltageAlert,
        VOLTAGE_THRESHOLD,
        fetchRoomsAndDevices,
        getRoomNameFromRef,
        getIdFromRef,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  )
}

// Custom hook to use the Firebase context
export const useFirebase = () => {
  const context = useContext(FirebaseContext)
  if (!context) {
    throw new Error("useFirebase must be used within a FirebaseProvider")
  }
  return context
}
