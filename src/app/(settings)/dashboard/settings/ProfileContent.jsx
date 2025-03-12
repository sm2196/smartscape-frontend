"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import styles from "./ProfileContent.module.css"
import { useAuth } from "@/hooks/useAuth"
import { signUpWithEmailAndPassword, deleteUserAccount } from "@/lib/firebase/auth"
import { createProfile, getProfilesByEmail, updateProfile } from "@/lib/firebase/firestore"

// Import components
import ProfileHeader from "./components/ProfileHeader"
import AccountActions from "./components/AccountActions"
import PersonalInfoSection from "./components/PersonalInfoSection"
import EditFieldModal from "./components/EditFieldModal"
import ManageAccountModal from "./components/ManageAccountModal"
import SwitchAccountModal from "./components/SwitchAccountModal"
import AddAccountModal from "./components/AddAccountModal"
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
    phoneNumbers: "",
    governmentId: "Verified", // Always set to "Verified"
    address: "",
    admin: true, // Use boolean instead of role string
  })

  // State for modals
  const [editingField, setEditingField] = useState(null)
  const [manageAccountOpen, setManageAccountOpen] = useState(false)
  const [switchAccountOpen, setSwitchAccountOpen] = useState(false)
  const [addAccountOpen, setAddAccountOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [signOutDialogOpen, setSignOutDialogOpen] = useState(false)

  // State for account operations
  const [availableAccounts, setAvailableAccounts] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  // Add state for error messages at the top of the component
  const [errorMessage, setErrorMessage] = useState("")

  // Load profile data when available
  useEffect(() => {
    if (profile) {
      setFieldValues({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: profile.email || "",
        phoneNumbers: profile.phoneNumbers || "",
        governmentId: "Verified", // Always set to "Verified"
        address: profile.address || "",
        admin: profile.admin === true, // Convert to boolean if needed
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
            admin: profile.admin === true,
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
    phoneNumbers: "Phone numbers",
    governmentId: "Government ID",
    address: "Address",
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
      title: displayMapping.phoneNumbers,
      value: fieldValues.phoneNumbers.length ? fieldValues.phoneNumbers : "Add a number to get in touch with you.",
      action: "Edit",
      field: "phoneNumbers",
    },
    {
      title: displayMapping.governmentId,
      value: fieldValues.governmentId,
      action: null,
      field: "governmentId",
    },
    {
      title: displayMapping.address,
      value: fieldValues.address.length ? fieldValues.address : "Add your address so we can reach you.",
      action: "Edit",
      field: "address",
    },
  ]

  // Handle sign out
  const handleSignOut = () => {
    setSignOutDialogOpen(true)
  }

  const confirmSignOut = () => {
    console.log("Signing out...")
    setSignOutDialogOpen(false)
    // In a real app, you would redirect to login page or clear auth state
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
      setSuccessMessage("Account successfully deleted")

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

  // Update the handleAddAccount function to better handle errors and display them to the user
  const handleAddAccount = async (newAccountData) => {
    setIsSubmitting(true)
    setSuccessMessage("")

    try {
      // Validate password length
      if (newAccountData.password.length < 6) {
        setIsSubmitting(false)
        // Add error state to display to the user
        setErrorMessage("Password must be at least 6 characters long")
        return { success: false, error: "Password must be at least 6 characters long" }
      }

      // Create the user in Firebase Authentication
      const {
        success,
        user: newUser,
        error,
      } = await signUpWithEmailAndPassword(newAccountData.email, newAccountData.password)

      if (!success) {
        setIsSubmitting(false)
        // Set error message to display to the user
        setErrorMessage(error)
        return { success: false, error }
      }

      // Get admin data to inherit phone and address
      const adminPhone = fieldValues.phoneNumbers || ""
      const adminAddress = fieldValues.address || ""

      // Create the profile document in Firestore
      const profileData = {
        firstName: newAccountData.firstName,
        lastName: newAccountData.lastName,
        email: newAccountData.email,
        phoneNumbers: adminPhone, // Inherit from admin
        governmentId: "Verified", // Always verified
        address: adminAddress, // Inherit from admin
        profileImageUrl: null,
        admin: false, // Set admin to false for new users
        adminId: user?.uid || null, // Reference to the admin user
      }

      const profileResult = await createProfile(newUser.uid, profileData)

      if (profileResult.success) {
        // Add the new account to the available accounts list
        const newAccount = {
          id: newUser.uid,
          name: `${newAccountData.firstName} ${newAccountData.lastName}`,
          email: newAccountData.email,
          isActive: false,
          admin: false,
        }

        setAvailableAccounts([...availableAccounts, newAccount])
        setSuccessMessage("Account created successfully!")
        setErrorMessage("") // Clear any error messages

        // Close the modal after a delay
        setTimeout(() => {
          setAddAccountOpen(false)
          setSuccessMessage("")
        }, 2000)

        return { success: true }
      } else {
        setErrorMessage(profileResult.error || "Failed to create profile")
        return { success: false, error: "Failed to create profile" }
      }
    } catch (error) {
      console.error("Error creating account:", error)
      setErrorMessage(error.message || "An unexpected error occurred")
      return { success: false, error: "An unexpected error occurred" }
    } finally {
      setIsSubmitting(false)
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
        onAddAccount={() => setAddAccountOpen(true)}
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

      {/* Add Account Modal */}
      <AddAccountModal
        isOpen={addAccountOpen}
        onClose={() => {
          setAddAccountOpen(false)
          setErrorMessage("") // Clear error message when closing
        }}
        onAddAccount={handleAddAccount}
        isSubmitting={isSubmitting}
        successMessage={successMessage}
        errorMessage={errorMessage} // Pass the error message
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

      {/* Success Toast Notification */}
      {successMessage && <div className={styles.toast}>{successMessage}</div>}
    </main>
  )
}

