"use client"

import { useState, useEffect } from "react"
import { MdLockOutline, MdLock, MdLocalPolice } from "react-icons/md"
import styles from "./hk-components.module.css"

export default function EmergencyButtons() {
  const [isLockdown, setIsLockdown] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Fetch initial lockdown status
  useEffect(() => {
    async function fetchLockdownStatus() {
      try {
        const response = await fetch("/api/emergency/lockdown")
        if (response.ok) {
          const data = await response.json()
          setIsLockdown(data.active || false)
        }
      } catch (err) {
        console.error("Error fetching lockdown status:", err)
      }
    }

    fetchLockdownStatus()
  }, [])

  const handleLockdown = async () => {
    setIsLoading(true)

    try {
      const newLockdownState = !isLockdown

      const response = await fetch("/api/emergency/lockdown", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          activate: newLockdownState,
        }),
      })

      if (response.ok) {
        const result = await response.json()
        setIsLockdown(newLockdownState)

        // Show alert with result
        alert(result.message)
      }
    } catch (err) {
      console.error("Error updating lockdown status:", err)
      alert("Failed to update lockdown status")
    } finally {
      setIsLoading(false)
    }
  }

  const handleContactAuthorities = () => {
    alert("Contacting authorities...")
  }

  return (
    <div className={styles.hkbuttonContainer}>
      <button
        onClick={handleLockdown}
        className={isLockdown ? styles.hkemergencyButtonActive : styles.hkemergencyButton}
        disabled={isLoading}
      >
        {isLoading ? (
          "Processing..."
        ) : (
          <>
            {isLockdown ? <MdLock className={styles.hkbuttonIcon} /> : <MdLockOutline className={styles.hkbuttonIcon} />}
            {isLockdown ? "Disable Lockdown" : "Emergency Lockdown"}
          </>
        )}
      </button>

      <button onClick={handleContactAuthorities} className={styles.hkcontactButton}>
        <MdLocalPolice className={styles.hkbuttonIcon} />
        Contact Authorities
      </button>
    </div>
  )
}
























