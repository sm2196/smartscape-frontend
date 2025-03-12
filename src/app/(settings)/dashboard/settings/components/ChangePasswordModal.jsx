"use client"

import { useState } from "react"
import { MdClose, MdVisibility, MdVisibilityOff, MdLock } from "react-icons/md"
import styles from "./ModalStyles.module.css"

export default function ChangePasswordModal({ isOpen, onClose, onChangePassword }) {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [isChanging, setIsChanging] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  if (!isOpen) return null

  const validatePassword = (password) => {
    const passwordPattern = /^(?=.*\d)(?=.*[@$!%*?&])(?=.*[A-Za-z]).{8,}$/
    return passwordPattern.test(password)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Reset errors and success message
    setErrors({})
    setSuccessMessage("")

    // Validate inputs
    const newErrors = {}

    if (!currentPassword) {
      newErrors.currentPassword = "Current password is required"
    }

    if (!newPassword) {
      newErrors.newPassword = "New password is required"
    } else if (!validatePassword(newPassword)) {
      newErrors.newPassword =
        "Password must be at least 8 characters long and include one special character (@$!%*?&) and one number"
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password"
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // All validations passed, proceed with password change
    setIsChanging(true)

    try {
      const result = await onChangePassword(currentPassword, newPassword)

      if (result.success) {
        setSuccessMessage("Password changed successfully!")
        // Clear form after successful change
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")

        // Close modal after a delay
        setTimeout(() => {
          onClose()
          setSuccessMessage("")
        }, 2000)
      } else {
        // Handle specific errors
        if (result.error.includes("Current password is incorrect")) {
          setErrors({ currentPassword: "Current password is incorrect" })
        } else if (result.error.includes("Too many attempts")) {
          setErrors({ general: "Too many attempts. Please try again later." })
        } else {
          setErrors({ general: result.error || "Failed to change password" })
        }
      }
    } catch (error) {
      setErrors({ general: "An unexpected error occurred. Please try again." })
    } finally {
      setIsChanging(false)
    }
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Change Password</h2>
          <button className={styles.modalCloseButton} onClick={onClose} disabled={isChanging}>
            <MdClose size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.modalContent}>
            <div className={styles.passwordRequirements} style={{ marginBottom: "24px" }}>
              <MdLock className={styles.lockIcon} />
              <p>Your password must:</p>
              <ul>
                <li>Be at least 8 characters long</li>
                <li>Include at least one number</li>
                <li>Include at least one special character (@$!%*?&)</li>
                <li>Include both uppercase and lowercase letters</li>
              </ul>
            </div>

            {errors.general && <div className={styles.errorMessage}>{errors.general}</div>}

            {successMessage && (
              <div className={styles.successMessage} style={{ marginBottom: "24px" }}>
                {successMessage}
              </div>
            )}

            <div className={styles.formGroup}>
              <label htmlFor="currentPassword" className={styles.modalLabel}>
                Current Password
              </label>
              <div className={styles.passwordInputWrapper}>
                <input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  className={`${styles.modalInput} ${errors.currentPassword ? styles.inputError : ""}`}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  disabled={isChanging}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  disabled={isChanging}
                >
                  {showCurrentPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                </button>
              </div>
              {errors.currentPassword && <div className={styles.fieldError}>{errors.currentPassword}</div>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="newPassword" className={styles.modalLabel}>
                New Password
              </label>
              <div className={styles.passwordInputWrapper}>
                <input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  className={`${styles.modalInput} ${errors.newPassword ? styles.inputError : ""}`}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={isChanging}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  disabled={isChanging}
                >
                  {showNewPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                </button>
              </div>
              {errors.newPassword && <div className={styles.fieldError}>{errors.newPassword}</div>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword" className={styles.modalLabel}>
                Confirm New Password
              </label>
              <div className={styles.passwordInputWrapper}>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  className={`${styles.modalInput} ${errors.confirmPassword ? styles.inputError : ""}`}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isChanging}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isChanging}
                >
                  {showConfirmPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                </button>
              </div>
              {errors.confirmPassword && <div className={styles.fieldError}>{errors.confirmPassword}</div>}
            </div>
          </div>
          <div className={styles.modalFooter}>
            <button type="button" className={styles.modalButtonSecondary} onClick={onClose} disabled={isChanging}>
              Cancel
            </button>
            <button
              type="submit"
              className={`${styles.modalButtonPrimary} ${isChanging ? styles.saving : ""}`}
              disabled={isChanging}
            >
              {isChanging ? <span className={styles.buttonSpinner}></span> : "Change Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

