"use client"

import { useState, useRef } from "react"
import {
  MdOutlineMode,
  MdDeleteOutline,
  MdManageAccounts,
  MdSwitchAccount,
  MdPersonAddAlt1,
  MdAccountCircle,
  MdAddAPhoto,
} from "react-icons/md"
import styles from "./ProfileContent.module.css"

export default function ProfileContent() {
  const [isMobile] = useState(false)
  const [editingField, setEditingField] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [profileImage, setProfileImage] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef(null)
  const [fieldValues, setFieldValues] = useState({
    legalName: "Gerald",
    email: "x*****@hw.ac.uk",
    phoneNumbers: [],
    governmentId: "Verified",
    address: "Not provided",
  })
  const [tempValue, setTempValue] = useState("")

  const displayMapping = {
    legalName: "Legal name",
    email: "Email address",
    phoneNumbers: "Phone numbers",
    governmentId: "Government ID",
    address: "Address",
  }

  const handleSignOut = () => {
    console.log("Signing out...")
  }

  const handleDelete = () => {
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    console.log("Deleting account...")
    setDeleteDialogOpen(false)
  }

  const handleEdit = (field) => {
    setEditingField(field)
    setTempValue(fieldValues[field]?.toString() || "")
  }

  const handleSave = () => {
    if (editingField) {
      setFieldValues((prev) => ({
        ...prev,
        [editingField]: tempValue,
      }))
      setEditingField(null)
    }
  }

  const handleProfileImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    setIsUploading(true)

    // Create a FileReader to read the image file
    const reader = new FileReader()
    reader.onload = (event) => {
      setProfileImage(event.target.result)
      setIsUploading(false)
    }
    reader.onerror = () => {
      console.error("Error reading file")
      setIsUploading(false)
    }
    reader.readAsDataURL(file)

    // In a real application, you would upload the file to your server or a storage service
    // For example:
    // const formData = new FormData()
    // formData.append('profileImage', file)
    // fetch('/api/upload-profile-image', {
    //   method: 'POST',
    //   body: formData
    // })
    // .then(response => response.json())
    // .then(data => {
    //   setProfileImage(data.imageUrl)
    //   setIsUploading(false)
    // })
    // .catch(error => {
    //   console.error('Error uploading image:', error)
    //   setIsUploading(false)
    // })
  }

  const accountActions = [
    {
      icon: MdManageAccounts,
      text: "Manage your account",
      mobileText: "Manage",
      onClick: () => console.log("Managing account..."),
    },
    {
      icon: MdSwitchAccount,
      text: "Switch account",
      mobileText: "Switch",
      onClick: () => console.log("Switching account..."),
    },
    {
      icon: MdPersonAddAlt1,
      text: "Add account",
      mobileText: "Add",
      onClick: () => console.log("Adding account..."),
    },
  ]

  const personalInfoSections = Object.keys(fieldValues).map((key) => ({
    title: displayMapping[key],
    value: Array.isArray(fieldValues[key])
      ? fieldValues[key].length
        ? fieldValues[key].join(", ")
        : "Add a number to get in touch with you. You can add other numbers and choose how they're used."
      : fieldValues[key],
    action: key === "phoneNumbers" ? "Add" : "Edit",
  }))

  return (
    <main className={styles.profileMainContent}>
      <h1 className={styles.header}>Your Profile</h1>
      <div className={styles.profileBox}>
        <div className={styles.actionIcons}>
          <button className={styles.iconButton} onClick={() => handleEdit("legalName")}>
            <MdOutlineMode size={22} />
          </button>
          <button className={styles.iconButton} onClick={handleDelete}>
            <MdDeleteOutline size={22} />
          </button>
        </div>

        <div className={styles.profileInfo}>
          <div className={styles.profileImageContainer} onClick={handleProfileImageClick}>
            {profileImage ? (
              <img src={profileImage || "/placeholder.svg"} alt="Profile" className={styles.profileImage} />
            ) : (
              <MdAccountCircle className={styles.logo} size={54} aria-hidden="true" />
            )}
            <div className={styles.profileImageOverlay}>
              <MdAddAPhoto size={20} />
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className={styles.fileInput}
            />
            {isUploading && <div className={styles.uploadingIndicator}>Uploading...</div>}
          </div>
          <div className={styles.textContainer}>
            <p>Admin XYZ</p>
            <p>xyz1234@hw.ac.uk</p>
          </div>
        </div>

        <button className={styles.signOutButton} onClick={handleSignOut}>
          Sign Out
        </button>
      </div>

      <div className={styles.userIcons}>
        {accountActions.map(({ icon: Icon, text, mobileText, onClick }) => (
          <button key={text} className={styles.iconWithText} onClick={onClick}>
            <Icon size={24} />
            <span>{isMobile ? mobileText : text}</span>
          </button>
        ))}
      </div>

      <div>
        <h2 className={styles.personalInfo}>Personal Info</h2>
        <ul className={styles.infoList}>
          {personalInfoSections.map(({ title, value, action }) => (
            <li key={title} className={styles.infoItem}>
              <div className={styles.infoTitle}>
                {title}
                <button
                  className={styles.editButton}
                  onClick={() => handleEdit(Object.keys(displayMapping).find((key) => displayMapping[key] === title))}
                >
                  {action}
                </button>
              </div>
              <div className={styles.infoValue}>{value}</div>
              <div className={styles.infoUnderline}></div>
            </li>
          ))}
        </ul>
      </div>

      {editingField && (
        <div className={styles.modalOverlay} onClick={() => setEditingField(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>
              {editingField === "phoneNumbers" ? "Add" : "Edit"} {displayMapping[editingField]}
            </h2>
            <p className={styles.modalDescription}>
              Make changes to your {displayMapping[editingField]}. Click save when you're done.
            </p>
            <div className={styles.modalContent}>
              <label htmlFor="value" className={styles.modalLabel}>
                {displayMapping[editingField]}
              </label>
              <input
                id="value"
                className={styles.modalInput}
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
              />
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.modalButtonSecondary} onClick={() => setEditingField(null)}>
                Cancel
              </button>
              <button className={styles.modalButtonPrimary} onClick={handleSave}>
                Save changes
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteDialogOpen && (
        <div className={styles.modalOverlay} onClick={() => setDeleteDialogOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>Delete Account</h2>
            <p className={styles.modalDescription}>
              Are you sure you want to delete your account? This action cannot be undone.
            </p>
            <div className={styles.modalFooter}>
              <button className={styles.modalButtonSecondary} onClick={() => setDeleteDialogOpen(false)}>
                Cancel
              </button>
              <button className={`${styles.modalButtonPrimary} ${styles.modalButtonDanger}`} onClick={confirmDelete}>
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

