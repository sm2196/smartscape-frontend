"use client"

import { useState } from "react"
import {
  MdLightbulb,
  MdTv,
  MdRecycling,
  MdDoorFront,
  MdTimer,
  MdNotifications,
  MdThermostat,
  MdGarage,
  MdWindPower,
  MdBed,
  MdOutlineLight,
  MdBolt,
} from "react-icons/md"
import { LuHeater, LuLamp, LuLampDesk, LuProjector, LuWashingMachine, LuBlinds } from "react-icons/lu"
import { BsSpeaker } from "react-icons/bs"
import { TbAirConditioning } from "react-icons/tb"
import { FaPowerOff } from "react-icons/fa6"
import { DeviceCard } from "./DeviceCard"
import { RoomSection } from "./RoomSection"
import { VoltageAlert } from "./VoltageAlert"
import styles from "./DashboardContent.module.css"
import { useFirebase, DEFAULT_DEVICE_VOLTAGES } from "../../firebase/FirebaseContext"

// Add this constant at the top of the file, after the imports
// Default voltages for devices

const bedroomDevices = {
  "Master Bedroom": [
    { id: "master_blinds", icon: LuBlinds, title: "Blinds", status: "Closed" },
    { id: "master_door", icon: MdDoorFront, title: "Door", status: "Locked" },
    { id: "master_lamp", icon: LuLampDesk, title: "Bedside Lamp", status: "Off" },
  ],
  "Guest Bedroom": [
    { id: "guest_light", icon: MdLightbulb, title: "Main Light", status: "Off" },
    { id: "guest_ac", icon: TbAirConditioning, title: "AC", status: "22°C", statusColor: "statusBlue" },
  ],
  "Kids Bedroom": [
    {
      id: "kids_water_heater",
      icon: MdThermostat,
      title: "Water Heater",
      status: "45°C",
      isActive: true,
      statusColor: "statusBlue",
    },
    { id: "kids_bed", icon: MdBed, title: "Smart Bed", status: "Occupied" },
    { id: "kids_lamp", icon: LuLampDesk, title: "Study Lamp", status: "Off" },
  ],
}

// Define device IDs for master controls
const lightAndFanDevices = [
  "living_lamp",
  "living_lights",
  "living_fan",
  "garage_lights",
  "master_lamp",
  "guest_light",
  "kids_nightlight",
  "kids_lamp",
]

const mediaDevices = ["living_tv", "living_speaker", "living_projector"]

// Device title mapping
const deviceTitles = {
  living_lamp: "Living Room Lamp",
  living_heater: "Living Room Heater",
  living_fan: "Ceiling Fan",
  living_lights: "Pendant Lights",
  living_tv: "SONY TV",
  living_speaker: "JBL GO 4",
  living_projector: "Epson Projector",
  garage_lights: "Garage Lights",
  garage_freezer: "Freezer",
  garage_washer: "Washing Machine",
  master_lamp: "Master Bedroom Lamp",
  guest_light: "Guest Bedroom Light",
  guest_ac: "Guest Bedroom AC",
  kids_nightlight: "Kids Night Light",
  kids_lamp: "Kids Study Lamp",
  kids_water_heater: "Kids Water Heater",
}

