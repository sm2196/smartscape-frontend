"use client"

import { useState, useEffect } from "react"
import { MdLockOutline, MdLock, MdLocalPolice } from "react-icons/md"
import styles from "./EmergencyButtons.module.css"

export default function EmergencyButtons({ onLockdownChange, isLockdown: initialLockdownState }) {
  const [isLoading, setIsLoading] = useState(false)
  const [isLockdown, setIsLockdown] = useState(initialLockdownState || false)

  // Check current lockdown status when component mounts
  useEffect(() => {
    const checkLockdownStatus = async () => {
      try {
        const response = await fetch("/api/emergency-lockdown")

        if (response.ok) {
          const data = await response.json()

          if (data.success) {
            setIsLockdown(data.isLockdownActive)
            // Also update parent component if the status is different
            if (data.isLockdownActive !== initialLockdownState) {
              onLockdownChange(data.isLockdownActive)
            }
          }
        }
      } catch (error) {
        console.error("Error checking lockdown status:", error)
      }
    }

    checkLockdownStatus()
  }, [initialLockdownState, onLockdownChange])

  const handleLockdown = async () => {
    setIsLoading(true)

    try {
      const newLockdownState = !isLockdown

      const response = await fetch("/api/emergency-lockdown", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          activate: newLockdownState,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to update lockdown status")
      }

      // Update local state
      setIsLockdown(newLockdownState)

      // Update parent component
      onLockdownChange(newLockdownState)

      // Show alert with result
      alert(result.message)
    } catch (error) {
      console.error("Error updating lockdown status:", error)
      alert("Error: " + (error.message || "Failed to update lockdown status"))
    } finally {
      setIsLoading(false)
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
    </div>
  )
}