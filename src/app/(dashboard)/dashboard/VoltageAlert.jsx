"use client"

import { useState, useEffect } from "react"
import { MdWarning, MdClose } from "react-icons/md"
import styles from "./VoltageAlert.module.css"

export function VoltageAlert({ totalVoltage, threshold, onDismiss, highVoltageDevices }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Add a small delay for animation
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    setTimeout(onDismiss, 300) // Wait for animation to complete
  }

  return (
    <>
      <div className={`${styles.overlay} ${isVisible ? styles.visible : ""}`} onClick={handleDismiss} />
      <div className={`${styles.alert} ${isVisible ? styles.visible : ""}`}>
        <div className={styles.alertHeader}>
          <div className={styles.alertTitle}>
            <MdWarning className={styles.alertIcon} />
            Peak Hour Energy Alert
          </div>
          <button className={styles.closeButton} onClick={handleDismiss}>
            <MdClose />
          </button>
        </div>
        <div className={styles.alertContent}>
          <p className="tw:text-[color:var(--text-primary)]">
            Your current energy usage is <strong>{totalVoltage}W</strong>, which exceeds the recommended threshold of{" "}
            <strong>{threshold}W</strong> during peak hours (6PM-8PM).
          </p>

          <h3 className={styles.deviceListTitle}>Consider turning off these high-consumption devices:</h3>
          <ul className={styles.deviceList}>
            {highVoltageDevices.map((device) => (
              <li key={device.id} className={styles.deviceItem}>
                <span className={styles.deviceName}>{device.title}</span>
                <span className={styles.deviceVoltage}>{device.voltage}W</span>
              </li>
            ))}
          </ul>

          <p className={styles.alertTip}>
            Reducing your energy consumption during peak hours helps prevent grid overload and can lower your
            electricity bill.
          </p>
        </div>
      </div>
    </>
  )
}