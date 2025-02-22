"use client"

import { useState } from "react"
import styles from "./hk-components.module.css"

export default function EmergencyButtons() {
  const [isLockdown, setIsLockdown] = useState(false)

  const handleLockdown = () => {
    setIsLockdown(!isLockdown)
    alert(isLockdown ? "Lockdown deactivated" : "Emergency lockdown activated")
  }

  const handleContactAuthorities = () => {
    alert("Contacting authorities...")
  }

  return (
    <div className={styles.buttonContainer}>
      <button
        onClick={handleLockdown}
        className={`${styles.button} ${isLockdown ? styles.emergencyButtonActive : styles.emergencyButton}`}
      >
        {isLockdown ? "Disable Lockdown" : "Emergency Lockdown"}
      </button>
      <button onClick={handleContactAuthorities} className={`${styles.button} ${styles.contactButton}`}>
        Contact Authorities
      </button>
    </div>
  )
}












