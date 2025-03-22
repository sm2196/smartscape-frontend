"use client"

import { useState } from "react"
import { MdOutlineShield, MdShield, MdLocalPolice, MdWarning } from "react-icons/md"
import styles from "./EmergencyButtons.module.css"

export default function EmergencyButtons() {
  const [isLockdown, setIsLockdown] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  const handleLockdown = () => {
    if (!isLockdown) {
      // Show confirmation before activating lockdown
      setShowConfirmation(true)
    } else {
      // Directly deactivate lockdown
      setIsLockdown(false)
      alert("Lockdown deactivated")
    }
  }

  const confirmLockdown = () => {
    setIsLockdown(true)
    setShowConfirmation(false)
    alert("Emergency lockdown activated")
  }

  const cancelLockdown = () => {
    setShowConfirmation(false)
  }

  const handleContactAuthorities = () => {
    // Add your contact authorities logic here
    alert("Contacting authorities...")
  }

  return (
    <div className={styles.container}>
      {showConfirmation ? (
        <div className={styles.confirmationPanel}>
          <div className={styles.confirmationContent}>
            <MdWarning className={styles.confirmationIcon} />
            <h3 className={styles.confirmationTitle}>Confirm Emergency Lockdown</h3>
            <p className={styles.confirmationText}>
              Are you sure you want to activate emergency lockdown? This will secure all doors and notify emergency
              contacts.
            </p>
            <div className={styles.confirmationButtons}>
              <button onClick={cancelLockdown} className={styles.cancelButton}>
                Cancel
              </button>
              <button onClick={confirmLockdown} className={styles.confirmButton}>
                Activate Lockdown
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.buttonContainer}>
          <button
            onClick={handleLockdown}
            className={isLockdown ? styles.emergencyButtonActive : styles.emergencyButton}
            aria-label={isLockdown ? "Disable Lockdown" : "Emergency Lockdown"}
          >
            {isLockdown ? (
              <MdShield className={styles.buttonIcon} />
            ) : (
              <MdOutlineShield className={styles.buttonIcon} />
            )}
            {isLockdown ? "Disable Lockdown" : "Emergency Lockdown"}
          </button>

          <button onClick={handleContactAuthorities} className={styles.contactButton} aria-label="Contact Authorities">
            <MdLocalPolice className={styles.buttonIcon} />
            Contact Authorities
          </button>
        </div>
      )}
    </div>
  )
}

