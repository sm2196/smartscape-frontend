"use client"

import { useState } from "react"
import { MdClose, MdAdd, MdVisibility, MdVisibilityOff } from "react-icons/md"
import styles from "./ModalStyles.module.css"

export default function AddAccountModal({ isOpen, onClose, onAddAccount, isSubmitting, successMessage, errorMessage }) {
  const [newAccountData, setNewAccountData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  // Add password validation
  const [passwordError, setPasswordError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  if (!isOpen) return null

  const handleNewAccountChange = (e) => {
    const { name, value } = e.target
    setNewAccountData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (passwordError) setPasswordError("")
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Add password length validation
    if (newAccountData.password.length < 6) {
      setPasswordError("Password must be at least 6 characters long")
      return
    }

    if (newAccountData.password !== newAccountData.confirmPassword) {
      setPasswordError("Passwords do not match")
      return
    }
    onAddAccount(newAccountData)
  }

  const handleCancel = () => {
    setNewAccountData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    })
    setPasswordError("")
    onClose()
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Add New Account</h2>
          <button className={styles.modalCloseButton} onClick={onClose}>
            <MdClose size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.modalContent}>
            <div className={styles.nameFieldsRow}>
              <div className={styles.formGroup}>
                <label htmlFor="firstName" className={styles.modalLabel}>
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  className={styles.modalInput}
                  value={newAccountData.firstName}
                  onChange={handleNewAccountChange}
                  placeholder="Enter first name"
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="lastName" className={styles.modalLabel}>
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  className={styles.modalInput}
                  value={newAccountData.lastName}
                  onChange={handleNewAccountChange}
                  placeholder="Enter last name"
                  required
                />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.modalLabel}>
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className={styles.modalInput}
                value={newAccountData.email}
                onChange={handleNewAccountChange}
                placeholder="Enter email address"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.modalLabel}>
                Password
              </label>
              <div className={styles.passwordInputWrapper}>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className={styles.modalInput}
                  value={newAccountData.password}
                  onChange={handleNewAccountChange}
                  placeholder="Create a password"
                  required
                />
                <button type="button" className={styles.passwordToggle} onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                </button>
              </div>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword" className={styles.modalLabel}>
                Confirm Password
              </label>
              <div className={styles.passwordInputWrapper}>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  className={styles.modalInput}
                  value={newAccountData.confirmPassword}
                  onChange={handleNewAccountChange}
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                </button>
              </div>
            </div>
            {passwordError && <div className={styles.errorMessage}>{passwordError}</div>}
            {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
            {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
          </div>
          <div className={styles.modalFooter}>
            <button type="button" className={styles.modalButtonSecondary} onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit" className={styles.modalButtonPrimary} disabled={isSubmitting}>
              {isSubmitting ? (
                <span className={styles.buttonSpinner}></span>
              ) : (
                <>
                  <MdAdd size={16} />
                  Add Account
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

