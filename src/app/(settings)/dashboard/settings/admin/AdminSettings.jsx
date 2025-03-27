"use client"

import { useState, useEffect, useCallback } from "react"
import {
  MdDescription,
  MdShield,
  MdHome,
  MdSavings,
  MdCheck,
  MdPersonAdd,
  MdContentCopy,
  MdClose,
  MdPhone,
  MdAdminPanelSettings,
  MdPerson,
  MdDelete, // Add this import
} from "react-icons/md"
import styles from "./AdminSettings.module.css"
import homeIdStyles from "./HomeIdCodeModal.module.css"
import { useAuth } from "@/hooks/useAuth"
import { useFirestoreData } from "@/hooks/useFirestoreData"
import { saveRelatedCollectionsToCache, clearRelatedCollectionsCache } from "@/lib/cacheUtils"
import { getDoc, doc, updateDoc, collection, query, where, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase/config"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

// Define cache constants for consistency
const CACHE_COLLECTIONS = ["Users"]
const CACHE_EXPIRATION = 30 * 60 * 1000 // 30 minutes in milliseconds

// Define available permissions
const AVAILABLE_PERMISSIONS = [
  "read electricity consumption levels",
  "read daily water consumption levels",
  "read device temperature levels",
  "control household devices",
]

const AdminSettings = () => {
  const [authenticated, setAuthenticated] = useState(false)
  const [pinDigits, setPinDigits] = useState(["", "", "", ""])
  const [errorMessage, setErrorMessage] = useState("")
  const [familyMembers, setFamilyMembers] = useState([])
  const [enabledPermissions, setEnabledPermissions] = useState([])
  const [showHomeIdModal, setShowHomeIdModal] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isCreatingPin, setIsCreatingPin] = useState(false)
  const [homeId, setHomeId] = useState("")
  const [adminPin, setAdminPin] = useState(null)
  const [isSavingPermissions, setIsSavingPermissions] = useState(false)
  // Add a new state variable for tracking family members loading
  const [familyMembersLoading, setFamilyMembersLoading] = useState(false)

  // Add a new state for the delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [memberToDelete, setMemberToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Get the current user
  const { user } = useAuth()
  const userId = user?.uid

  // Fetch user data with caching
  const { data: userData, loading: dataLoading } = useFirestoreData("Users", userId, {
    localStorageCache: true,
    cacheDuration: CACHE_EXPIRATION,
  })

  // Fetch user data with caching
  const fetchUserData = useCallback(
    async (skipCache = true) => {
      // Always skip cache by default
      try {
        if (!userId) return

        // Directly fetch from Firestore, bypassing all caches
        const userDocRef = doc(db, "Users", userId)
        const userDocSnap = await getDoc(userDocRef)

        if (userDocSnap.exists()) {
          const freshUserData = userDocSnap.data()
          console.log("Direct from Firestore - adminPin:", freshUserData.adminPin)

          // Update state with fresh data
          setHomeId(freshUserData.homeId || "")
          setAdminPin(freshUserData.adminPin)
          setIsCreatingPin(!freshUserData.adminPin)

          // Set enabled permissions from Firestore
          if (freshUserData.enabledPermissions && Array.isArray(freshUserData.enabledPermissions)) {
            setEnabledPermissions(freshUserData.enabledPermissions)
          } else {
            setEnabledPermissions([])
          }

          // Force clear and update cache
          clearRelatedCollectionsCache(CACHE_COLLECTIONS)
          saveRelatedCollectionsToCache(CACHE_COLLECTIONS, [freshUserData])

          return freshUserData
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
        setErrorMessage("Failed to load user data. Please try again.")
      }
    },
    [userId],
  )

  // Update the useEffect that loads user data to force a direct Firestore fetch
  useEffect(() => {
    let mounted = true

    const fetchData = async () => {
      // First clear any cached data
      clearRelatedCollectionsCache(CACHE_COLLECTIONS)

      // Directly fetch from Firestore
      const userDocRef = doc(db, "Users", userId)
      try {
        const userDocSnap = await getDoc(userDocRef)

        if (userDocSnap.exists() && mounted) {
          const freshData = userDocSnap.data()
          console.log("Direct Firestore fetch - adminPin:", freshData.adminPin)

          // Update state with fresh data
          setHomeId(freshData.homeId || "")
          setAdminPin(freshData.adminPin)
          setIsCreatingPin(!freshData.adminPin)

          // Set enabled permissions from Firestore
          if (freshData.enabledPermissions && Array.isArray(freshData.enabledPermissions)) {
            setEnabledPermissions(freshData.enabledPermissions)
          } else {
            setEnabledPermissions([])
          }
        }
      } catch (error) {
        console.error("Error in direct Firestore fetch:", error)
      }
    }

    if (userId) {
      fetchData()
    }

    return () => {
      mounted = false
    }
  }, [userId])

  useEffect(() => {
    if (userData) {
      console.log("User data loaded:", userData)
      console.log("Admin PIN:", userData.adminPin)
      console.log("Is creating PIN:", isCreatingPin)

      // Set enabled permissions from userData if available
      if (userData.enabledPermissions && Array.isArray(userData.enabledPermissions)) {
        setEnabledPermissions(userData.enabledPermissions)
      }
    }
  }, [userData, isCreatingPin])

  // Update the useEffect that fetches family members to include loading state
  useEffect(() => {
    const fetchFamilyMembers = async () => {
      if (!userId || !authenticated) return

      try {
        // Set loading state to true when starting to fetch
        setFamilyMembersLoading(true)

        // First get the current user's data
        const userDocRef = doc(db, "Users", userId)
        const userDocSnap = await getDoc(userDocRef)

        if (!userDocSnap.exists()) {
          console.error("User document not found")
          return
        }

        const userData = userDocSnap.data()
        const isAdmin = userData.isAdmin === true

        let members = []

        // Add the current user as the first member
        members.push({
          id: userId,
          name: `${userData.firstName || ""} ${userData.lastName || ""}`.trim(),
          email: userData.email || "",
          isAdmin: isAdmin,
          online: userData.isOnline === true, // Explicitly check isOnline field
        })

        if (isAdmin) {
          // If current user is admin, find all users with adminRef pointing to this user
          const membersQuery = query(collection(db, "Users"), where("adminRef", "==", doc(db, "Users", userId)))

          const querySnapshot = await getDocs(membersQuery)

          // Add each family member to the array
          for (const docSnap of querySnapshot.docs) {
            const memberData = docSnap.data()
            members.push({
              id: docSnap.id,
              name: `${memberData.firstName || ""} ${memberData.lastName || ""}`.trim(),
              email: memberData.email || "", // Use email from Firestore
              isAdmin: false,
              online: memberData.isOnline === true,
            })
          }
        } else if (userData.adminRef) {
          // If current user is not admin, get the admin user
          const adminRef = userData.adminRef
          const adminDocSnap = await getDoc(adminRef)

          if (adminDocSnap.exists()) {
            const adminData = adminDocSnap.data()

            // Add admin to the beginning of the array (replacing the current user)
            members = [
              {
                id: adminDocSnap.id,
                name: `${adminData.firstName || ""} ${adminData.lastName || ""}`.trim(),
                email: adminData.email || "",
                isAdmin: true,
                online: adminData.isOnline === true, // Explicitly check isOnline field
              },
              ...members,
            ]

            // Get other family members under the same admin
            const otherMembersQuery = query(collection(db, "Users"), where("adminRef", "==", adminRef))

            const otherMembersSnapshot = await getDocs(otherMembersQuery)

            for (const docSnap of otherMembersSnapshot.docs) {
              // Skip the current user as they're already in the list
              if (docSnap.id === userId) continue

              const memberData = docSnap.data()
              members.push({
                id: docSnap.id,
                name: `${memberData.firstName || ""} ${memberData.lastName || ""}`.trim(),
                email: memberData.email || "",
                isAdmin: false,
                online: memberData.isOnline === true, // Explicitly check isOnline field
              })
            }
          }
        }

        setFamilyMembers(members)
      } catch (error) {
        console.error("Error fetching family members:", error)
      } finally {
        // Set loading state to false when done, whether successful or not
        setFamilyMembersLoading(false)
      }
    }

    if (authenticated) {
      fetchFamilyMembers()
    }
  }, [userId, authenticated, user])

  const handlePinSubmit = async (e) => {
    e.preventDefault()
    const enteredPin = pinDigits.join("")

    if (isCreatingPin) {
      // Creating a new PIN
      if (enteredPin.length !== 4 || !/^\d+$/.test(enteredPin)) {
        setErrorMessage("PIN must be 4 digits.")
        setPinDigits(["", "", "", ""])
        return
      }

      try {
        // Update the adminPin in Firestore
        const userDocRef = doc(db, "Users", userId)
        await updateDoc(userDocRef, {
          adminPin: enteredPin,
        })

        // Update local state
        setAdminPin(enteredPin)
        setAuthenticated(true)
        setErrorMessage("")

        // Update cache
        if (userData) {
          const updatedUserData = { ...userData, adminPin: enteredPin }
          saveRelatedCollectionsToCache(CACHE_COLLECTIONS, [updatedUserData])
        }

        toast.success("Admin PIN created successfully!")
      } catch (error) {
        console.error("Error updating admin PIN:", error)
        setErrorMessage("Failed to create PIN. Please try again.")
        setPinDigits(["", "", "", ""])
      }
    } else {
      // Verifying existing PIN
      if (enteredPin === adminPin) {
        setAuthenticated(true)
        setErrorMessage("")
      } else {
        setErrorMessage("Invalid PIN. Please try again.")
        setPinDigits(["", "", "", ""])
      }
    }
  }

  const handlePinChange = (index, value) => {
    const newPinDigits = [...pinDigits]
    newPinDigits[index] = value.replace(/\D/g, "")
    setPinDigits(newPinDigits)

    if (value && index < 3) {
      document.getElementById(`pin-input-${index + 1}`).focus()
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(homeId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Toggle permission and update Firestore
  const togglePermission = async (permission) => {
    try {
      setIsSavingPermissions(true)

      // Update local state first for immediate UI feedback
      let updatedPermissions = [...enabledPermissions]

      if (updatedPermissions.includes(permission)) {
        // Remove permission if it exists
        updatedPermissions = updatedPermissions.filter((p) => p !== permission)
      } else {
        // Add permission if it doesn't exist
        updatedPermissions.push(permission)
      }

      setEnabledPermissions(updatedPermissions)

      // Update Firestore
      const userDocRef = doc(db, "Users", userId)
      await updateDoc(userDocRef, {
        enabledPermissions: updatedPermissions,
      })

      // Update cache
      if (userData) {
        const updatedUserData = { ...userData, enabledPermissions: updatedPermissions }
        saveRelatedCollectionsToCache(CACHE_COLLECTIONS, [updatedUserData])
      }

      toast.success("Permissions updated successfully")
    } catch (error) {
      console.error("Error updating permissions:", error)
      toast.error("Failed to update permissions")

      // Revert to previous state if there was an error
      fetchUserData(true)
    } finally {
      setIsSavingPermissions(false)
    }
  }

  // Add this function to handle delete member click
  const handleDeleteMember = (member) => {
    if (member.isAdmin) return // Don't allow deleting admin users
    setMemberToDelete(member)
    setShowDeleteModal(true)
  }

  // Add this function to confirm and execute the deletion
  const confirmDeleteMember = async () => {
    if (!memberToDelete || !userId) return

    setIsDeleting(true)

    try {
      // Get the current user's ID token
      const idToken = await user.getIdToken()

      // Call the API to delete the managed user
      const response = await fetch("/api/auth/delete-managed-users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idToken,
          adminUserId: userId,
          managedUserIds: [memberToDelete.id],
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success(`Successfully removed ${memberToDelete.name} from your family members`)

        // Update the family members list
        setFamilyMembers(familyMembers.filter((member) => member.id !== memberToDelete.id))
      } else {
        console.error("Error deleting member:", result.error)
        toast.error(`Failed to remove ${memberToDelete.name}. ${result.error || "Please try again."}`)
      }
    } catch (error) {
      console.error("Error deleting member:", error)
      toast.error("An error occurred while removing the family member")
    } finally {
      setIsDeleting(false)
      setShowDeleteModal(false)
      setMemberToDelete(null)
    }
  }

  // Add this DeleteMemberModal component inside the AdminSettings component
  const DeleteMemberModal = () => {
    if (!showDeleteModal || !memberToDelete) return null

    return (
      <div className={styles.modalOverlay} onClick={() => setShowDeleteModal(false)}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <div className={styles.modalHeader}>
            <h2 className={styles.modalTitle}>Remove Family Member</h2>
            <button className={styles.modalCloseButton} onClick={() => setShowDeleteModal(false)}>
              <MdClose size={20} />
            </button>
          </div>
          <div className={styles.modalContent}>
            <div className={styles.deleteWarning}>
              <MdDelete size={48} className={styles.deleteIcon} />
              <p>
                Are you sure you want to remove <strong>{memberToDelete.name}</strong> from your family members?
              </p>
              <p className={styles.warningText}>
                This action cannot be undone. The user will lose access to your smart home devices.
              </p>
            </div>
          </div>
          <div className={styles.modalFooter}>
            <button
              className={styles.modalButtonSecondary}
              onClick={() => setShowDeleteModal(false)}
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button className={styles.modalButtonDanger} onClick={confirmDeleteMember} disabled={isDeleting}>
              {isDeleting ? "Removing..." : "Remove Member"}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (dataLoading) {
    return (
      <div className={styles.pinContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading settings...</p>
      </div>
    )
  }

  if (!authenticated) {
    return (
      <div className={styles.pinContainer}>
        <div className={styles.pinBox}>
          <MdShield className={styles.pinIcon} size={32} />
          {isCreatingPin ? (
            <>
              <h2 className={styles.pinTitle}>Create Admin PIN</h2>
              <p className={styles.pinDescription}>
                You need to create a 4-digit PIN to access admin settings. This PIN will be required each time you
                access this page.
              </p>
            </>
          ) : (
            <h2 className={styles.pinTitle}>Admin Access Required</h2>
          )}
          <form onSubmit={handlePinSubmit}>
            <div className={styles.pinInputContainer}>
              {[0, 1, 2, 3].map((index) => (
                <input
                  key={index}
                  id={`pin-input-${index}`}
                  type="text"
                  pattern="\d*"
                  inputMode="numeric"
                  maxLength="1"
                  value={pinDigits[index]}
                  onChange={(e) => handlePinChange(index, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && !pinDigits[index] && index > 0) {
                      document.getElementById(`pin-input-${index - 1}`).focus()
                    }
                  }}
                  className={styles.pinInput}
                  autoFocus={index === 0}
                />
              ))}
            </div>
            <button className={styles.pinButton}>{isCreatingPin ? "Create PIN" : "Unlock Admin Settings"}</button>
            {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
          </form>
        </div>
      </div>
    )
  }

  // Home ID Modal
  const HomeIdModal = () => {
    if (!showHomeIdModal) return null

    return (
      <div className={styles.modalOverlay} onClick={() => setShowHomeIdModal(false)}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <div className={styles.modalHeader}>
            <h2 className={styles.modalTitle}>Add Family Member</h2>
            <button className={styles.modalCloseButton} onClick={() => setShowHomeIdModal(false)}>
              <MdClose size={20} />
            </button>
          </div>
          <div className={styles.modalContent}>
            <div className={homeIdStyles.homeIdContainer}>
              <MdPersonAdd className={homeIdStyles.homeIcon} size={48} />
              <p className={homeIdStyles.homeIdDescription}>
                Share this code with family members to let them join your Smart Home. They&apos;ll need to enter this code
                during account registration.
              </p>
              <div className={homeIdStyles.codeWrapper}>
                <span className={homeIdStyles.homeIdCode}>{homeId}</span>
                <button
                  className={homeIdStyles.copyButton}
                  onClick={handleCopy}
                  aria-label={copied ? "Copied to clipboard" : "Copy to clipboard"}
                >
                  {copied ? <MdCheck size={20} /> : <MdContentCopy size={20} />}
                </button>
              </div>
              <div className={homeIdStyles.instructionsContainer}>
                <h3 className={homeIdStyles.instructionsTitle}>How to add a family member:</h3>
                <ol className={homeIdStyles.instructionsList}>
                  <li>Share this code with the family member you want to add</li>
                  <li>Ask them to create a new SmartScape account</li>
                  <li>During registration, they should enter this Home ID code</li>
                  <li>Once registered, they&apos;ll have access to your smart home devices</li>
                </ol>
              </div>
            </div>
          </div>
          <div className={styles.modalFooter}>
            <button className={styles.modalButtonSecondary} onClick={() => setShowHomeIdModal(false)}>
              Close
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.pageTitle}>Admin Settings</h1>
      </header>

      <div className={styles.content}>
        <div className={styles.topSection}>
          <div className={styles.infoCard}>
            <div className={styles.infoCardHeader}>
              <MdDescription size={24} />
              <h3>Account License</h3>
            </div>
            <div className={styles.infoCardContent}>
              <p>License Number ******678</p>
              <p>Expiry Date 13/02/2030</p>
              <button className={styles.actionButton}>
                <MdDescription size={16} />
                Terms and Conditions
              </button>
            </div>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.infoCardHeader}>
              <MdHome size={24} />
              <h3>House Info</h3>
            </div>
            <div className={styles.infoCardContent}>
              <p>
                Building 22, Flat 9, Barsha building
                <br />
                Green Street, Dubai, UAE
              </p>
            </div>
          </div>

          <div className={styles.infoCard}>
            <div className={styles.infoCardHeader}>
              <MdSavings size={24} />
              <h3>Monthly Savings</h3>
            </div>
            <div className={styles.infoCardContent}>
              <div className={styles.savingsAmount}>1250 AED</div>
              <p className={styles.updatedText}>Updated 2 hours ago</p>
            </div>
          </div>
        </div>

        <div className={styles.mainContent}>
          <div className={styles.leftColumn}>
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2>Family Members</h2>
                <button className={styles.addMemberButton} onClick={() => setShowHomeIdModal(true)}>
                  <MdPersonAdd size={20} />
                  Add Member
                </button>
              </div>
              <div className={styles.memberList}>
                {familyMembersLoading ? (
                  <div className={styles.loadingContainer}>
                    <div className={styles.loadingSpinner}></div>
                    <p className={styles.loadingText}>Loading family members...</p>
                  </div>
                ) : familyMembers.length > 0 ? (
                  familyMembers.map((member) => (
                    <div key={member.id} className={styles.memberCard}>
                      <div className={styles.memberInfo}>
                        <div className={styles.memberNameWithIcon}>
                          {member.isAdmin ? (
                            <MdAdminPanelSettings size={20} className={styles.adminIcon} />
                          ) : (
                            <MdPerson size={20} className={styles.guestIcon} />
                          )}
                          <span className={styles.memberName}>{member.name}</span>
                        </div>
                        <span className={styles.memberEmail}>{member.email}</span>
                      </div>
                      <div className={styles.memberActions}>
                        <div className={`${styles.statusBadge} ${member.online ? styles.online : styles.offline}`}>
                          <span className={styles.statusDot}></span>
                          {member.online ? "Online" : "Offline"}
                        </div>
                        {!member.isAdmin && (
                          <button
                            className={styles.deleteButton}
                            onClick={() => handleDeleteMember(member)}
                            aria-label={`Remove ${member.name}`}
                          >
                            <MdDelete size={18} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={styles.emptyState}>
                    <MdPersonAdd size={48} className={styles.emptyStateIcon} />
                    <p>No family members found</p>
                    <p className={styles.emptyStateSubtext}>Add family members to share access to your smart home</p>
                  </div>
                )}
              </div>
            </section>

            <section className={styles.section}>
              <h2>Permissions</h2>
              <div className={styles.permissionsList}>
                {AVAILABLE_PERMISSIONS.map((permission) => (
                  <div key={permission} className={styles.permissionItem}>
                    <span>Allow SmartScape to {permission}</span>
                    <label className={styles.toggleSwitch}>
                      <input
                        type="checkbox"
                        checked={enabledPermissions.includes(permission)}
                        onChange={() => togglePermission(permission)}
                        disabled={isSavingPermissions}
                      />
                      <span className={styles.toggleSlider}></span>
                    </label>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className={styles.rightColumn}>
            <section className={styles.section}>
              <h2>Verified Documents</h2>
              <div className={styles.documentsList}>
                {[
                  "Property Ownership",
                  "ID Verification",
                  "Utility Bills",
                  "Insurance Documents",
                  "Smart Device Registration",
                ].map((doc) => (
                  <div key={doc} className={styles.documentItem}>
                    <span>{doc}</span>
                    <MdCheck className={styles.verifiedIcon} size={20} />
                  </div>
                ))}
              </div>
            </section>

            <section className={styles.section}>
              <h2>24/7 Support</h2>
              <p>Our dedicated support team is available round the clock</p>
              <div className={styles.supportPhone}>
                <MdPhone size={20} />
                800-SCAPE
              </div>
              <a href="tel:+800-SCAPE" className={styles.actionButton}>
                Contact Support
              </a>
            </section>
          </div>
        </div>
      </div>

      {/* Delete Member Modal */}
      <DeleteMemberModal />

      {/* Home ID Modal */}
      <HomeIdModal />
    </div>
  )
}

export default AdminSettings

