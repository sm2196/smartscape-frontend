"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import styles from "./ProfileContent.module.css"
import { useAuth } from "@/hooks/useAuth"
import { deleteUserAccount, signOutUser, changeUserPassword } from "@/lib/firebase/auth"
import { getProfilesByEmail, updateProfile } from "@/lib/firebase/firestore"
import { isValidPhoneNumber } from "react-phone-number-input"
import { clearAllAppData } from "@/lib/clearAppData"

// Import all caching utilities
import {
  getUserId,
  saveRelatedCollectionsToCache,
  clearRelatedCollectionsCache,
  getRelatedCollectionsFromCache,
} from "@/lib/cacheUtils"

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
  const { user, profile, loading, error, fetchProfile } = useAuth()
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
  const [manageAccountOpen, setManageAccountOpen] = useState(false)
  const [switchAccountOpen, setSwitchAccountOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [signOutDialogOpen, setSignOutDialogOpen] = useState(false)
  const [changePasswordOpen, setChangePasswordOpen] = useState(false)

  // State for account operations
  const [availableAccounts, setAvailableAccounts] = useState([])
  const [isDeleting, setIsDeleting] = useState(false)
  const [toast, setToast] = useState({ visible: false, message: "", type: "" })

  // Add these state variables if they don't exist:
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false)
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false)

  // Update the refreshProfile function to use caching
  const refreshProfile = useCallback(async () => {
    if (user) {
      setLoading(true)

      try {
        // Clear cache first to ensure fresh data
        clearRelatedCollectionsCache(CACHE_COLLECTIONS)

        // Fetch fresh profile data
        await fetchProfile(user.uid)

        // If we have profile data, save it to cache
        if (profile) {
          saveRelatedCollectionsToCache(CACHE_COLLECTIONS, [profile])
        }
      } catch (error) {
        console.error("Error refreshing profile:", error)
        showToast("Failed to refresh profile data", "error")
      } finally {
        setLoading(false)
      }
    }
  }, [user, profile, fetchProfile])

  const userId = user?.uid

  // Add a new function to fetch profile data with caching
  const fetchProfileWithCache = useCallback(
    async (skipCache = false) => {
      try {
        if (!userId) return

        // Check cache first if not skipping cache
        if (!skipCache) {
          const cachedData = getRelatedCollectionsFromCache(CACHE_COLLECTIONS, CACHE_EXPIRATION)
          if (cachedData && cachedData.users) {
            setFieldValues({
              firstName: cachedData.users.firstName || "",
              lastName: cachedData.users.lastName || "",
              email: user?.email || cachedData.users.email || "",
              phone: cachedData.users.phone || "",
              governmentId: "Verified",
            })
            return
          }
        }

        // If no cache or skipCache is true, fetch from Firestore via initialFetchProfile
        if (user) {
          await fetchProfile(user.uid)

          // Update cache with fresh data if profile is available
          if (profile) {
            saveRelatedCollectionsToCache(CACHE_COLLECTIONS, [profile])
          }
        }
      } catch (error) {
        console.error("Error fetching profile data:", error)
        showToast("Failed to load profile data. Please try again.", "error")
      }
    },
    [userId, user, profile, fetchProfile],
  )

  // Update the email verification completion handler
  useEffect(() => {
    const handleEmailVerificationCompletion = async () => {
      // Check if we have a newEmail query parameter (from the verification link)
      const params = new URLSearchParams(window.location.search)
      const newEmail = params.get("newEmail")
      const emailChanged = params.get("emailChanged")

      if (user && newEmail) {
        try {
          // When the user returns after clicking the verification link,
          // the email in Firebase Auth should already be updated
          // We just need to update Firestore to match
          const { completeEmailUpdate } = require("@/lib/firebase/auth")
          const result = await completeEmailUpdate(user)

          if (result.success) {
            showToast("Email updated successfully!", "success")

            // Clear the query parameter
            window.history.replaceState({}, document.title, window.location.pathname)

            // Refresh the profile to show the updated email
            await refreshProfile()

            // If this was a redirect from email verification, sign out and redirect to auth
            if (emailChanged === "true") {
              // Clear all application data
              clearAllAppData()

              // Sign out the user
              const { signOutUser } = require("@/lib/firebase/auth")
              await signOutUser()

              // Redirect to auth page
              router.replace("/")
            }
          } else {
            showToast(result.error || "Failed to complete email update", "error")
          }
        } catch (error) {
          console.error("Error handling email verification:", error)
          showToast("Failed to complete email update", "error")
        }
      }
    }

    handleEmailVerificationCompletion()
  }, [user, refreshProfile, router])

  // Check for mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1023)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Load profile data when available
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

  // Update the useEffect that loads profile data to use the new caching function
  useEffect(() => {
    if (userId && !isLoading) {
      fetchProfileWithCache()
    }
  }, [fetchProfileWithCache, userId, isLoading])

  // Load available accounts
  useEffect(() => {
    const loadAccounts = async () => {
      if (user) {
        try {
          const { success, profiles } = await getProfilesByEmail(user.email)

          if (success && profiles.length > 0) {
            const formattedAccounts = profiles.map((profile) => ({
              id: profile.id,
              name: `${profile.firstName} ${profile.lastName}`,
              email: user?.email,
              isActive: profile.id === user.uid,
              isAdmin: profile?.isAdmin === true,
            }))
            setAvailableAccounts(formattedAccounts)
          } else {
            // Fallback to current user if no profiles were found
            setAvailableAccounts([
              {
                id: user.uid,
                name: `${fieldValues.firstName} ${fieldValues.lastName}`,
                email: fieldValues.email,
                isActive: true,
                isAdmin: profile?.isAdmin === true,
              },
            ])
          }
        } catch (error) {
          console.error("Error in loadAccounts:", error)
          // Fallback to current user only
          setAvailableAccounts([
            {
              id: user.uid,
              name: `${fieldValues.firstName} ${fieldValues.lastName}`,
              email: fieldValues.email,
              isActive: true,
              isAdmin: profile?.isAdmin === true,
            },
          ])
        }
      }
    }

    loadAccounts()
  }, [user, fieldValues.firstName, fieldValues.lastName, fieldValues.email, profile])

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

  // Handle account deletion
  const handleDelete = () => {
    setManageAccountOpen(false)
    setDeleteDialogOpen(true)
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
    setManageAccountOpen(false)
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

          // Update cache with new profile data
          if (profile) {
            const updatedProfile = {
              ...profile,
              firstName: value.firstName,
              lastName: value.lastName,
            }
            saveRelatedCollectionsToCache(CACHE_COLLECTIONS, [updatedProfile])
          }

          showToast("Name updated successfully", "success")

          // Force a refresh of the profile data
          await refreshProfile()

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

          // Update cache with new profile data
          if (profile) {
            const updatedProfile = {
              ...profile,
              phone: value,
            }
            saveRelatedCollectionsToCache(CACHE_COLLECTIONS, [updatedProfile])
          }

          showToast("Phone number updated successfully", "success")

          // Force a refresh of the profile data
          await refreshProfile()

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
            }, 1500)
          } else {
            // Update local state immediately
            setFieldValues((prev) => ({
              ...prev,
              email: value,
            }))

            // Update cache with new profile data
            if (profile) {
              const updatedProfile = {
                ...profile,
                email: value,
              }
              saveRelatedCollectionsToCache(CACHE_COLLECTIONS, [updatedProfile])
            }

            showToast("Email updated successfully", "success")
          }

          // Force a refresh of the profile data
          await refreshProfile()

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

  // Handle password change
  const handleChangePassword = () => {
    setManageAccountOpen(false)
    setChangePasswordOpen(true)
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

  // Handle switching accounts
  const handleSwitchAccount = (id) => {
    setAvailableAccounts(
      availableAccounts.map((account) => ({
        ...account,
        isActive: account.id === id,
      })),
    )
    setSwitchAccountOpen(false)
    // In a real app, you would implement the actual account switching logic here
    showToast("Account switching is not implemented in this demo", "info")
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
        <button className={styles.retryButton} onClick={refreshProfile}>
          Retry
        </button>
      </div>
    )
  }

  const handleOpenChangePasswordModal = () => {
    setIsChangePasswordModalOpen(true)
  }

  const handleCloseChangePasswordModal = () => {
    setIsChangePasswordModalOpen(false)
  }

  const handleOpenDeleteAccountModal = () => {
    setIsDeleteAccountModalOpen(true)
  }

  const handleCloseDeleteAccountModal = () => {
    setIsDeleteAccountModalOpen(false)
  }

  const handleDeleteAccount = async (password) => {
    setManageAccountOpen(false)
    setDeleteDialogOpen(true)
    const result = await confirmDelete(password)
    if (result.success) {
      handleCloseDeleteAccountModal()
    }
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
              await refreshProfile()
              showToast("Profile updated successfully", "success")
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
          onChangePassword={handleChangePassword}
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

