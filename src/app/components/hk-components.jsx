"use client"

import { useState } from "react"
import { MdLockOutline, MdLock, MdLocalPolice } from "react-icons/md"
import styles from "./hk-components.module.css"

export default function EmergencyButtons() {
  const [isLockdown, setIsLockdown] = useState(false)

  const handleLockdown = () => {
    setIsLockdown(!isLockdown)
    // Add your lockdown logic here
    alert(isLockdown ? "Lockdown deactivated" : "Emergency lockdown activated")
  }

  const handleContactAuthorities = () => {
    // Add your contact authorities logic here
    alert("Contacting authorities...")
  }

  return (
    <div className={styles.hkbuttonContainer}>
      <button onClick={handleLockdown} className={isLockdown ? styles.hkemergencyButtonActive : styles.hkemergencyButton}>
        {isLockdown ? <MdLock className={styles.hkbuttonIcon} /> : <MdLockOutline className={styles.hkbuttonIcon} />}
        {isLockdown ? "Disable Lockdown" : "Emergency Lockdown"}
      </button>

      <button onClick={handleContactAuthorities} className={styles.hkcontactButton}>
        <MdLocalPolice className={styles.hkbuttonIcon} />
        Contact Authorities
      </button>
    </div>
  )
}






















