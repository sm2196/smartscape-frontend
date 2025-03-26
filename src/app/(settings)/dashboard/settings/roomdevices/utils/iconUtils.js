import React from "react"
import { DEVICE_ICONS } from "../constants/deviceTypes"

// Helper function to render the appropriate icon component
export const renderDeviceIcon = (iconName, className = "") => {
  if (!iconName) return null

  // Flatten all icon options into a single array for easier lookup
  const allIcons = Object.values(DEVICE_ICONS).flat()
  const iconConfig = allIcons.find((icon) => icon.name === iconName)

  if (iconConfig) {
    const IconComponent = iconConfig.icon
    return <IconComponent className={className} />
  }

  return null
}

// Get all devices as a flat array for display
export const getAllDevices = (rooms, devices) => {
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
