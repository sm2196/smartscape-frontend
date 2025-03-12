"use client"

import { useState } from "react"
import styles from "./DeviceCard.module.css"
import { DeviceControlPopup } from "./DeviceControlPopup"
import { useDeviceState } from "../../hooks/useDeviceState"

export function DeviceCard({ title, status, icon: Icon, isActive = false, onClick, statusColor, id }) {
  const [showControls, setShowControls] = useState(false)

  // Generate a unique ID if not provided
  const deviceId = id || `device_${title.replace(/\s+/g, "_").toLowerCase()}`

  // Use our custom hook for Firebase state management
  const [deviceState, setDeviceState, initialized] = useDeviceState(deviceId, {
    status,
    isActive,
    statusColor,
  })

  const handleCardClick = (e) => {
    if (onClick) {
      onClick(e)
    } else {
      setShowControls(true)
    }
  }

  const handleUpdateSettings = (newSettings) => {
    setDeviceState(newSettings)
  }

  // Don't render until we've initialized with Firebase data
  if (!initialized) {
    return (
      <button className={`${styles.deviceCard} ${styles.loading}`}>
        <div className={styles.loadingPulse}></div>
      </button>
    )
  }

  return (
    <>
      <button onClick={handleCardClick} className={`${styles.deviceCard} ${deviceState.isActive ? styles.active : ""}`}>
        <Icon className={`${styles.deviceIcon} ${styles[deviceState.statusColor] || ""}`} />
        <div className={styles.deviceName}>{title}</div>
        <div className={styles.deviceStatus}>{deviceState.status}</div>
      </button>

      {showControls && (
        <DeviceControlPopup
          device={{ title, status: deviceState.status, icon: Icon }}
          onClose={() => setShowControls(false)}
          onUpdate={handleUpdateSettings}
        />
      )}
    </>
  )
}