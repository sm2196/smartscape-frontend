"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import styles from "./ProfileContent.module.css"
import { useAuth } from "@/hooks/useAuth"
import { deleteUserAccount, signOutUser, changeUserPassword } from "@/lib/firebase/auth"
import { getProfilesByEmail, updateProfile } from "@/lib/firebase/firestore"
import { isValidPhoneNumber } from "react-phone-number-input"

// Import components
import ProfileHeader from "./components/ProfileHeader"
import AccountActions from "./components/AccountActions"
import PersonalInfoSection from "./components/PersonalInfoSection"
import EditFieldModal from "./components/EditFieldModal"
import ManageAccountModal from "./components/ManageAccountModal"
import SwitchAccountModal from "./components/SwitchAccountModal"
import DeleteAccountModal from "./components/DeleteAccountModal"
import SignOutModal from "./components/SignOutModal"
import ChangePasswordModal from "./components/ChangePasswordModal"

export default function ProfileContent() {
  const router = useRouter()
  const { user, profile, loading, error, refreshProfile } = useAuth()
  const [isMobile, setIsMobile] = useState(false)

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

  // Add this code near the top of the component, after the useState declarations
  // This will handle the email verification completion when the user returns from the verification link
  useEffect(() => {
    const handleEmailVerificationCompletion = async () => {
      // Check if we have a newEmail query parameter (from the verification link)
      const params = new URLSearchParams(window.location.search)
      const newEmail = params.get("newEmail")

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
          } else {
            showToast(result.error || "Failed to complete email update", "error")
          }
        } catch (error) {
          console.error("Error handling email verification:", error)
          showToast("Failed to complete email update", "error")
        }
      }
    }

    if (!loading) {
      handleEmailVerificationCompletion()
    }
  }, [user, loading, refreshProfile])

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

  // Load available accounts
  useEffect(() => {
    const loadAccounts = async () => {
      if (user) {
        try {
          const { success, profiles, error: accountsError } = await getProfilesByEmail(user.email)

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

  const confirmSignOut = async () => {
    try {
      const result = await signOutUser()
      if (result.success) {
        console.log("Signed out successfully")

        // Clear any additional app state if needed
        // For example, if you're using any global state management

        // Redirect to login page with replace to prevent going back
        router.replace("/auth")
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

  const confirmDelete = async (password) => {
    setIsDeleting(true)

    try {
      // Attempt to delete the user account
      const authResult = await deleteUserAccount(password)

      if (!authResult.success) {
        setIsDeleting(false)
        return { success: false, error: authResult.error }
      }

      // Close the dialog and show success message
      setDeleteDialogOpen(false)
      showToast("Account deleted successfully", "success")

      // Immediately redirect to login page without waiting
      router.push("/auth")

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

  const handleSaveField = async (value) => {
    if (!user) {
      showToast("You must be logged in to update your profile", "error")
      return
    }

    try {
      if (editingField === "name") {
        const result = await updateProfile(user.uid, {
          firstName: value.firstName,
          lastName: value.lastName,
        })

        if (result.success) {
          setFieldValues((prev) => ({
            ...prev,
            firstName: value.firstName,
            lastName: value.lastName,
          }))
          showToast("Name updated successfully", "success")
          await refreshProfile()
        } else {
          throw new Error(result.error || "Failed to update name")
        }
      } else if (editingField === "phone") {
        // Validate phone number before saving
        if (value && !isValidPhoneNumber(value)) {
          throw new Error("Please enter a valid phone number")
        }

        const result = await updateProfile(user.uid, {
          phone: value,
        })

        if (result.success) {
          setFieldValues((prev) => ({
            ...prev,
            phone: value,
          }))
          showToast("Phone number updated successfully", "success")
          await refreshProfile()
        } else {
          throw new Error(result.error || "Failed to update phone number")
        }
      } else if (editingField === "email") {
        const result = await updateProfile(user.uid, {
          email: value,
        })

        if (result.success) {
          if (result.verificationRequired) {
            showToast(result.message, "info")
          } else {
            setFieldValues((prev) => ({
              ...prev,
              email: value,
            }))
            showToast("Email updated successfully", "success")
          }
          await refreshProfile()
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

  if (loading && !isDeleting) {
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
              await updateProfile(user.uid, data)
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
        onManageAccount={() => setManageAccountOpen(true)}
        onSwitchAccount={() => setSwitchAccountOpen(true)}
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

      {/* Manage Account Modal */}
      <ManageAccountModal
        isOpen={manageAccountOpen}
        onClose={() => setManageAccountOpen(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onChangePassword={handleChangePassword}
      />

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
        onChangePassword={confirmChangePassword}
      />

      {/* Switch Account Modal */}
      <SwitchAccountModal
        isOpen={switchAccountOpen}
        onClose={() => setSwitchAccountOpen(false)}
        accounts={availableAccounts}
        onSwitchAccount={handleSwitchAccount}
      />

      {/* Delete Account Modal */}
      <DeleteAccountModal
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onDelete={confirmDelete}
        isAdmin={profile?.isAdmin === true}
        isDeleting={isDeleting}
      />

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

