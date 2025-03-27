"use client"

import { useState, useEffect } from "react"
import { MdClose, MdCheck } from "react-icons/md"
import styles from "./ModalStyles.module.css"
import PhoneInput from "react-phone-number-input"
import "react-phone-number-input/style.css"

export default function EditFieldModal({
  isOpen,
  onClose,
  field,
  fieldDisplayName,
  initialValue,
  initialFirstName = "",
  initialLastName = "",
  onSave,
}) {
  // Initialize state with initial values
  const [tempValue, setTempValue] = useState(initialValue || "")
  const [tempFirstName, setTempFirstName] = useState(initialFirstName || "")
  const [tempLastName, setTempLastName] = useState(initialLastName || "")
  const [fieldError, setFieldError] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  // Update state when initial values change
  useEffect(() => {
    setTempValue(initialValue || "")
    setTempFirstName(initialFirstName || "")
    setTempLastName(initialLastName || "")
    setFieldError("")
    setShowSuccess(false)
  }, [initialValue, initialFirstName, initialLastName])

  if (!isOpen) return null

  const handleSave = async () => {
    try {
      setIsSaving(true)
      setFieldError("")

      if (field === "name") {
        if (!tempFirstName.trim() || !tempLastName.trim()) {
          setFieldError("Please fill out all fields")
          return
        }
        await onSave({ firstName: tempFirstName, lastName: tempLastName })
      } else {
        if (!tempValue.trim()) {
          setFieldError("Please fill out this field")
          return
        }
        await onSave(tempValue)
      }

      // Show success message
      setShowSuccess(true)

      // Close modal after a delay
      setTimeout(() => {
        onClose()
        setShowSuccess(false)
      }, 1500)
    } catch (error) {
      setFieldError(error.message || "Failed to save changes")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Edit {fieldDisplayName}</h2>
          <button className={styles.modalCloseButton} onClick={onClose}>
            <MdClose size={20} />
          </button>
        </div>
        <p className={styles.modalDescription}>
          Make changes to your {fieldDisplayName.toLowerCase()}. Click save when you&apos;re done.
        </p>
        <div className={styles.modalContent}>
          {field === "name" ? (
            <div className={styles.nameFieldsRow}>
              <div className={styles.formGroup}>
                <label htmlFor="firstName" className={styles.modalLabel}>
                  First Name
                </label>
                <input
                  id="firstName"
                  className={`${styles.modalInput} ${fieldError && !tempFirstName.trim() ? styles.inputError : ""}`}
                  value={tempFirstName}
                  onChange={(e) => {
                    setTempFirstName(e.target.value)
                    setFieldError("")
                  }}
                  placeholder="Enter your first name"
                  autoFocus
                  disabled={isSaving}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="lastName" className={styles.modalLabel}>
                  Last Name
                </label>
                <input
                  id="lastName"
                  className={`${styles.modalInput} ${fieldError && !tempLastName.trim() ? styles.inputError : ""}`}
                  value={tempLastName}
                  onChange={(e) => {
                    setTempLastName(e.target.value)
                    setFieldError("")
                  }}
                  placeholder="Enter your last name"
                  disabled={isSaving}
                />
              </div>
            </div>
          ) : field === "phone" ? (
            <div className={styles.formGroup}>
              <label htmlFor="phone" className={styles.modalLabel}>
                {fieldDisplayName}
              </label>
              <div className={`${styles.phoneInputWrapper} ${fieldError ? styles.inputError : ""}`}>
                <PhoneInput
                  international
                  defaultCountry="AE"
                  value={tempValue}
                  onChange={(value) => {
                    setTempValue(value)
                    setFieldError("")
                  }}
                  placeholder="Enter your phone number"
                  disabled={isSaving}
                />
              </div>
            </div>
          ) : field === "email" ? (
            <div className={styles.formGroup}>
              <label htmlFor="value" className={styles.modalLabel}>
                {fieldDisplayName}
              </label>
              <input
                id="value"
                className={`${styles.modalInput} ${fieldError || (tempValue && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(tempValue)) ? styles.inputError : ""}`}
                value={tempValue}
                onChange={(e) => {
                  const newValue = e.target.value
                  setTempValue(newValue)
                  // Clear validation error when field is cleared or valid
                  if (!newValue || /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(newValue)) {
                    setFieldError("")
                  }
                }}
                onBlur={() => {
                  // Validate on blur for better UX
                  if (tempValue && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(tempValue)) {
                    setFieldError("Please enter a valid email address")
                  }
                }}
                placeholder={`Enter your ${fieldDisplayName.toLowerCase()}`}
                type="email"
                autoFocus
                disabled={isSaving}
              />
              {tempValue && !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(tempValue) && !fieldError && (
                <div className={styles.fieldError}>Please enter a valid email address</div>
              )}
            </div>
          ) : (
            <div className={styles.formGroup}>
              <label htmlFor="value" className={styles.modalLabel}>
                {fieldDisplayName}
              </label>
              <input
                id="value"
                className={`${styles.modalInput} ${fieldError ? styles.inputError : ""}`}
                value={tempValue}
                onChange={(e) => {
                  setTempValue(e.target.value)
                  setFieldError("")
                }}
                placeholder={`Enter your ${fieldDisplayName.toLowerCase()}`}
                type={field === "email" ? "email" : "text"}
                autoFocus
                disabled={isSaving}
              />
            </div>
          )}
          {fieldError && <div className={styles.errorMessage}>{fieldError}</div>}
          {showSuccess && (
            <div className={styles.successMessage}>
              <MdCheck size={16} />
              Changes saved successfully!
            </div>
          )}
        </div>
        <div className={styles.modalFooter}>
          <button
            className={styles.modalButtonSecondary}
            onClick={() => {
              // Reset values to initial state when canceling
              setTempValue(initialValue || "")
              setTempFirstName(initialFirstName || "")
              setTempLastName(initialLastName || "")
              setFieldError("")
              setShowSuccess(false)
              onClose()
            }}
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            className={`${styles.modalButtonPrimary} ${isSaving ? styles.saving : ""}`}
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? <span className={styles.buttonSpinner}></span> : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  )
}

