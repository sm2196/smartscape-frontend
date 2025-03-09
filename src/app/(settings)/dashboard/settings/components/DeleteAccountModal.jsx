"use client"

import { useState } from "react"
import { MdClose, MdVisibility, MdVisibilityOff } from "react-icons/md"
import styles from "./ModalStyles.module.css"

export default function DeleteAccountModal({ isOpen, onClose, onDelete, isAdmin, isDeleting }) {
  const [deletePassword, setDeletePassword] = useState("")
  const [deleteError, setDeleteError] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  if (!isOpen) return null

  const handlePasswordChange = (e) => {
    setDeletePassword(e.target.value)
    if (deleteError) setDeleteError("")
  }

  const handleDelete = async () => {
    if (!deletePassword) {
      setDeleteError("Please enter your password to confirm deletion")
      return
    }

    try {
      const result = await onDelete(deletePassword)
      if (!result.success) {
        // Handle specific error cases with user-friendly messages
        switch (result.error) {
          case "auth/invalid-credential":
          case "auth/wrong-password":
            setDeleteError("Incorrect password. Please try again.")
            break
          case "auth/too-many-requests":
            setDeleteError("Too many attempts. Please try again later.")
            break
          case "auth/requires-recent-login":
            setDeleteError("For security, please log out and log in again before deleting your account.")
            break
          case "auth/user-not-found":
            setDeleteError("Unable to verify your account. Please try logging in again.")
            break
          default:
            // Show the specific error message from the cleanup function
            setDeleteError(result.error || "Unable to delete account. Please try again.")
        }
      }
    } catch (error) {
      setDeleteError("An unexpected error occurred. Please try again.")
    }
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
            {deleteError && (
              <div className={styles.errorMessage}>
                <MdClose className={styles.errorIcon} />
                {deleteError}
              </div>
            )}
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

