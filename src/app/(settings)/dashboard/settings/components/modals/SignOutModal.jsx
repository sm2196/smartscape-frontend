"use client"

import { MdClose, MdLogout } from "react-icons/md"
import styles from "./ModalStyles.module.css"

export default function SignOutModal({ isOpen, onClose, onSignOut }) {
  if (!isOpen) return null

  const handleSignOut = () => {
    // Call the provided onSignOut function
    onSignOut()
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={`${styles.modal} ${styles.signOutModal}`} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Sign Out</h2>
          <button className={styles.modalCloseButton} onClick={onClose}>
            <MdClose size={20} />
          </button>
        </div>
        <p className={styles.modalDescription}>
          Are you sure you want to sign out? This will clear your session data from this device.
        </p>
        <div className={styles.modalFooter}>
          <button className={styles.modalButtonSecondary} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.modalButtonPrimary} onClick={handleSignOut}>
            <MdLogout size={16} />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}

