"use client"

import { useState, useEffect, useCallback } from "react"
import { MdChevronRight, MdAdd, MdHome, MdDevicesOther, MdClose, MdDelete, MdError } from "react-icons/md"
import { collection, query, where, getDocs, deleteDoc, doc, addDoc } from "firebase/firestore"
import { useAuth } from "@/hooks/useAuth"
import { db } from "@/lib/firebase/config"
import styles from "./RoomDeviceManagement.module.css"
import { useFirestoreData } from "@/hooks/useFirestoreData"
import {
  getUserId,
  getRelatedCollectionsFromCache,
  saveRelatedCollectionsToCache,
  clearRelatedCollectionsCache,
} from "@/lib/cacheUtils"

// Add these constants for cache keys and expiration time
const CACHE_EXPIRATION = 30 * 60 * 1000 // 30 minutes in milliseconds

const DeviceManagement = () => {
  const [popupType, setPopupType] = useState(null)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [newRoomName, setNewRoomName] = useState("")
  const [rooms, setRooms] = useState([])
  const [newDeviceCategory, setNewDeviceCategory] = useState("")
  const [newDeviceName, setNewDeviceName] = useState("")
  const [devices, setDevices] = useState({})
  const [selectedDevice, setSelectedDevice] = useState(null)
  const [error, setError] = useState(null)
  const [userId, setUserId] = useState(null)

  // Change the auth hook usage at the top of the component
  const { user, loading: authLoading } = useAuth()

  // Use useEffect to get userId on client-side only
  useEffect(() => {
    // Get user ID with priority from cache first, then from auth object
    setUserId(getUserId(user))
  }, [user])

  // Update the useFirestoreData hook to handle the case when userId is null
  const {
    loading: dataLoading,
    error: dataError,
  } = useFirestoreData("Users", userId, {
    localStorageCache: true,
    cacheDuration: 30 * 60 * 1000, // Cache for 30 minutes
    defaultData: {},
  })

  // Instead, directly use the error from the hook:
  useEffect(() => {
    if (dataError) {
      setError(dataError)
    }
  }, [dataError])

  // Add this loading state determination
  const isLoading = (authLoading && !userId) || (userId && dataLoading)

  // Replace the fetchRooms function with this updated version
  const fetchRooms = useCallback(
    async (skipCache = false) => {
      try {
        if (!user || !userId) return

        // Check cache first if not skipping cache
        if (!skipCache) {
          const cachedData = getRelatedCollectionsFromCache("Rooms", "Devices", CACHE_EXPIRATION)
          if (cachedData) {
            setRooms(cachedData.rooms)
            setDevices(cachedData.devices)
            setError(null)
            return
          }
        }

        // Fetch from Firestore if cache is invalid or we're skipping cache
        const roomsRef = collection(db, "Rooms")
        const q = query(roomsRef, where("userRef", "==", doc(db, "Users", user.uid)))
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
        saveRelatedCollectionsToCache("Rooms", "Devices", roomsData, devicesByRoom)
      } catch (error) {
        console.error("Error fetching rooms and devices: ", error)
        setError("Failed to load rooms and devices. Please try again.")
      }
    },
    [user, userId],
  )

  const openPopup = (type, room = null, device = null) => {
    setPopupType(type)
    if (room) setSelectedRoom(room)
    if (device) setSelectedDevice(device)
  }

  const closePopup = () => {
    setPopupType(null)
    setSelectedRoom(null)
    setNewRoomName("")
    setNewDeviceCategory("")
    setNewDeviceName("")
    setSelectedDevice(null)
  }

  // Update the handleSaveRoom function to use the new cache functions
  const handleSaveRoom = async () => {
    if (!user || !newRoomName.trim()) return

    try {
      const roomsRef = collection(db, "Rooms")
      const newRoomRef = await addDoc(roomsRef, {
        roomName: newRoomName.trim(),
        userRef: doc(db, "Users", user.uid),
      })

      const newRoom = {
        id: newRoomRef.id,
        roomName: newRoomName.trim(),
        userRef: doc(db, "Users", user.uid),
      }

      // Update state
      const updatedRooms = [...rooms, newRoom]
      setRooms(updatedRooms)

      const updatedDevices = { ...devices, [newRoomRef.id]: [] }
      setDevices(updatedDevices)

      // Update cache
      saveRelatedCollectionsToCache("Rooms", "Devices", updatedRooms, updatedDevices)

      closePopup()
    } catch (error) {
      console.error("Error adding room: ", error)
      setError("Failed to add room. Please try again.")
    }
  }

  // Update the handleRemoveRoom function to use the new cache functions
  const handleRemoveRoom = async (room) => {
    if (!user) return

    try {
      // Delete all devices in this room
      const devicesRef = collection(db, "Devices")
      const devicesQuery = query(devicesRef, where("roomRef", "==", doc(db, "Rooms", room.id)))
      const devicesSnapshot = await getDocs(devicesQuery)

      const deletePromises = devicesSnapshot.docs.map((deviceDoc) => deleteDoc(doc(db, "Devices", deviceDoc.id)))

      await Promise.all(deletePromises)
      await deleteDoc(doc(db, "Rooms", room.id))

      // Update state
      const updatedRooms = rooms.filter((r) => r.id !== room.id)
      setRooms(updatedRooms)

      const updatedDevices = { ...devices }
      delete updatedDevices[room.id]
      setDevices(updatedDevices)

      // Update cache
      saveRelatedCollectionsToCache("Rooms", "Devices", updatedRooms, updatedDevices)

      closePopup()
    } catch (error) {
      console.error("Error removing room: ", error)
      setError("Failed to remove room. Please try again.")
    }
  }

  // Update the handleSaveDevice function to use the new cache functions
  const handleSaveDevice = async () => {
    if (!user || !newDeviceName.trim() || !newDeviceCategory) return

    try {
      const devicesRef = collection(db, "Devices")
      const newDeviceRef = await addDoc(devicesRef, {
        deviceName: newDeviceName.trim(),
        status: "off",
        roomRef: doc(db, "Rooms", newDeviceCategory),
      })

      const newDevice = {
        id: newDeviceRef.id,
        deviceName: newDeviceName.trim(),
        status: "off",
        roomRef: doc(db, "Rooms", newDeviceCategory),
      }

      // Update state
      const updatedDevices = {
        ...devices,
        [newDeviceCategory]: [...(devices[newDeviceCategory] || []), newDevice],
      }
      setDevices(updatedDevices)

      // Update cache
      saveRelatedCollectionsToCache("Rooms", "Devices", rooms, updatedDevices)

      closePopup()
    } catch (error) {
      console.error("Error adding device: ", error)
      setError("Failed to add device. Please try again.")
    }
  }

  // Update the handleRemoveDevice function to use the new cache functions
  const handleRemoveDevice = async (device) => {
    if (!user || !selectedRoom) return

    try {
      await deleteDoc(doc(db, "Devices", device.id))

      // Update state
      const updatedDevices = {
        ...devices,
        [selectedRoom.id]: devices[selectedRoom.id].filter((d) => d.id !== device.id),
      }
      setDevices(updatedDevices)

      // Update cache
      saveRelatedCollectionsToCache("Rooms", "Devices", rooms, updatedDevices)

      closePopup()
    } catch (error) {
      console.error("Error removing device: ", error)
      setError("Failed to remove device. Please try again.")
    }
  }

  // Add a function to handle manual refresh with cache clearing
  const handleRefresh = async () => {
    // Clear cache
    clearRelatedCollectionsCache("Rooms", "Devices")

    // Refetch data
    refetch()
  }

  // Update the useEffect that calls fetchRooms to use the new dependency
  useEffect(() => {
    fetchRooms()
  }, [fetchRooms])

  // Replace the existing loading check with this one
  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner} />
        <p>Loading rooms and devices...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <MdError size={48} className={styles.errorIcon} />
        <p className={styles.errorMessage}>{error}</p>
        <button className={styles.retryButton} onClick={handleRefresh}>
            <MdRefresh size={16} />
            Retry
          </button>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Rooms & Devices</h1>
        <p className={styles.subtitle}>Manage your smart home setup by organizing rooms and devices</p>
      </div>

      <div className={styles.content}>
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <MdHome className={styles.sectionIcon} />
              Rooms
            </h2>
            <button className={styles.addButton} onClick={() => openPopup("addRoom")}>
              <MdAdd />
              Add Room
            </button>
          </div>

          <div className={styles.grid}>
            {rooms.map((room) => (
              <div key={room.id} className={styles.card} onClick={() => openPopup("room", room)}>
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{room.roomName}</h3>
                  <p className={styles.cardSubtitle}>{devices[room.id]?.length || 0} devices</p>
                </div>
                <MdChevronRight className={styles.cardArrow} />
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <MdDevicesOther className={styles.sectionIcon} />
              All Devices
            </h2>
            <button className={styles.addButton} onClick={() => openPopup("addDevice")}>
              <MdAdd />
              Add Device
            </button>
          </div>

          <div className={styles.grid}>
            {rooms.map((room) =>
              devices[room.id]?.map((device) => (
                <div key={device.id} className={styles.card} onClick={() => openPopup("device", room, device)}>
                  <div className={styles.cardContent}>
                    <h3 className={styles.cardTitle}>{device.deviceName}</h3>
                    <p className={styles.cardSubtitle}>{room.roomName}</p>
                  </div>
                  <MdChevronRight className={styles.cardArrow} />
                </div>
              )),
            )}
          </div>
        </section>
      </div>

      {popupType && (
        <div className={styles.modalOverlay} onClick={closePopup}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            {popupType === "addRoom" && (
              <>
                <div className={styles.modalHeader}>
                  <h2>Add New Room</h2>
                  <button className={styles.closeButton} onClick={closePopup}>
                    <MdClose />
                  </button>
                </div>
                <div className={styles.modalContent}>
                  <div className={styles.formGroup}>
                    <label>Room Name</label>
                    <input
                      type="text"
                      value={newRoomName}
                      onChange={(e) => setNewRoomName(e.target.value)}
                      placeholder="Enter room name"
                      className={styles.input}
                    />
                  </div>
                </div>
                <div className={styles.modalFooter}>
                  <button className={styles.secondaryButton} onClick={closePopup}>
                    Cancel
                  </button>
                  <button className={styles.primaryButton} onClick={handleSaveRoom}>
                    Add Room
                  </button>
                </div>
              </>
            )}

            {popupType === "room" && selectedRoom && (
              <>
                <div className={styles.modalHeader}>
                  <h2>{selectedRoom.roomName}</h2>
                  <button className={styles.closeButton} onClick={closePopup}>
                    <MdClose />
                  </button>
                </div>
                <div className={styles.modalContent}>
                  <h3 className={styles.modalSubtitle}>Devices in this room</h3>
                  <div className={styles.deviceList}>
                    {devices[selectedRoom.id]?.map((device) => (
                      <div key={device.id} className={styles.deviceItem}>
                        <span>{device.deviceName}</span>
                      </div>
                    ))}
                    {!devices[selectedRoom.id]?.length && <p className={styles.emptyState}>No devices in this room</p>}
                  </div>
                </div>
                <div className={styles.modalFooter}>
                  <button className={styles.dangerButton} onClick={() => handleRemoveRoom(selectedRoom)}>
                    <MdDelete />
                    Remove Room
                  </button>
                  <button className={styles.secondaryButton} onClick={closePopup}>
                    Close
                  </button>
                </div>
              </>
            )}

            {popupType === "addDevice" && (
              <>
                <div className={styles.modalHeader}>
                  <h2>Add New Device</h2>
                  <button className={styles.closeButton} onClick={closePopup}>
                    <MdClose />
                  </button>
                </div>
                <div className={styles.modalContent}>
                  <div className={styles.formGroup}>
                    <label>Device Name</label>
                    <input
                      type="text"
                      value={newDeviceName}
                      onChange={(e) => setNewDeviceName(e.target.value)}
                      placeholder="Enter device name"
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Room</label>
                    <select
                      value={newDeviceCategory}
                      onChange={(e) => setNewDeviceCategory(e.target.value)}
                      className={styles.select}
                    >
                      <option value="">Select Room</option>
                      {rooms.map((room) => (
                        <option key={room.id} value={room.id}>
                          {room.roomName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className={styles.modalFooter}>
                  <button className={styles.secondaryButton} onClick={closePopup}>
                    Cancel
                  </button>
                  <button className={styles.primaryButton} onClick={handleSaveDevice}>
                    Add Device
                  </button>
                </div>
              </>
            )}

            {popupType === "device" && selectedDevice && (
              <>
                <div className={styles.modalHeader}>
                  <h2>{selectedDevice.deviceName}</h2>
                  <button className={styles.closeButton} onClick={closePopup}>
                    <MdClose />
                  </button>
                </div>
                <div className={styles.modalContent}>
                  <div className={styles.deviceDetails}>
                    <div className={styles.detailRow}>
                      <span>Room</span>
                      <span>{selectedRoom.roomName}</span>
                    </div>
                  </div>
                </div>
                <div className={styles.modalFooter}>
                  <button className={styles.dangerButton} onClick={() => handleRemoveDevice(selectedDevice)}>
                    <MdDelete />
                    Remove Device
                  </button>
                  <button className={styles.secondaryButton} onClick={closePopup}>
                    Close
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default DeviceManagement

