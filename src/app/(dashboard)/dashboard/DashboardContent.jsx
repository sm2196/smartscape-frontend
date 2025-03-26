"use client"

import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import {
  MdLightbulb,
  MdTv,
  MdRecycling,
  MdDoorFront,
  MdTimer,
  MdThermostat,
  MdGarage,
  MdWindPower,
  MdBed,
  MdOutlineLight,
  MdBolt,
  MdDevicesOther,
} from "react-icons/md"
import { LuHeater, LuLamp, LuLampDesk, LuProjector, LuWashingMachine, LuBlinds } from "react-icons/lu"
import { BsSpeaker } from "react-icons/bs"
import { TbAirConditioning } from "react-icons/tb"
import { FaPowerOff } from "react-icons/fa6"
import { DeviceCard } from "./DeviceCard"
import { RoomSection } from "./RoomSection"
import { VoltageAlert } from "./VoltageAlert"
import styles from "./DashboardContent.module.css"
import { useFirebase } from "./hooks/FirebaseContext"
import { useAuth } from "@/hooks/useAuth"

// Map device types to their respective icons
const DEVICE_ICONS = {
  Light: MdLightbulb,
  Fan: MdWindPower,
  AC: TbAirConditioning,
  Room_Heater: LuHeater,
  Water_Heater: MdThermostat,
  Bed: MdBed,
  TV: MdTv,
  Projector: LuProjector,
  Speaker: BsSpeaker,
  Blinds: LuBlinds,
  Door: MdDoorFront,
  Motion: MdTimer,
  Freezer: MdThermostat,
  Washer: LuWashingMachine,
  Recycling: MdRecycling,
  // Custom icons for specific device icons from database
  MdLightbulb: MdLightbulb,
  MdOutlineLight: MdOutlineLight,
  LuLamp: LuLamp,
  LuLampDesk: LuLampDesk,
  MdDoorFront: MdDoorFront,
  MdGarage: MdGarage,
  // Default icon
  default: MdDevicesOther,
}

