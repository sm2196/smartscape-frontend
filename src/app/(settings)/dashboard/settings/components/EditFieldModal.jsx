"use client"

import { useState } from "react"
import { MdClose } from "react-icons/md"
import styles from "../ProfileContent.module.css"

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
  const [tempValue, setTempValue] = useState(initialValue || "")
  const [tempFirstName, setTempFirstName] = useState(initialFirstName || "")
  const [tempLastName, setTempLastName] = useState(initialLastName || "")
  const [fieldError, setFieldError] = useState("")

  if (!isOpen) return null

  const handleSave = () => {
    if (field === "name") {
      if (!tempFirstName.trim() || !tempLastName.trim()) {
        setFieldError("Please fill out all fields")
        return
      }
      onSave({ firstName: tempFirstName, lastName: tempLastName })
    } else {
      if (!tempValue.trim()) {
        setFieldError("Please fill out this field")
        return
      }
      onSave(tempValue)
    }
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {"Edit"} {fieldDisplayName}
          </h2>
          <button className={styles.modalCloseButton} onClick={onClose}>
            <MdClose size={20} />
          </button>
        </div>
        <p className={styles.modalDescription}>
          Make changes to your {fieldDisplayName.toLowerCase()}. Click save when you're done.
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
                  onChange={(e) => setTempFirstName(e.target.value)}
                  placeholder="Enter your first name"
                  autoFocus
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
                  onChange={(e) => setTempLastName(e.target.value)}
                  placeholder="Enter your last name"
                />
              </div>
            </div>
          ) : (
            <>
              <label htmlFor="value" className={styles.modalLabel}>
                {fieldDisplayName}
              </label>
              <input
                id="value"
                className={`${styles.modalInput} ${fieldError ? styles.inputError : ""}`}
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                placeholder={`Enter your ${fieldDisplayName.toLowerCase()}`}
                autoFocus
              />
            </>
          )}
          {fieldError && <div className={styles.errorMessage}>{fieldError}</div>}
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.modalButtonSecondary} onClick={onClose}>
            Cancel
          </button>
          <button className={styles.modalButtonPrimary} onClick={handleSave}>
            Save changes
          </button>
        </div>
      </div>
    </div>
  )
}

