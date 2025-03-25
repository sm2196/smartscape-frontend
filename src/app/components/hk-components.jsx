"use client"

import { useState } from "react"
import { MdLockOutline, MdLock, MdLocalPolice } from "react-icons/md"
import styles from "./hk-components.module.css"

export default function EmergencyButtons({ onLockdownChange, isLockdown }) {
  const [isLoading, setIsLoading] = useState(false)

  const handleLockdown = () => {
    setIsLoading(true)

    // Simulate a loading delay
    setTimeout(() => {
      const newLockdownState = !isLockdown
      onLockdownChange(newLockdownState)

      // Show alert with result
      alert(newLockdownState ? "Emergency lockdown activated" : "Lockdown deactivated")

      setIsLoading(false)
    }, 500)
  }

  const handleContactAuthorities = () => {
    alert("Contacting authorities...")
  }

  return (
    <div className={styles.buttonContainer}>
      <div className={styles.actionButtons}>
        <button
          onClick={handleLockdown}
          className={isLockdown ? styles.emergencyButtonActive : styles.emergencyButton}
          disabled={isLoading}
        >
          {isLoading ? (
            "Processing..."
          ) : (
            <>
              {isLockdown ? <MdLock className={styles.buttonIcon} /> : <MdLockOutline className={styles.buttonIcon} />}
              {isLockdown ? "Disable Lockdown" : "Emergency Lockdown"}
            </>
          )}
        </button>

        <button onClick={handleContactAuthorities} className={styles.contactButton}>
          <MdLocalPolice className={styles.buttonIcon} />
          Contact Authorities
        </button>
      </div>
    </div>
  )
}





























