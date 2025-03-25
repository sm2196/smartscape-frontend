"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import {
  MdChevronRight,
  MdAdd,
  MdHome,
  MdDevicesOther,
  MdClose,
  MdDelete,
  MdError,
  MdSearch,
  MdCheck,
  MdLightbulb,
  MdOutlineLight,
  MdDoorFront,
  MdGarage,
  MdWindPower,
  MdThermostat,
  MdBed,
  MdTv,
  MdTimer,
  MdRecycling,
} from "react-icons/md"
import { LuLamp, LuLampDesk, LuHeater, LuProjector, LuBlinds, LuWashingMachine } from "react-icons/lu"
import { TbAirConditioning } from "react-icons/tb"
import { BsSpeaker } from "react-icons/bs"
import { collection, query, where, getDocs, deleteDoc, doc, addDoc, updateDoc } from "firebase/firestore"
import { useAuth } from "@/hooks/useAuth"
import { db } from "@/lib/firebase/config"
import styles from "./RoomDeviceManagement.module.css"
import { useFirestoreData } from "@/hooks/useFirestoreData"
import { getUserId, getRelatedCollectionsFromCache, saveRelatedCollectionsToCache } from "@/lib/cacheUtils"

// Add these constants for cache keys and expiration time
const CACHE_EXPIRATION = 30 * 60 * 1000 // 30 minutes in milliseconds

// Define the collections array
const CACHE_COLLECTIONS = ["Rooms", "Devices"]

// Define device types array
const DEVICE_TYPES = [
  { value: "Light", label: "Light" },
  { value: "Fan", label: "Fan" },
  { value: "AC", label: "Air Conditioner" },
  { value: "Room_Heater", label: "Room Heater" },
  { value: "Water_Heater", label: "Water Heater" },
  { value: "Bed", label: "Smart Bed" },
  { value: "TV", label: "Television" },
  { value: "Projector", label: "Projector" },
  { value: "Speaker", label: "Speaker" },
  { value: "Blinds", label: "Window Blinds" },
  { value: "Door", label: "Door" },
  { value: "Motion", label: "Motion Sensor" },
  { value: "Freezer", label: "Freezer" },
  { value: "Washer", label: "Washing Machine" },
  { value: "Recycling", label: "Recycle Bin" },
]

// Define device icons mapping
const DEVICE_ICONS = {
  Light: [
    { name: "MdLightbulb", icon: MdLightbulb, label: "Lightbulb" },
    { name: "MdOutlineLight", icon: MdOutlineLight, label: "Light" },
    { name: "LuLamp", icon: LuLamp, label: "Lamp" },
    { name: "LuLampDesk", icon: LuLampDesk, label: "Desk Lamp" },
  ],
  Door: [
    { name: "MdDoorFront", icon: MdDoorFront, label: "Door" },
    { name: "MdGarage", icon: MdGarage, label: "Garage" },
  ],
  Fan: [{ name: "MdWindPower", icon: MdWindPower, label: "Fan" }],
  AC: [{ name: "TbAirConditioning", icon: TbAirConditioning, label: "Air Conditioner" }],
  Room_Heater: [{ name: "LuHeater", icon: LuHeater, label: "Room Heater" }],
  Water_Heater: [{ name: "MdThermostat", icon: MdThermostat, label: "Water Heater" }],
  Bed: [{ name: "MdBed", icon: MdBed, label: "Smart Bed" }],
  TV: [{ name: "MdTv", icon: MdTv, label: "Television" }],
  Projector: [{ name: "LuProjector", icon: LuProjector, label: "Projector" }],
  Speaker: [{ name: "BsSpeaker", icon: BsSpeaker, label: "Speaker" }],
  Blinds: [{ name: "LuBlinds", icon: LuBlinds, label: "Window Blinds" }],
  Motion: [{ name: "MdTimer", icon: MdTimer, label: "Motion Sensor" }],
  Freezer: [{ name: "MdThermostat", icon: MdThermostat, label: "Freezer" }],
  Washer: [{ name: "LuWashingMachine", icon: LuWashingMachine, label: "Washing Machine" }],
  Recycling: [{ name: "MdRecycling", icon: MdRecycling, label: "Recycle Bin" }],
}