export default function DashboardContent() {
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const {
    devices,
    rooms,
    totalVoltage,
    showVoltageAlert,
    dismissVoltageAlert,
    triggerVoltageAlert,
    VOLTAGE_THRESHOLD,
    updateDeviceState,
    fetchRoomsAndDevices,
    getIdFromRef,
  } = useFirebase()

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Check if mobile menu is open
  useEffect(() => {
    const checkMobileMenu = () => {
      setIsMobileMenuOpen(document.body.classList.contains("mobile-menu-open"))
    }

    // Initial check
    checkMobileMenu()

    // Set up observer to watch for class changes
    const observer = new MutationObserver(checkMobileMenu)
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] })

    return () => observer.disconnect()
  }, [])

  // Ensure rooms and devices are loaded
  useEffect(() => {
    if (user) {
      setIsLoading(true)
      fetchRoomsAndDevices().finally(() => {
        setIsLoading(false)
      })
    }
  }, [user, fetchRoomsAndDevices])

  // Group devices by room using roomRef
  const devicesByRoom = useMemo(() => {
    const grouped = {}

    // Initialize with empty arrays for all rooms
    rooms.forEach((room) => {
      grouped[room.id] = []
    })

    // Add devices to their respective rooms based on roomRef
    Object.entries(devices).forEach(([deviceId, device]) => {
      const roomId = getIdFromRef(device.roomRef)
      if (roomId && grouped[roomId]) {
        grouped[roomId].push({
          ...device,
          id: deviceId, // Add the device ID to the device object for easier reference
        })
      }
    })

    return grouped
  }, [devices, rooms, getIdFromRef])

  // Get all light and fan devices for master control
  const lightAndFanDevices = useMemo(() => {
    return Object.keys(devices).filter((deviceId) => {
      const device = devices[deviceId]
      return device.deviceType === "Light" || device.deviceType === "Fan"
    })
  }, [devices])

  // Get all media devices for master control
  const mediaDevices = useMemo(() => {
    return Object.keys(devices).filter((deviceId) => {
      const device = devices[deviceId]
      return device.deviceType === "TV" || device.deviceType === "Speaker" || device.deviceType === "Projector"
    })
  }, [devices])

  // Function to get the appropriate icon for a device
  const getDeviceIcon = (device) => {
    // First check if the device has a specific icon set
    if (device.deviceIcon && DEVICE_ICONS[device.deviceIcon]) {
      return DEVICE_ICONS[device.deviceIcon]
    }

    // Otherwise use the device type to determine the icon
    if (device.deviceType && DEVICE_ICONS[device.deviceType]) {
      return DEVICE_ICONS[device.deviceType]
    }

    // Default fallback icon
    return DEVICE_ICONS.default
  }

  // Function to turn off all lights and fans
  const turnOffLightsAndFans = () => {
    lightAndFanDevices.forEach((deviceId) => {
      // Get current device state or use default
      const currentDevice = devices[deviceId]

      // Only update if the device is currently active
      if (currentDevice && currentDevice.isActive) {
        updateDeviceState(deviceId, {
          status: "Off",
          isActive: false,
          statusColor: "",
        })
      }
    })
  }

  // Function to turn off all media devices
  const turnOffMediaDevices = () => {
    mediaDevices.forEach((deviceId) => {
      // Get current device state or use default
      const currentDevice = devices[deviceId]

      // Only update if the device is currently active
      if (currentDevice && currentDevice.isActive) {
        updateDeviceState(deviceId, {
          status: "Off",
          isActive: false,
          statusColor: "",
        })
      }
    })
  }

  // Function to turn on high-voltage devices for testing
  const turnOnHighVoltageDevices = () => {
    // Find high voltage devices
    const heaters = Object.keys(devices).find(
      (id) => devices[id].deviceType === "Room_Heater" || devices[id].deviceType === "Water_Heater",
    )

    const tvs = Object.keys(devices).find((id) => devices[id].deviceType === "TV")

    const freezers = Object.keys(devices).find((id) => devices[id].deviceType === "Freezer")

    // Turn on heater if available
    if (heaters) {
      updateDeviceState(heaters, {
        status: "On",
        isActive: true,
        statusColor: "statusBlue",
      })
    }

    // Turn on TV if available
    if (tvs) {
      updateDeviceState(tvs, {
        status: "On",
        isActive: true,
        statusColor: "statusGreen",
      })
    }

    // Turn on freezer if available
    if (freezers) {
      updateDeviceState(freezers, {
        status: "-6.5°C",
        isActive: true,
        statusColor: "statusBlue",
      })
    }

    // After turning on devices, trigger the alert
    setTimeout(() => {
      triggerVoltageAlert()
    }, 1000)
  }

  // Get high voltage devices for the alert
  const getHighVoltageDevices = () => {
    const activeDevices = Object.entries(devices)
      .filter(([id, device]) => {
        // Only include active devices with significant voltage (more than 50W)
        const voltage = device.voltage || 0
        return device.isActive && voltage > 50
      })
      .map(([id, device]) => ({
        id,
        title: device.deviceName || id,
        voltage: device.voltage || 0,
      }))
      .sort((a, b) => b.voltage - a.voltage) // Sort by voltage, highest first
      .slice(0, 5) // Get top 5 highest voltage devices

    return activeDevices
  }

  // If loading, show a loading spinner
  if (isLoading) {
    return (
      <div className={styles.dashboardMainContent}>
        <div className={styles.loadingState}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading your smart home...</p>
        </div>
      </div>
    )
  }

  // If no rooms are available, show an empty state with a button to add rooms
  if (rooms.length === 0) {
    return (
      <div className={styles.dashboardMainContent}>
        <div className={styles.emptyState}>
          <MdDevicesOther size={48} />
          <p>No rooms or devices found. Add some in the Room & Device Management section.</p>
          <button className={styles.addRoomButton} onClick={() => router.push("/dashboard/settings/roomdevices")}>
            Add Rooms & Devices
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.dashboardMainContent}>
      {/* Render each room as a separate section */}
      {rooms.map((room) => (
        <RoomSection key={room.id} title={room.roomName}>
          {devicesByRoom[room.id]?.map((device) => {
            const DeviceIcon = getDeviceIcon(device)
            return (
              <DeviceCard
                key={device.id}
                id={device.id}
                icon={DeviceIcon}
                title={device.deviceName}
                status={device.status || "Off"}
                isActive={device.isActive || false}
                statusColor={device.statusColor || ""}
              />
            )
          })}
          {devicesByRoom[room.id]?.length === 0 && (
            <div className={styles.emptyDeviceMessage}>No devices in this room</div>
          )}
        </RoomSection>
      ))}

      {/* Add padding div for action bar */}
      <div className={"tw:pb-14 tw:max-lg:pb-24"} />

      <div className={`${styles.actionBar} ${isMobileMenuOpen ? styles.hidden : ""}`}>
        <button className={styles.actionButton} onClick={turnOffLightsAndFans}>
          <FaPowerOff />
          Turn Off All Lights and Fans
        </button>
        <button className={styles.actionButton} onClick={turnOffMediaDevices}>
          <MdTv />
          Turn Off TV and Speakers
        </button>
        <button className={styles.actionButton} onClick={turnOnHighVoltageDevices}>
          <MdBolt />
          Test Peak Hour Alert
        </button>
      </div>

      {/* Voltage Alert */}
      {showVoltageAlert && (
        <VoltageAlert
          totalVoltage={totalVoltage}
          threshold={VOLTAGE_THRESHOLD}
          onDismiss={dismissVoltageAlert}
          highVoltageDevices={getHighVoltageDevices()}
        />
      )}
    </div>
  )
}

// Add this at the end of the file, after all the component code
// This is a runtime style addition, not a static CSS file change
if (typeof document !== "undefined") {
  const style = document.createElement("style")
  style.textContent = `
    .mobile-menu-open .${styles.actionBar} {
      display: none !important;
    }
  `
  document.head.appendChild(style)
}