export function DashboardContent() {
  const [selectedBedroom, setSelectedBedroom] = useState("Master Bedroom")
  const {
    updateDeviceState,
    devices,
    totalVoltage,
    isPeakHour,
    showVoltageAlert,
    dismissVoltageAlert,
    triggerVoltageAlert,
    VOLTAGE_THRESHOLD,
  } = useFirebase()

  // Function to turn off all lights and fans
  const turnOffLightsAndFans = () => {
    lightAndFanDevices.forEach((deviceId) => {
      // Get current device state or use default
      const currentState = devices[deviceId] || { status: "Off", isActive: false }

      // Only update if the device is currently active
      if (currentState.isActive) {
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
      const currentState = devices[deviceId] || { status: "Off", isActive: false }

      // Only update if the device is currently active
      if (currentState.isActive) {
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
    // Turn on heater (1500W)
    updateDeviceState("living_heater", {
      status: "On",
      isActive: true,
      statusColor: "statusBlue",
    })

    // Turn on TV (150W)
    updateDeviceState("living_tv", {
      status: "On",
      isActive: true,
      statusColor: "statusGreen",
    })

    // Turn on freezer (700W)
    updateDeviceState("garage_freezer", {
      status: "-6.5°C",
      isActive: true,
      statusColor: "statusBlue",
    })

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
        const voltage = device.voltage || DEFAULT_DEVICE_VOLTAGES[id] || 0
        return device.isActive && voltage > 50
      })
      .map(([id, device]) => ({
        id,
        title: deviceTitles[id] || id,
        voltage: device.voltage || DEFAULT_DEVICE_VOLTAGES[id] || 0,
      }))
      .sort((a, b) => b.voltage - a.voltage) // Sort by voltage, highest first
      .slice(0, 5) // Get top 5 highest voltage devices

    return activeDevices
  }

  return (
    <>
      <RoomSection title="Living Room">
        <DeviceCard id="living_lamp" icon={LuLamp} title="Lamp" status="Off" />
        <DeviceCard id="living_heater" icon={LuHeater} title="Heater" status="Off" />
        <DeviceCard
          id="living_fan"
          icon={MdWindPower}
          title="Ceiling Fan"
          status="Low"
          isActive
          statusColor="statusYellow"
        />
        <DeviceCard id="living_lights" icon={MdOutlineLight} title="Pendant Lights" status="Off" />
        <DeviceCard id="living_tv" icon={MdTv} title="SONY TV" status="On" isActive statusColor="statusGreen" />
        <DeviceCard
          id="living_speaker"
          icon={BsSpeaker}
          title="JBL GO 4"
          status="52% Battery"
          statusColor="statusPink"
        />
        <DeviceCard id="living_projector" icon={LuProjector} title="Epson Projector" status="Off" />
      </RoomSection>

      <RoomSection title="Garage">
        <DeviceCard id="garage_door" icon={MdGarage} title="Garage Door" status="Closed" />
        <DeviceCard
          id="garage_freezer"
          icon={MdThermostat}
          title="Freezer Temp"
          status="-6.5°C"
          statusColor="statusBlue"
        />
        <DeviceCard id="garage_lights" icon={MdLightbulb} title="Lights" status="Off" />
        <DeviceCard
          id="garage_recycling"
          icon={MdRecycling}
          title="Recycling Day"
          status="In 5 Days"
          statusColor="statusGreen"
        />
        <DeviceCard
          id="garage_washer"
          icon={LuWashingMachine}
          title="Washing Machine"
          status="Cycle Complete"
          isActive
        />
      </RoomSection>

      <RoomSection title={selectedBedroom} rooms={Object.keys(bedroomDevices)} handleRoomChange={setSelectedBedroom}>
        {bedroomDevices[selectedBedroom].map((device) => (
          <DeviceCard
            key={device.id}
            id={device.id}
            icon={device.icon}
            title={device.title}
            status={device.status}
            isActive={device.isActive}
            statusColor={device.statusColor}
          />
        ))}
      </RoomSection>

      <RoomSection title="Front Door">
        <DeviceCard id="front_motion" icon={MdTimer} title="Last Motion" status="11 minutes ago" />
        <DeviceCard id="front_door" icon={MdDoorFront} title="Front Door" status="Locked" />
        <DeviceCard
          id="front_notifications"
          icon={MdNotifications}
          title="Notifications"
          status="On"
          isActive
          statusColor="statusYellow"
        />
      </RoomSection>

      <div className="custom-padding" />


      <div className={styles.actionBar}>
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
    </>
  )
}