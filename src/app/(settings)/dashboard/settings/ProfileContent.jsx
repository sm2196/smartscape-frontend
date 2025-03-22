"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import styles from "./ProfileContent.module.css"
import { useAuth } from "@/hooks/useAuth"
import { deleteUserAccount, signOutUser, changeUserPassword } from "@/lib/firebase/auth"
import { updateProfile } from "@/lib/firebase/firestore"
import { isValidPhoneNumber } from "react-phone-number-input"
import { clearAllAppData } from "@/lib/clearAppData"

// Import all caching utilities
import { getUserId, clearRelatedCollectionsCache } from "@/lib/cacheUtils"

// Define cache constants for consistency
const CACHE_COLLECTIONS = ["Users"]

// Import components
import ProfileHeader from "./components/ProfileHeader"
import AccountActions from "./components/AccountActions"
import PersonalInfoSection from "./components/PersonalInfoSection"
import EditFieldModal from "./components/EditFieldModal"
import DeleteAccountModal from "./components/DeleteAccountModal"
import SignOutModal from "./components/SignOutModal"
import ChangePasswordModal from "./components/ChangePasswordModal"

// At the top of the file, add these constants for caching
const CACHE_EXPIRATION = 30 * 60 * 1000 // 30 minutes in milliseconds

export default function ProfileContent() {
  const router = useRouter()
  const { user, profile, error } = useAuth() // Remove fetchProfile from here
  const [isMobile, setIsMobile] = useState(false)
  const [isLoading, setLoading] = useState(false)

  // State for field values
  const [fieldValues, setFieldValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    governmentId: "Verified", // Always set to "Verified"
  })

  // State for modals
  const [editingField, setEditingField] = useState(null)
  const [signOutDialogOpen, setSignOutDialogOpen] = useState(false)

  // State for account operations
  const [isDeleting, setIsDeleting] = useState(false)
  const [toast, setToast] = useState({ visible: false, message: "", type: "" })

  // Add these state variables if they don't exist:
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false)
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false)

  // Check for mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1023)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Load profile data when available - this is the only place we update fieldValues now
  useEffect(() => {
    if (profile && user) {
      setFieldValues({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: user.email || "", // Use user.email from Firebase Auth
        phone: profile.phone || "",
        governmentId: "Verified",
      })
    }
  }, [profile, user])

  // Display mapping for field names
  const displayMapping = {
    name: "Legal name",
    email: "Email address",
    phone: "Phone number",
    governmentId: "Government ID",
  }

  // Update the personalInfoSections array to use user.email directly
  const personalInfoSections = [
    {
      title: displayMapping.name,
      // Ensure we're displaying the exact values from the database, not concatenating them incorrectly
      value: `${fieldValues.firstName} ${fieldValues.lastName}`,
      action: "Edit",
      field: "name",
    },
    {
      title: displayMapping.email,
      value: user?.email || fieldValues.email, // Prioritize user.email
      action: "Edit",
      field: "email",
    },
    {
      title: displayMapping.phone,
      value: fieldValues.phone ? fieldValues.phone : "Add a number to get in touch with you.",
      action: fieldValues.phone ? "Edit" : "Add",
      field: "phone",
    },
    {
      title: displayMapping.governmentId,
      value: fieldValues.governmentId,
      action: null,
      field: "governmentId",
    },
  ]

  // Handle sign out
  const handleSignOut = () => {
    setSignOutDialogOpen(true)
  }

  // Replace the confirmSignOut function with this updated version
  const confirmSignOut = async () => {
    try {
      const result = await signOutUser()
      if (result.success) {
        console.log("Signed out successfully")

        // Clear all application data
        clearAllAppData()

        // Redirect to login page with replace to prevent going back
        router.replace("/")
      } else {
        console.error("Error signing out:", result.error)
        showToast("Failed to sign out. Please try again.", "error")
      }
    } catch (error) {
      console.error("Unexpected error during sign out:", error)
      showToast("An unexpected error occurred. Please try again.", "error")
    }
    setSignOutDialogOpen(false)
  }

  // Replace the confirmDelete function with this updated version
  const confirmDelete = async (password) => {
    setIsDeleting(true)

    try {
      // Attempt to delete the user account
      const authResult = await deleteUserAccount(password)

      if (!authResult.success) {
        setIsDeleting(false)
        return { success: false, error: authResult.error }
      }

      // Clear all application data
      clearAllAppData()

      // Immediately redirect to login page
      router.replace("/")

      return { success: true }
    } catch (error) {
      console.error("Error during account deletion:", error)
      setIsDeleting(false)
      return { success: false, error: "An unexpected error occurred" }
    }
  }

  // Handle field editing
  const handleEdit = (field) => {
    setEditingField(field)
  }

  // Replace instances where we directly access user.uid with getUserId(user)
  // For example, in the handleSaveField function:
  const handleSaveField = async (value) => {
    if (!user) {
      showToast("You must be logged in to update your profile", "error")
      return
    }

    try {
      if (editingField === "name") {
        // Check if name is unchanged
        if (value.firstName === fieldValues.firstName && value.lastName === fieldValues.lastName) {
          showToast("No changes were made to your name", "info")
          setEditingField(null)
          return
        }

        const updateData = {
          firstName: value.firstName,
          lastName: value.lastName,
        }

        // Use getUserId instead of directly accessing user.uid
        const userId = getUserId(user)
        const result = await updateProfile(userId, updateData)

        if (result.success) {
          // Update local state immediately
          setFieldValues((prev) => ({
            ...prev,
            firstName: value.firstName,
            lastName: value.lastName,
          }))

          showToast("Name updated successfully", "success")

          // Clear all cache to ensure fresh data on next load
          clearRelatedCollectionsCache(CACHE_COLLECTIONS)
        } else {
          throw new Error(result.error || "Failed to update name")
        }
      } else if (editingField === "phone") {
        // Check if phone is unchanged
        if (value === fieldValues.phone) {
          showToast("No changes were made to your phone number", "info")
          setEditingField(null)
          return
        }

        // Validate phone number before saving
        if (value && !isValidPhoneNumber(value)) {
          throw new Error("Please enter a valid phone number")
        }

        // Use getUserId instead of directly accessing user.uid
        const userId = getUserId(user)
        const result = await updateProfile(userId, {
          phone: value,
        })

        if (result.success) {
          // Update local state immediately
          setFieldValues((prev) => ({
            ...prev,
            phone: value,
          }))

          showToast("Phone number updated successfully", "success")

          // Clear all cache to ensure fresh data on next load
          clearRelatedCollectionsCache(CACHE_COLLECTIONS)
        } else {
          throw new Error(result.error || "Failed to update phone number")
        }
      } else if (editingField === "email") {
        // Check if email is unchanged
        if (value === user.email || value === fieldValues.email) {
          showToast("No changes were made to your email address", "info")
          setEditingField(null)
          return
        }

        // Use getUserId instead of directly accessing user.uid
        const userId = getUserId(user)
        const result = await updateProfile(userId, {
          email: value,
        })

        if (result.success) {
          if (result.verificationRequired) {
            showToast(result.message, "info")

            // Add timeout and redirect to auth page after showing the message
            setTimeout(() => {
              // Clear all application data and cache
              clearAllAppData()
              clearRelatedCollectionsCache(CACHE_COLLECTIONS)

              // Redirect to auth page
              router.replace("/")
            }, 3000)
          } else {
            // Update local state immediately
            setFieldValues((prev) => ({
              ...prev,
              email: value,
            }))

            showToast("Email updated successfully", "success")
          }

          // Clear all cache to ensure fresh data on next load
          clearRelatedCollectionsCache(CACHE_COLLECTIONS)
        } else {
          if (result.error?.includes("please log out and log back in")) {
            showToast("For security reasons, please log out and log back in before changing your email.", "error")
            setEditingField(null)
            return
          }
          throw new Error(result.error || "Failed to update email")
        }
      }
    } catch (error) {
      console.error(`Error updating ${editingField}:`, error)
      showToast(error.message || `Failed to update ${editingField}`, "error")
    } finally {
      setEditingField(null)
    }
  }

  const confirmChangePassword = async (currentPassword, newPassword) => {
    try {
      const result = await changeUserPassword(currentPassword, newPassword)

      if (result.success) {
        showToast("Password changed successfully", "success")
        return { success: true }
      } else {
        return { success: false, error: result.error || "Failed to change password" }
      }
    } catch (error) {
      console.error("Error changing password:", error)
      return { success: false, error: "An unexpected error occurred" }
    }
  }

  // Toast notification helper
  const showToast = (message, type = "success") => {
    setToast({ visible: true, message, type })
    setTimeout(() => {
      setToast({ visible: false, message: "", type: "" })
    }, 3000)
  }

  if (isLoading && !isDeleting) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading profile...</p>
      </div>
    )
  }

  if (error && !profile && !isDeleting) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorMessage}>{error}</p>
        <button className={styles.retryButton} onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    )
  }

  // Replace the handleOpenChangePasswordModal function with this:
  const handleOpenChangePasswordModal = () => {
    setIsChangePasswordModalOpen(true)
  }

  // Replace the handleCloseChangePasswordModal function with this:
  const handleCloseChangePasswordModal = () => {
    setIsChangePasswordModalOpen(false)
  }

  const handleOpenDeleteAccountModal = () => {
    setIsDeleteAccountModalOpen(true)
  }

  const handleCloseDeleteAccountModal = () => {
    setIsDeleteAccountModalOpen(false)
  }

  // Replace the handleDeleteAccount function with this:
  const handleDeleteAccount = async (password) => {
    return await confirmDelete(password)
  }

  const isAdmin = profile?.isAdmin === true

  return (
    <main className={styles.profileMainContent}>
      <h1 className={styles.header}>Your Profile</h1>

      {/* Profile Header */}
      <ProfileHeader
        user={user}
        profile={profile}
        handleSignOut={handleSignOut}
        onProfileUpdate={async (data) => {
          if (user) {
            try {
              const userId = getUserId(user)
              await updateProfile(userId, data)
              showToast("Profile updated successfully", "success")

              // Clear cache after update
              clearRelatedCollectionsCache(CACHE_COLLECTIONS)
            } catch (error) {
              console.error("Error updating profile:", error)
              showToast("Failed to update profile", "error")
            }
          }
        }}
      />

      {/* Account Actions */}
      <AccountActions
        onChangePassword={handleOpenChangePasswordModal}
        onDeleteAccount={handleOpenDeleteAccountModal}
        isMobile={isMobile}
      />

      {/* Personal Info Section */}
      <PersonalInfoSection personalInfo={personalInfoSections} onEdit={handleEdit} />

      {/* Edit Field Modal */}
      <EditFieldModal
        isOpen={!!editingField}
        onClose={() => setEditingField(null)}
        field={editingField}
        fieldDisplayName={editingField ? displayMapping[editingField] : ""}
        initialValue={
          editingField === "email"
            ? user?.email
            : editingField && editingField !== "name"
              ? fieldValues[editingField]
              : ""
        }
        initialFirstName={fieldValues.firstName}
        initialLastName={fieldValues.lastName}
        onSave={handleSaveField}
      />

      {/* Change Password Modal */}
      {isChangePasswordModalOpen && (
        <ChangePasswordModal
          isOpen={isChangePasswordModalOpen}
          onClose={handleCloseChangePasswordModal}
          onChangePassword={confirmChangePassword}
        />
      )}

      {/* Delete Account Modal */}
      {isDeleteAccountModalOpen && (
        <DeleteAccountModal
          isOpen={isDeleteAccountModalOpen}
          onClose={handleCloseDeleteAccountModal}
          onDelete={handleDeleteAccount}
          isAdmin={isAdmin}
          isDeleting={isDeleting}
        />
      )}

      {/* Sign Out Modal */}
      <SignOutModal isOpen={signOutDialogOpen} onClose={() => setSignOutDialogOpen(false)} onSignOut={confirmSignOut} />

      {/* Toast Notification */}
      {toast.visible && (
        <div
          className={`${styles.toast} ${toast.type === "error" ? styles.toastError : toast.type === "info" ? styles.toastInfo : ""}`}
        >
          {toast.message}
        </div>
      )}
    </main>
  )
}

