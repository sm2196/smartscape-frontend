"use client"

import { useState } from "react"
import { MdClose, MdVisibility, MdVisibilityOff } from "react-icons/md"
import styles from "../ProfileContent.module.css"

export default function DeleteAccountModal({ isOpen, onClose, onDelete, isAdmin, isDeleting }) {
  const [deletePassword, setDeletePassword] = useState("")
  const [deleteError, setDeleteError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  if (!isOpen) return null

  const handlePasswordChange = (e) => {
    setDeletePassword(e.target.value)
    if (deleteError) setDeleteError("")
  }

  const handleDelete = () => {
    if (!deletePassword) {
      setDeleteError("Please enter your password to confirm deletion")
      return
    }
    onDelete(deletePassword)
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={`${styles.modal} ${styles.deleteModal}`} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Delete Account</h2>
          <button className={styles.modalCloseButton} onClick={onClose}>
            <MdClose size={20} />
          </button>
        </div>
        <p className={styles.modalDescription}>
          Are you sure you want to delete your account? This action cannot be undone.
          {isAdmin && (
            <span className={styles.warningText}>
              <br />
              <br />
              Warning: As an administrator, deleting your account will also delete all user accounts you manage.
            </span>
          )}
        </p>
        <div className={styles.modalContent}>
          <div className={styles.formGroup}>
            <label htmlFor="deletePassword" className={styles.modalLabel}>
              Enter your password to confirm
            </label>
            <div className={styles.passwordInputWrapper}>
              <input
                id="deletePassword"
                type={showPassword ? "text" : "password"}
                className={`${styles.modalInput} ${deleteError ? styles.inputError : ""}`}
                value={deletePassword}
                onChange={handlePasswordChange}
                placeholder="Enter your password"
              />
              <button type="button" className={styles.passwordToggle} onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
              </button>
            </div>
            {deleteError && <div className={styles.errorMessage}>{deleteError}</div>}
          </div>
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.modalButtonSecondary} onClick={onClose} disabled={isDeleting}>
            Cancel
          </button>
          <button
            className={`${styles.modalButtonPrimary} ${styles.modalButtonDanger}`}
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? <span className={styles.buttonSpinner}></span> : "Delete Account"}
          </button>
        </div>
      </div>
    </div>
  )
}

