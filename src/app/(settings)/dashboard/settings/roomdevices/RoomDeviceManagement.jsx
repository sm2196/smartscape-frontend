"use client"

import { useState, useEffect, useRef } from "react"
import { collection, query, where, getDocs, deleteDoc, doc, addDoc, updateDoc } from "firebase/firestore"
import { useAuth } from "@/hooks/useAuth"
import { db } from "@/lib/firebase/config"
import styles from "./RoomDeviceManagement.module.css"
import { getUserId } from "@/lib/cacheUtils"
import { DEVICE_TYPES, DEVICE_ICONS, getDeviceTypeProperties } from "./constants/deviceTypes"
import { useFirestoreRooms } from "./hooks/useFirestoreRooms"
import { renderDeviceIcon, getAllDevices } from "./utils/iconUtils"
import { LoadingState, ErrorState } from "./components/LoadingAndError"
import { RoomsSectionHeader, DevicesSectionHeader } from "./components/SectionHeader"
import { EmptyRoomsState, EmptyDevicesState } from "./components/EmptyState"
import RoomItem from "./components/RoomItem"
import DeviceItem from "./components/DeviceItem"
import Modal from "./components/Modal"

const DeviceManagement = () => {
  const [popupType, setPopupType] = useState(null)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [newRoomName, setNewRoomName] = useState("")
  const [newDeviceCategory, setNewDeviceCategory] = useState("")
  const [newDeviceName, setNewDeviceName] = useState("")
  const [newDeviceType, setNewDeviceType] = useState("") // Selected device type
  const [deviceTypeSearch, setDeviceTypeSearch] = useState("") // Search input for device types
  const [showDeviceTypeDropdown, setShowDeviceTypeDropdown] = useState(false)
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

  // Use the custom hook to fetch rooms and devices
  const {
    rooms,
    setRooms,
    devices,
    setDevices,
    loading: dataLoading,
    error: dataError,
    fetchRooms,
  } = useFirestoreRooms(userId)

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

      closePopup()
    } catch (error) {
      console.error("Error removing room: ", error)
      setError("Failed to remove room. Please try again.")
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

      closePopup()
    } catch (error) {
      console.error("Error removing device: ", error)
      setError("Failed to remove device. Please try again.")
    }
  }

  if (isLoading) {
    return <LoadingState />
  }

  if (error) {
    return <ErrorState error={error} onRetry={() => window.location.reload()} />
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Rooms & Devices</h1>
        <p className={styles.subtitle}>Manage your smart home setup by organizing rooms and devices</p>
      </div>

      <div className={styles.sectionsContainer}>
        {/* Rooms Section */}
        <div className={styles.section}>
          <RoomsSectionHeader onAddRoom={() => openPopup("addRoom")} />

          <div className={styles.cardGrid}>
            {rooms.map((room) => (
              <RoomItem key={room.id} room={room} devices={devices} onRoomClick={(room) => openPopup("room", room)} />
            ))}
            {rooms.length === 0 && <EmptyRoomsState onAddRoom={() => openPopup("addRoom")} />}
          </div>
        </div>

        {/* Devices Section */}
        <div className={styles.section}>
          <DevicesSectionHeader onAddDevice={() => openPopup("addDevice")} roomsCount={rooms.length} />

          <div className={styles.deviceListContainer}>
            {getAllDevices(rooms, devices).map((device) => {
              const room = rooms.find((r) => r.roomName === device.roomName)
              return (
                <DeviceItem
                  key={device.id}
                  device={device}
                  room={room}
                  onDeviceClick={(room, device) => openPopup("device", room, device)}
                  renderDeviceIcon={(iconName) => renderDeviceIcon(iconName, styles.deviceIconDisplay)}
                />
              )
            })}
            {getAllDevices(rooms, devices).length === 0 && (
              <EmptyDevicesState onAddDevice={() => openPopup("addDevice")} hasRooms={rooms.length > 0} />
            )}
          </div>
        </div>
      </div>

      <Modal
        popupType={popupType}
        selectedRoom={selectedRoom}
        selectedDevice={selectedDevice}
        newRoomName={newRoomName}
        setNewRoomName={setNewRoomName}
        newDeviceCategory={newDeviceCategory}
        setNewDeviceCategory={setNewDeviceCategory}
        newDeviceName={newDeviceName}
        setNewDeviceName={setNewDeviceName}
        newDeviceType={newDeviceType}
        setNewDeviceType={setNewDeviceType}
        deviceTypeSearch={deviceTypeSearch}
        setDeviceTypeSearch={setDeviceTypeSearch}
        showDeviceTypeDropdown={showDeviceTypeDropdown}
        setShowDeviceTypeDropdown={setShowDeviceTypeDropdown}
        devices={devices}
        selectedDeviceIcon={selectedDeviceIcon}
        editedRoomName={editedRoomName}
        setEditedRoomName={setEditedRoomName}
        editedDeviceName={editedDeviceName}
        setEditedDeviceName={setEditedDeviceName}
        editedDeviceIcon={editedDeviceIcon}
        closePopup={closePopup}
        handleSaveRoom={handleSaveRoom}
        handleUpdateRoom={handleUpdateRoom}
        handleRemoveRoom={handleRemoveRoom}
        handleSaveDevice={handleSaveDevice}
        handleUpdateDevice={handleUpdateDevice}
        handleRemoveDevice={handleRemoveDevice}
        handleDeviceTypeSelect={handleDeviceTypeSelect}
        handleDeviceIconSelect={handleDeviceIconSelect}
        handleEditedDeviceIconSelect={handleEditedDeviceIconSelect}
        filteredDeviceTypes={filteredDeviceTypes}
        rooms={rooms}
        renderDeviceIcon={(iconName) => renderDeviceIcon(iconName, styles.deviceIconDisplay)}
        DEVICE_ICONS={DEVICE_ICONS}
        deviceTypeDropdownRef={deviceTypeDropdownRef}
      />
    </div>
  )
}

export default DeviceManagement

