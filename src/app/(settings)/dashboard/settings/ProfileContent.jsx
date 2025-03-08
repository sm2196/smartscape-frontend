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
  MdClose,
  MdAdd,
  MdLogout,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md"
import styles from "./ProfileContent.module.css"

export default function ProfileContent() {
  const [isMobile] = useState(false)
  const [editingField, setEditingField] = useState(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [signOutDialogOpen, setSignOutDialogOpen] = useState(false)
  const [manageAccountOpen, setManageAccountOpen] = useState(false)
  const [switchAccountOpen, setSwitchAccountOpen] = useState(false)
  const [addAccountOpen, setAddAccountOpen] = useState(false)
  const [profileImage, setProfileImage] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef(null)
  const [fieldValues, setFieldValues] = useState({
    legalName: "Gerald",
    email: "xyz1234@hw.ac.uk",
    phoneNumbers: [],
    governmentId: "Verified",
    address: "Not provided",
  })
  const [tempValue, setTempValue] = useState("")
  const [tempFirstName, setTempFirstName] = useState("")
  const [tempLastName, setTempLastName] = useState("")
  const [fieldError, setFieldError] = useState("")
  const [newAccountData, setNewAccountData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [availableAccounts, setAvailableAccounts] = useState([
    { id: 1, name: "Admin XYZ", email: "xyz1234@hw.ac.uk", isActive: true },
    { id: 2, name: "John Doe", email: "john.doe@hw.ac.uk", isActive: false },
    {
      id: 3,
      name: "Jane Smith",
      email: "jane.smith@hw.ac.uk",
      isActive: false,
    },
  ])
  const [passwordError, setPasswordError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const displayMapping = {
    legalName: "Legal name",
    email: "Email address",
    phoneNumbers: "Phone numbers",
    governmentId: "Government ID",
    address: "Address",
  }

  const handleSignOut = () => {
    setSignOutDialogOpen(true)
  }

  const confirmSignOut = () => {
    console.log("Signing out...")
    setSignOutDialogOpen(false)
    // In a real app, you would redirect to login page or clear auth state
  }

  const handleDelete = () => {
    setManageAccountOpen(false)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    console.log("Deleting account...")
    setDeleteDialogOpen(false)
  }

  const handleEdit = (field) => {
    setManageAccountOpen(false)
    setEditingField(field)
    setFieldError("")

    if (field === "legalName") {
      // Split the legal name into first and last name
      const nameParts = fieldValues[field].split(" ")
      setTempFirstName(nameParts[0] || "")
      setTempLastName(nameParts.slice(1).join(" ") || "")
    } else {
      setTempValue(fieldValues[field]?.toString() || "")
    }
  }

  const handleSave = () => {
    if (editingField) {
      if (editingField === "legalName") {
        if (!tempFirstName.trim() || !tempLastName.trim()) {
          setFieldError("Please fill out all fields")
          return
        }

        setFieldValues((prev) => ({
          ...prev,
          [editingField]: `${tempFirstName} ${tempLastName}`,
        }))
      } else {
        if (!tempValue.trim()) {
          setFieldError("Please fill out this field")
          return
        }

        setFieldValues((prev) => ({
          ...prev,
          [editingField]: tempValue,
        }))
      }
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
  }

  const handleNewAccountChange = (e) => {
    const { name, value } = e.target
    setNewAccountData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAddAccount = (e) => {
    e.preventDefault()
    if (newAccountData.password !== newAccountData.confirmPassword) {
      setPasswordError("Passwords do not match")
      return
    }

    const newAccount = {
      id: availableAccounts.length + 1,
      name: `${newAccountData.firstName} ${newAccountData.lastName}`,
      email: newAccountData.email,
      isActive: false,
    }

    setAvailableAccounts([...availableAccounts, newAccount])
    setNewAccountData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    })
    setPasswordError("")
    setAddAccountOpen(false)
  }

  const handleSwitchAccount = (id) => {
    setAvailableAccounts(
      availableAccounts.map((account) => ({
        ...account,
        isActive: account.id === id,
      })),
    )
    setSwitchAccountOpen(false)
  }

  const accountActions = [
    {
      icon: MdManageAccounts,
      text: "Manage your account",
      mobileText: "Manage",
      onClick: () => setManageAccountOpen(true),
    },
    {
      icon: MdSwitchAccount,
      text: "Switch account",
      mobileText: "Switch",
      onClick: () => setSwitchAccountOpen(true),
    },
    {
      icon: MdAdd,
      text: "Add account",
      mobileText: "Add",
      onClick: () => setAddAccountOpen(true),
    },
  ]

  const personalInfoSections = Object.keys(fieldValues).map((key) => ({
    title: displayMapping[key],
    value: Array.isArray(fieldValues[key])
      ? fieldValues[key].length
        ? fieldValues[key].join(", ")
        : "Add a number to get in touch with you. You can add other numbers and choose how they're used."
      : fieldValues[key],
    action: key === "phoneNumbers" ? "Add" : key === "governmentId" ? null : "Edit",
  }))

  const handleCancelAddAccount = () => {
    setNewAccountData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    })
    setPasswordError("")
    setAddAccountOpen(false)
  }

  return (
    <main className={styles.profileMainContent}>
      <h1 className={styles.header}>Your Profile</h1>
      <div className={styles.profileBox}>
        <div className={styles.profileHeader}>
          <div className={styles.profileInfo}>
            <div className={styles.profileImageContainer} onClick={handleProfileImageClick}>
              {profileImage ? (
                <img src={profileImage || "/placeholder.svg"} alt="Profile" className={styles.profileImage} />
              ) : (
                <MdAccountCircle className={styles.logo} size={64} aria-hidden="true" />
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
              <p className={styles.profileName}>{fieldValues.legalName}</p>
              <p className={styles.profileEmail}>{fieldValues.email}</p>
            </div>
          </div>

          <div>
            <button className={styles.signOutButton} onClick={handleSignOut}>
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className={styles.userIcons}>
        {accountActions.map(({ icon: Icon, text, mobileText, onClick }) => (
          <button key={text} className={styles.iconWithText} onClick={onClick}>
            <div className={styles.iconWrapper}>
              <Icon size={24} />
            </div>
            <span>{isMobile ? mobileText : text}</span>
          </button>
        ))}
      </div>

      <div className={styles.personalInfoSection}>
        <h2 className={styles.personalInfo}>Personal Info</h2>
        <ul className={styles.infoList}>
          {personalInfoSections.map(({ title, value, action }) => (
            <li key={title} className={styles.infoItem}>
              <div className={styles.infoHeader}>
                <div className={styles.infoTitle}>{title}</div>
                {action && (
                  <button
                    className={styles.editButton}
                    onClick={() => handleEdit(Object.keys(displayMapping).find((key) => displayMapping[key] === title))}
                  >
                    {action === "Edit" ? <MdOutlineMode size={16} /> : <MdAdd size={16} />}
                    <span>{action}</span>
                  </button>
                )}
              </div>
              <div className={styles.infoValue}>{value}</div>
            </li>
          ))}
        </ul>
      </div>

      {editingField && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {editingField === "phoneNumbers" ? "Add" : "Edit"} {displayMapping[editingField]}
              </h2>
              <button className={styles.modalCloseButton} onClick={() => setEditingField(null)}>
                <MdClose size={20} />
              </button>
            </div>
            <p className={styles.modalDescription}>
              Make changes to your {displayMapping[editingField].toLowerCase()}. Click save when you're done.
            </p>
            <div className={styles.modalContent}>
              {editingField === "legalName" ? (
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
                    {displayMapping[editingField]}
                  </label>
                  <input
                    id="value"
                    className={`${styles.modalInput} ${fieldError ? styles.inputError : ""}`}
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    placeholder={`Enter your ${displayMapping[editingField].toLowerCase()}`}
                    autoFocus
                  />
                </>
              )}
              {fieldError && <div className={styles.errorMessage}>{fieldError}</div>}
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

      {/* Delete Account Modal */}
      {deleteDialogOpen && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modal} ${styles.deleteModal}`} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Delete Account</h2>
              <button className={styles.modalCloseButton} onClick={() => setDeleteDialogOpen(false)}>
                <MdClose size={20} />
              </button>
            </div>
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

      {/* Sign Out Confirmation Modal */}
      {signOutDialogOpen && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modal} ${styles.signOutModal}`} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Sign Out</h2>
              <button className={styles.modalCloseButton} onClick={() => setSignOutDialogOpen(false)}>
                <MdClose size={20} />
              </button>
            </div>
            <p className={styles.modalDescription}>Are you sure you want to sign out?</p>
            <div className={styles.modalFooter}>
              <button className={styles.modalButtonSecondary} onClick={() => setSignOutDialogOpen(false)}>
                Cancel
              </button>
              <button className={styles.modalButtonPrimary} onClick={confirmSignOut}>
                <MdLogout size={16} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Account Modal */}
      {manageAccountOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Manage Account</h2>
              <button className={styles.modalCloseButton} onClick={() => setManageAccountOpen(false)}>
                <MdClose size={20} />
              </button>
            </div>
            <div className={styles.modalContent}>
              <div className={styles.accountManagementOptions}>
                <button className={styles.accountOption} onClick={() => handleEdit("legalName")}>
                  <MdOutlineMode size={20} />
                  <span>Edit Profile Information</span>
                </button>
                <button className={styles.accountOption} onClick={() => setManageAccountOpen(false)}>
                  <MdSwitchAccount size={20} />
                  <span>Change Password</span>
                </button>
                <button className={styles.accountOption} onClick={() => setManageAccountOpen(false)}>
                  <MdPersonAddAlt1 size={20} />
                  <span>Privacy Settings</span>
                </button>
                <button className={`${styles.accountOption} ${styles.dangerOption}`} onClick={handleDelete}>
                  <MdDeleteOutline size={20} />
                  <span>Delete Account</span>
                </button>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.modalButtonSecondary} onClick={() => setManageAccountOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Switch Account Modal */}
      {switchAccountOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Switch Account</h2>
              <button className={styles.modalCloseButton} onClick={() => setSwitchAccountOpen(false)}>
                <MdClose size={20} />
              </button>
            </div>
            <div className={styles.modalContent}>
              <p className={styles.modalDescription}>Select an account to switch to:</p>
              <div className={styles.accountsList}>
                {availableAccounts.map((account) => (
                  <div key={account.id} className={styles.accountItem}>
                    <div className={styles.accountAvatar}>
                      <MdAccountCircle size={24} />
                    </div>
                    <div className={styles.accountInfo}>
                      <div className={styles.accountName}>{account.name}</div>
                      <div className={styles.accountEmail}>{account.email}</div>
                    </div>
                    {account.isActive ? (
                      <div className={styles.activeAccount}>Current</div>
                    ) : (
                      <button className={styles.switchToButton} onClick={() => handleSwitchAccount(account.id)}>
                        Switch
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.modalButtonSecondary} onClick={() => setSwitchAccountOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Account Modal */}
      {addAccountOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Add New Account</h2>
              <button className={styles.modalCloseButton} onClick={() => setAddAccountOpen(false)}>
                <MdClose size={20} />
              </button>
            </div>
            <form onSubmit={handleAddAccount}>
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
                    <button
                      type="button"
                      className={styles.passwordToggle}
                      onClick={() => setShowPassword(!showPassword)}
                    >
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
              </div>
              <div className={styles.modalFooter}>
                <button type="button" className={styles.modalButtonSecondary} onClick={handleCancelAddAccount}>
                  Cancel
                </button>
                <button type="submit" className={styles.modalButtonPrimary}>
                  <MdAdd size={16} />
                  Add Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}

