"use client"

import { useState, useEffect } from "react"
import { MdLockOutline, MdLock, MdLocalPolice } from "react-icons/md"
import styles from "./EmergencyButtons.module.css"
import { useEmergencyLockdown } from "./hooks/useEmergencyLockdown"

export default function EmergencyButtons({ onLockdownChange, isLockdown: initialLockdownState }) {
  const {
    isLockdownActive,
    isLoading,
    error,
    lockdownDetails,
    activateLockdown,
    deactivateLockdown,
    checkLockdownStatus,
  } = useEmergencyLockdown()

  // Local state to track lockdown status
  const [isLockdown, setIsLockdown] = useState(initialLockdownState || false)

  // Sync local state with hook state
  useEffect(() => {
    setIsLockdown(isLockdownActive)

    // Also update parent component if the status is different
    if (isLockdownActive !== initialLockdownState) {
      onLockdownChange(isLockdownActive)
    }
  }, [isLockdownActive, initialLockdownState, onLockdownChange])

  // Check current lockdown status when component mounts
  useEffect(() => {
    checkLockdownStatus()
  }, [checkLockdownStatus])

  const handleLockdown = async () => {
    try {
      const newLockdownState = !isLockdown

      // Call the appropriate function based on the desired state
      const result = newLockdownState ? await activateLockdown() : await deactivateLockdown()

      if (!result.success) {
        throw new Error(result.error || "Failed to update lockdown status")
      }

      // Update local state
      setIsLockdown(newLockdownState)

      // Update parent component
      onLockdownChange(newLockdownState)

      // Show alert with result
      alert(result.message)
    } catch (err) {
      console.error("Error updating lockdown status:", err)
      alert("Error: " + (err.message || "Failed to update lockdown status"))
    }
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

      {error && <div className={styles.errorMessage}>Error: {error}</div>}
    </div>
  )
}