const DeviceManagement = () => {
  const [popupType, setPopupType] = useState(null)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [newRoomName, setNewRoomName] = useState("")
  const [rooms, setRooms] = useState([])
  const [newDeviceCategory, setNewDeviceCategory] = useState("")
  const [newDeviceName, setNewDeviceName] = useState("")
  const [newDeviceType, setNewDeviceType] = useState("") // Selected device type
  const [deviceTypeSearch, setDeviceTypeSearch] = useState("") // Search input for device types
  const [showDeviceTypeDropdown, setShowDeviceTypeDropdown] = useState(false)
  const [devices, setDevices] = useState({})
  const [selectedDevice, setSelectedDevice] = useState(null)
  const [error, setError] = useState(null)
  const [userId, setUserId] = useState(null)
  const [selectedDeviceIcon, setSelectedDeviceIcon] = useState("") // New state for selected icon

  // New state variables for editing
  const [isEditingRoom, setIsEditingRoom] = useState(false)
  const [editedRoomName, setEditedRoomName] = useState("")
  const [isEditingDevice, setIsEditingDevice] = useState(false)
  const [editedDeviceName, setEditedDeviceName] = useState("")
  const [editedDeviceIcon, setEditedDeviceIcon] = useState("")
  const [showIconSelector, setShowIconSelector] = useState(false)

  // Ref for the device type dropdown
  const deviceTypeDropdownRef = useRef(null)

  // Change the auth hook usage at the top of the component
  const { user, loading: authLoading } = useAuth()

  // Use useEffect to get userId on client-side only
  useEffect(() => {
    // Get user ID with priority from cache first, then from auth object
    setUserId(getUserId(user))
  }, [user])

  // Update the useFirestoreData hook to handle the case when userId is null
  const { loading: dataLoading, error: dataError } = useFirestoreData("Users", userId, {
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

  // Filter device types based on search input
  const filteredDeviceTypes = DEVICE_TYPES.filter((type) =>
    type.label.toLowerCase().includes(deviceTypeSearch.toLowerCase()),
  )

  // Handle click outside of device type dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (deviceTypeDropdownRef.current && !deviceTypeDropdownRef.current.contains(event.target)) {
        setShowDeviceTypeDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Reset selected icon when device type changes
  useEffect(() => {
    setSelectedDeviceIcon("")
  }, [newDeviceType])

  // Replace the fetchRooms function with this updated version
  const fetchRooms = useCallback(
    async (skipCache = false) => {
      try {
        if (!user || !userId) return

        // Check cache first if not skipping cache
        if (!skipCache) {
          const cachedData = getRelatedCollectionsFromCache(CACHE_COLLECTIONS, CACHE_EXPIRATION)
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
        saveRelatedCollectionsToCache(CACHE_COLLECTIONS, [roomsData, devicesByRoom])
      } catch (error) {
        console.error("Error fetching rooms and devices: ", error)
        setError("Failed to load rooms and devices. Please try again.")
      }
    },
    [user, userId],
  )

  // Update the openPopup function to initialize editing state properly
  const openPopup = (type, room = null, device = null) => {
    setPopupType(type)

    if (room) {
      setSelectedRoom(room)
      // Initialize room editing state
      setEditedRoomName(room.roomName)
    }

    if (device) {
      setSelectedDevice(device)
      // Initialize device editing state
      setEditedDeviceName(device.deviceName)
      setEditedDeviceIcon(device.deviceIcon || "")
    }
  }

  // Update the closePopup function to reset all state
  const closePopup = () => {
    setPopupType(null)
    setSelectedRoom(null)
    setNewRoomName("")
    setNewDeviceCategory("")
    setNewDeviceName("")
    setNewDeviceType("") // Reset device type
    setDeviceTypeSearch("") // Reset device type search
    setShowDeviceTypeDropdown(false) // Hide dropdown
    setSelectedDevice(null)
    setSelectedDeviceIcon("") // Reset selected icon

    // Reset editing states
    setIsEditingRoom(false)
    setEditedRoomName("")
    setIsEditingDevice(false)
    setEditedDeviceName("")
    setEditedDeviceIcon("")
    setShowIconSelector(false)
  }

  // Handle device type selection
  const handleDeviceTypeSelect = (type) => {
    setNewDeviceType(type.value)
    setDeviceTypeSearch(type.label)
    setShowDeviceTypeDropdown(false)
  }

  // Handle device icon selection
  const handleDeviceIconSelect = (iconName) => {
    setSelectedDeviceIcon(iconName)
  }

  // Handle edited device icon selection
  const handleEditedDeviceIconSelect = (iconName) => {
    setEditedDeviceIcon(iconName)
  }

  // Update the handleSaveRoom function
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
      saveRelatedCollectionsToCache(CACHE_COLLECTIONS, [updatedRooms, updatedDevices])

      closePopup()
    } catch (error) {
      console.error("Error adding room: ", error)
      setError("Failed to add room. Please try again.")
    }
  }

  // New function to handle updating room name
  const handleUpdateRoom = async () => {
    if (!user || !selectedRoom || !editedRoomName.trim()) return

    try {
      const roomRef = doc(db, "Rooms", selectedRoom.id)
      await updateDoc(roomRef, {
        roomName: editedRoomName.trim(),
      })

      // Update local state
      const updatedRooms = rooms.map((room) =>
        room.id === selectedRoom.id ? { ...room, roomName: editedRoomName.trim() } : room,
      )
      setRooms(updatedRooms)

      // Update devices that reference this room (for display purposes)
      const updatedDevices = { ...devices }

      // Update cache
      saveRelatedCollectionsToCache(CACHE_COLLECTIONS, [updatedRooms, updatedDevices])

      // Exit editing mode
      setIsEditingRoom(false)
      // Update the selected room with the new name
      setSelectedRoom({ ...selectedRoom, roomName: editedRoomName.trim() })
    } catch (error) {
      console.error("Error updating room: ", error)
      setError("Failed to update room. Please try again.")
    }
  }

  // Update the handleRemoveRoom function
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
      saveRelatedCollectionsToCache(CACHE_COLLECTIONS, [updatedRooms, updatedDevices])

      closePopup()
    } catch (error) {
      console.error("Error removing room: ", error)
      setError("Failed to remove room. Please try again.")
    }
  }

  // Add this function after the handleSaveDevice function
  // Get default properties based on device type
  const getDeviceTypeProperties = (deviceType) => {
    switch (deviceType) {
      case "Light":
        return {
          isActive: false,
          status: "Off",
          statusColor: "",
          voltage: Math.random() < 0.5 ? 120 : 60,
        }
      case "Fan":
        return {
          isActive: false,
          status: "Off",
          statusColor: "",
          voltage: 75,
        }
      case "AC":
        return {
          isActive: true,
          status: "27°C",
          statusColor: "statusPink",
          voltage: 0,
        }
      case "Room_Heater":
        return {
          isActive: true,
          status: "22°C",
          statusColor: "statusBlue",
          voltage: 1500,
        }
      case "Water_Heater":
        return {
          isActive: true,
          status: "83°C",
          statusColor: "statusPink",
          voltage: 1200,
        }
      case "Bed":
        return {
          isActive: true,
          status: "On",
          voltage: 0,
        }
      case "TV":
        return {
          isActive: true,
          status: "On",
          statusColor: "statusGreen",
          voltage: 150,
        }
      case "Projector":
        return {
          isActive: false,
          status: "Off",
          statusColor: "",
          voltage: 300,
        }
      case "Speaker":
        return {
          isActive: false,
          status: "Off",
          statusColor: "",
          voltage: 30,
        }
      case "Blinds":
        return {
          isActive: false,
          status: "Open",
          voltage: 0,
        }
      case "Door":
        return {
          isActive: false,
          status: "Locked",
          voltage: 0,
        }
      case "Motion":
        return {
          isActive: false,
          notificationsEnabled: true,
          status: "1 hour ago",
          voltage: 0,
        }
      case "Freezer":
        return {
          isActive: true,
          status: "-6.5°C",
          statusColor: "statusBlue",
          volume: 700,
        }
      case "Washer":
        return {
          isActive: true,
          status: "Cycle Complete",
          voltage: 500,
        }
      case "Recycling":
        return {
          isActive: true,
          remindersEnabled: false,
          status: "In 5 Days",
          statusColor: "statusGreen",
          voltage: 0,
        }
    }
  }

  // Update the handleSaveDevice function to include deviceIcon
  const handleSaveDevice = async () => {
    if (!user || !newDeviceName.trim() || !newDeviceCategory || !newDeviceType) return

    // For device types with icons, require an icon selection or auto-select if only one option
    if (DEVICE_ICONS[newDeviceType]) {
      if (DEVICE_ICONS[newDeviceType].length === 1) {
        // Auto-select the only icon available for this device type
        setSelectedDeviceIcon(DEVICE_ICONS[newDeviceType][0].name)
      } else if (!selectedDeviceIcon) {
        setError("Please select an icon for this device type")
        return
      }
    }

    try {
      const devicesRef = collection(db, "Devices")

      // Get default properties for the selected device type
      const deviceTypeProps = getDeviceTypeProperties(newDeviceType)

      // Create the device data object with all properties
      const deviceData = {
        deviceName: newDeviceName.trim(),
        status: deviceTypeProps.status || "Off",
        roomRef: doc(db, "Rooms", newDeviceCategory),
        deviceType: newDeviceType,
        ...deviceTypeProps,
      }

      // Add deviceIcon if one was selected
      if (selectedDeviceIcon) {
        deviceData.deviceIcon = selectedDeviceIcon
      }

      const newDeviceRef = await addDoc(devicesRef, deviceData)

      const newDevice = {
        id: newDeviceRef.id,
        ...deviceData,
      }

      // Update state
      const updatedDevices = {
        ...devices,
        [newDeviceCategory]: [...(devices[newDeviceCategory] || []), newDevice],
      }
      setDevices(updatedDevices)

      // Update cache
      saveRelatedCollectionsToCache(CACHE_COLLECTIONS, [rooms, updatedDevices])

      closePopup()
    } catch (error) {
      console.error("Error adding device: ", error)
      setError("Failed to add device. Please try again.")
    }
  }

  // New function to handle updating device
  const handleUpdateDevice = async () => {
    if (!user || !selectedRoom || !selectedDevice || !editedDeviceName.trim()) return

    try {
      const deviceRef = doc(db, "Devices", selectedDevice.id)

      // Prepare update data
      const updateData = {
        deviceName: editedDeviceName.trim(),
      }

      // Only update icon if it's changed and not empty
      if (editedDeviceIcon) {
        updateData.deviceIcon = editedDeviceIcon
      }

      await updateDoc(deviceRef, updateData)

      // Update local state
      const updatedDevices = { ...devices }
      updatedDevices[selectedRoom.id] = devices[selectedRoom.id].map((device) =>
        device.id === selectedDevice.id
          ? { ...device, deviceName: editedDeviceName.trim(), deviceIcon: editedDeviceIcon || device.deviceIcon }
          : device,
      )

      setDevices(updatedDevices)

      // Update cache
      saveRelatedCollectionsToCache(CACHE_COLLECTIONS, [rooms, updatedDevices])

      // Exit editing mode
      setIsEditingDevice(false)
      // Update the selected device with the new data
      setSelectedDevice({
        ...selectedDevice,
        deviceName: editedDeviceName.trim(),
        deviceIcon: editedDeviceIcon || selectedDevice.deviceIcon,
      })

      // Hide icon selector
      setShowIconSelector(false)
    } catch (error) {
      console.error("Error updating device: ", error)
      setError("Failed to update device. Please try again.")
    }
  }

  // Update the handleRemoveDevice function
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
      saveRelatedCollectionsToCache(CACHE_COLLECTIONS, [rooms, updatedDevices])

      closePopup()
    } catch (error) {
      console.error("Error removing device: ", error)
      setError("Failed to remove device. Please try again.")
    }
  }

  // Helper function to render the appropriate icon component
  const renderDeviceIcon = (iconName) => {
    if (!iconName) return null

    // Flatten all icon options into a single array for easier lookup
    const allIcons = Object.values(DEVICE_ICONS).flat()
    const iconConfig = allIcons.find((icon) => icon.name === iconName)

    if (iconConfig) {
      const IconComponent = iconConfig.icon
      return <IconComponent className={styles.deviceIconDisplay} />
    }

    return null
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
        <button onClick={() => window.location.reload()} className={styles.retryButton}>
          Retry
        </button>
      </div>
    )
  }

  // Get all devices as a flat array for display
  const getAllDevices = () => {
    const allDevices = []
    rooms.forEach((room) => {
      if (devices[room.id]) {
        devices[room.id].forEach((device) => {
          allDevices.push({
            ...device,
            roomName: room.roomName,
          })
        })
      }
    })
    return allDevices
  }

  // Update the return statement to enhance the UI design
  // Replace the existing return statement with this improved version:

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Rooms & Devices</h1>
        <p className={styles.subtitle}>Manage your smart home setup by organizing rooms and devices</p>
      </div>

      <div className={styles.sectionsContainer}>
        {/* Rooms Section */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitleWrapper}>
              <MdHome className={styles.sectionIcon} />
              <h2 className={styles.sectionTitle}>Rooms</h2>
            </div>
            <button className={styles.addButton} onClick={() => openPopup("addRoom")}>
              <MdAdd />
              <span>Add Room</span>
            </button>
          </div>

          <div className={styles.cardGrid}>
            {rooms.map((room) => (
              <div key={room.id} className={styles.card} onClick={() => openPopup("room", room)}>
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{room.roomName}</h3>
                  <p className={styles.cardSubtitle}>{devices[room.id]?.length || 0} devices</p>
                </div>
                <div className={styles.cardArrowWrapper}>
                  <MdChevronRight className={styles.cardArrow} />
                </div>
              </div>
            ))}
            {rooms.length === 0 && (
              <div className={styles.emptyStateCard}>
                <MdHome className={styles.emptyStateIcon} />
                <p>No rooms added yet</p>
                <button className={styles.emptyStateButton} onClick={() => openPopup("addRoom")}>
                  Add Your First Room
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Devices Section */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitleWrapper}>
              <MdDevicesOther className={styles.sectionIcon} />
              <h2 className={styles.sectionTitle}>All Devices</h2>
            </div>
            <button
              className={styles.addButton}
              onClick={() => openPopup("addDevice")}
              disabled={rooms.length === 0}
              title={rooms.length === 0 ? "Add a room first" : "Add a new device"}
            >
              <MdAdd />
              <span>Add Device</span>
            </button>
          </div>

          <div className={styles.cardGrid}>
            {getAllDevices().map((device) => (
              <div
                key={device.id}
                className={`${styles.card} ${styles.deviceCard}`}
                onClick={() => {
                  const room = rooms.find((r) => r.roomName === device.roomName)
                  if (room) {
                    openPopup("device", room, device)
                  }
                }}
              >
                <div className={styles.cardContent}>
                  <div className={styles.deviceCardHeader}>
                    <h3 className={styles.cardTitle}>{device.deviceName}</h3>
                    {/* Display device icon if available */}
                    {device.deviceIcon && (
                      <div className={styles.deviceIconContainer}>{renderDeviceIcon(device.deviceIcon)}</div>
                    )}
                  </div>
                  <div className={styles.deviceMeta}>
                    <span className={styles.roomBadge}>{device.roomName}</span>
                  </div>
                </div>
                <div className={styles.cardArrowWrapper}>
                  <MdChevronRight className={styles.cardArrow} />
                </div>
              </div>
            ))}
            {getAllDevices().length === 0 && (
              <div className={styles.emptyStateCard}>
                <MdDevicesOther className={styles.emptyStateIcon} />
                <p>No devices added yet</p>
                <button
                  className={styles.emptyStateButton}
                  onClick={() => openPopup("addDevice")}
                  disabled={rooms.length === 0}
                >
                  {rooms.length === 0 ? "Add a room first" : "Add Your First Device"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {popupType && (
        <div
          className={styles.modalOverlay}
          onClick={(e) => {
            // Only allow closing by clicking outside for viewing rooms or devices
            // Prevent closing when adding rooms or devices
            if (popupType !== "addRoom" && popupType !== "addDevice") {
              closePopup()
            }
          }}
        >
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
                  <button
                    className={`${styles.primaryButton} ${!newRoomName.trim() ? styles.disabledButton : ""}`}
                    onClick={handleSaveRoom}
                    disabled={!newRoomName.trim()}
                  >
                    Add Room
                  </button>
                </div>
              </>
            )}

            {popupType === "room" && selectedRoom && (
              <>
                <div className={styles.modalHeader}>
                  <div className={styles.editNameContainer}>
                    <input
                      type="text"
                      value={editedRoomName}
                      onChange={(e) => setEditedRoomName(e.target.value)}
                      className={`${styles.input} ${styles.editNameInput}`}
                      placeholder="Room Name"
                    />
                  </div>
                  <button className={styles.closeButton} onClick={closePopup}>
                    <MdClose />
                  </button>
                </div>
                <div className={styles.modalContent}>
                  <h3 className={styles.modalSubtitle}>Devices in this room</h3>
                  <div className={styles.deviceList}>
                    {devices[selectedRoom.id]?.map((device) => (
                      <div key={device.id} className={styles.deviceItem}>
                        <div className={styles.deviceItemContent}>
                          <span className={styles.deviceItemName}>{device.deviceName}</span>
                          {/* Display device icon if available */}
                          {device.deviceIcon && renderDeviceIcon(device.deviceIcon)}
                        </div>
                      </div>
                    ))}
                    {!devices[selectedRoom.id]?.length && (
                      <div className={styles.emptyState}>
                        <MdDevicesOther className={styles.emptyStateIcon} />
                        <p>No devices in this room</p>
                        <button
                          className={styles.emptyStateButton}
                          onClick={() => {
                            closePopup()
                            setTimeout(() => openPopup("addDevice"), 100)
                          }}
                        >
                          Add a device
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className={styles.modalFooter}>
                  <button className={styles.dangerButton} onClick={() => handleRemoveRoom(selectedRoom)}>
                    <MdDelete />
                    Remove Room
                  </button>
                  <div className={styles.actionButtons}>
                    <button className={styles.secondaryButton} onClick={closePopup}>
                      Cancel
                    </button>
                    <button
                      className={`${styles.primaryButton} ${!editedRoomName.trim() ? styles.disabledButton : ""}`}
                      onClick={handleUpdateRoom}
                      disabled={!editedRoomName.trim() || editedRoomName === selectedRoom.roomName}
                    >
                      Save Changes
                    </button>
                  </div>
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
                  <div className={styles.formGroup} ref={deviceTypeDropdownRef}>
                    <label>Device Type</label>
                    <div className={styles.searchableDropdown}>
                      <div className={styles.searchInputWrapper}>
                        <input
                          type="text"
                          value={deviceTypeSearch}
                          onChange={(e) => {
                            setDeviceTypeSearch(e.target.value)
                            setShowDeviceTypeDropdown(true)
                            if (!e.target.value) {
                              setNewDeviceType("")
                            }
                          }}
                          onFocus={() => setShowDeviceTypeDropdown(true)}
                          placeholder="Search device type"
                          className={styles.input}
                        />
                        <MdSearch className={styles.searchIcon} />
                      </div>
                      {showDeviceTypeDropdown && (
                        <div className={styles.dropdownList}>
                          {filteredDeviceTypes.length > 0 ? (
                            filteredDeviceTypes.map((type) => (
                              <div
                                key={type.value}
                                className={`${styles.dropdownItem} ${
                                  newDeviceType === type.value ? styles.selected : ""
                                }`}
                                onClick={() => handleDeviceTypeSelect(type)}
                              >
                                {type.label}
                                {newDeviceType === type.value && <MdCheck className={styles.checkIcon} />}
                              </div>
                            ))
                          ) : (
                            <div className={styles.noResults}>No device types found</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Icon selection for device types with icons */}
                  {newDeviceType && DEVICE_ICONS[newDeviceType] && (
                    <div className={styles.formGroup}>
                      <label>Select Icon</label>
                      <div className={styles.iconSelectionGrid}>
                        {DEVICE_ICONS[newDeviceType].map((iconConfig) => {
                          const IconComponent = iconConfig.icon
                          return (
                            <div
                              key={iconConfig.name}
                              className={`${styles.iconOption} ${
                                selectedDeviceIcon === iconConfig.name ? styles.selectedIcon : ""
                              }`}
                              onClick={() => handleDeviceIconSelect(iconConfig.name)}
                              title={iconConfig.label}
                            >
                              <IconComponent className={styles.iconDisplay} />
                              <span className={styles.iconLabel}>{iconConfig.label}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

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
                  <button
                    className={`${styles.primaryButton} ${
                      !newDeviceName.trim() || !newDeviceCategory || !newDeviceType ? styles.disabledButton : ""
                    }`}
                    onClick={handleSaveDevice}
                    disabled={!newDeviceName.trim() || !newDeviceCategory || !newDeviceType}
                  >
                    Add Device
                  </button>
                </div>
              </>
            )}

            {popupType === "device" && selectedDevice && (
              <>
                <div className={styles.modalHeader}>
                  <div className={styles.editNameContainer}>
                    <input
                      type="text"
                      value={editedDeviceName}
                      onChange={(e) => setEditedDeviceName(e.target.value)}
                      className={`${styles.input} ${styles.editNameInput}`}
                      placeholder="Device Name"
                    />
                  </div>
                  <button className={styles.closeButton} onClick={closePopup}>
                    <MdClose />
                  </button>
                </div>
                <div className={styles.modalContent}>
                  <div className={styles.formGroup}>
                    <label>Device Icon</label>
                    <div className={styles.currentIconDisplay}>
                      <div className={styles.selectedIconPreview}>
                        {editedDeviceIcon
                          ? renderDeviceIcon(editedDeviceIcon)
                          : renderDeviceIcon(selectedDevice.deviceIcon) || <span>No icon selected</span>}
                      </div>
                    </div>

                    {selectedDevice.deviceType && DEVICE_ICONS[selectedDevice.deviceType] && (
                      <div className={styles.iconSelectionGrid}>
                        {DEVICE_ICONS[selectedDevice.deviceType].map((iconConfig) => {
                          const IconComponent = iconConfig.icon
                          return (
                            <div
                              key={iconConfig.name}
                              className={`${styles.iconOption} ${
                                (editedDeviceIcon || selectedDevice.deviceIcon) === iconConfig.name
                                  ? styles.selectedIcon
                                  : ""
                              }`}
                              onClick={() => handleEditedDeviceIconSelect(iconConfig.name)}
                              title={iconConfig.label}
                            >
                              <IconComponent className={styles.iconDisplay} />
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>

                  <div className={styles.deviceDetails}>
                    <div className={styles.deviceTypeDisplay}>
                      <span className={styles.detailLabel}>Type:</span>
                      <span className={styles.detailValue}>
                        {DEVICE_TYPES.find((t) => t.value === selectedDevice.deviceType)?.label ||
                          selectedDevice.deviceType}
                      </span>
                    </div>
                    <div className={styles.deviceRoomDisplay}>
                      <span className={styles.detailLabel}>Room:</span>
                      <span className={styles.detailValue}>{selectedRoom.roomName}</span>
                    </div>
                  </div>
                </div>
                <div className={styles.modalFooter}>
                  <button className={styles.dangerButton} onClick={() => handleRemoveDevice(selectedDevice)}>
                    <MdDelete />
                    Remove Device
                  </button>
                  <div className={styles.actionButtons}>
                    <button className={styles.secondaryButton} onClick={closePopup}>
                      Cancel
                    </button>
                    <button
                      className={`${styles.primaryButton} ${
                        !editedDeviceName.trim() ||
                        (
                          editedDeviceName === selectedDevice.deviceName &&
                            editedDeviceIcon === selectedDevice.deviceIcon
                        )
                          ? styles.disabledButton
                          : ""
                      }`}
                      onClick={handleUpdateDevice}
                      disabled={
                        !editedDeviceName.trim() ||
                        (editedDeviceName === selectedDevice.deviceName &&
                          editedDeviceIcon === selectedDevice.deviceIcon)
                      }
                    >
                      Save Changes
                    </button>
                  </div>
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

