"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import styles from "./ProfileContent.module.css"
import { useAuth } from "@/hooks/useAuth"
import { deleteUserAccount, signOutUser } from "@/lib/firebase/auth"
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

export default function ProfileContent() {
  const router = useRouter()
  const { user, profile, loading } = useAuth()
  const [isMobile] = useState(false)

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

  // State for account operations
  const [availableAccounts, setAvailableAccounts] = useState([])
  const [isDeleting, setIsDeleting] = useState(false)

  // Load profile data when available
  useEffect(() => {
    if (profile) {
      setFieldValues({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: profile.email || "",
        phone: profile.phone || "",
        governmentId: "Verified", // Always set to "Verified"
      })
    }
  }, [profile])

  // Load available accounts
  useEffect(() => {
    const loadAccounts = async () => {
      if (user) {
        const { success, profiles } = await getProfilesByEmail(user.email)
        if (success && profiles.length > 0) {
          const formattedAccounts = profiles.map((profile) => ({
            id: profile.id,
            name: `${profile.firstName} ${profile.lastName}`,
            email: profile.email,
            isActive: profile.id === user.uid,
          }))
          setAvailableAccounts(formattedAccounts)
        } else {
          setAvailableAccounts([
            {
              id: user.uid,
              name: `${fieldValues.firstName} ${fieldValues.lastName}`,
              email: fieldValues.email,
              isActive: true,
              admin: fieldValues.admin,
            },
          ])
        }
      }
    }

    loadAccounts()
  }, [user, fieldValues.firstName, fieldValues.lastName, fieldValues.email, fieldValues.admin])

  // Display mapping for field names
  const displayMapping = {
    name: "Legal name",
    email: "Email address",
    phone: "Phone number",
    governmentId: "Government ID",
  }

  // Personal info sections data
  const personalInfoSections = [
    {
      title: displayMapping.name,
      value: `${fieldValues.firstName} ${fieldValues.lastName}`,
      action: "Edit",
      field: "name",
    },
    {
      title: displayMapping.email,
      value: fieldValues.email,
      action: "Edit",
      field: "email",
    },
    {
      title: displayMapping.phone,
      value: fieldValues.phone ? fieldValues.phone : "Add a number to get in touch with you.",
      action: "Edit",
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
      }
    } catch (error) {
      console.error("Unexpected error during sign out:", error)
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

      // Redirect to login page after a short delay
      setTimeout(() => {
        router.push("/login")
      }, 2000)

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
    if (editingField === "name") {
      setFieldValues((prev) => ({
        ...prev,
        firstName: value.firstName,
        lastName: value.lastName,
      }))

      if (user) {
        await updateProfile(user.uid, {
          firstName: value.firstName,
          lastName: value.lastName,
        })
      }
    } else if (editingField === "phone") {
      // Validate phone number before saving
      if (value && !isValidPhoneNumber(value)) {
        throw new Error("Please enter a valid phone number")
      }

      setFieldValues((prev) => ({
        ...prev,
        phone: value,
      }))

      if (user) {
        await updateProfile(user.uid, {
          phone: value,
        })
      }
    } else {
      setFieldValues((prev) => ({
        ...prev,
        [editingField]: value,
      }))

      if (user) {
        await updateProfile(user.uid, {
          [editingField]: value,
        })
      }
    }

    setEditingField(null)
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
  }

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading profile...</p>
      </div>
    )
  }

  return (
    <main className={styles.profileMainContent}>
      <h1 className={styles.header}>Your Profile</h1>

      {/* Profile Header */}
      <ProfileHeader user={user} profile={profile} handleSignOut={handleSignOut} />

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
        initialValue={editingField && editingField !== "name" ? fieldValues[editingField] : ""}
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
        isAdmin={fieldValues.admin === true}
        isDeleting={isDeleting}
      />

      {/* Sign Out Modal */}
      <SignOutModal isOpen={signOutDialogOpen} onClose={() => setSignOutDialogOpen(false)} onSignOut={confirmSignOut} />
    </main>
  )
}

