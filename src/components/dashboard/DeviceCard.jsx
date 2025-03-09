"use client"

import { useState } from "react"
import styles from "./DeviceCard.module.css"
import { DeviceControlPopup } from "./DeviceControlPopup"

export function DeviceCard({ title, status, icon: Icon, isActive = false, onClick, statusColor }) {
  const [showControls, setShowControls] = useState(false)
  const [deviceState, setDeviceState] = useState({
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
    setDeviceState({
      ...deviceState,
      ...newSettings,
    })
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