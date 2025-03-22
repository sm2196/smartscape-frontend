"use client"

import { useState, useEffect, useCallback } from "react"
import {
  MdDescription,
  MdPeople,
  MdShield,
  MdHome,
  MdSavings,
  MdCheck,
  MdPersonAdd,
  MdContentCopy,
  MdClose,
  MdEmail,
  MdAdminPanelSettings,
  MdPerson,
} from "react-icons/md"
import styles from "./AdminSettings.module.css"
import homeIdStyles from "../components/HomeIdCodeModal.module.css"
import { useAuth } from "@/hooks/useAuth"
import { useFirestoreData } from "@/hooks/useFirestoreData"
import { saveRelatedCollectionsToCache, clearRelatedCollectionsCache } from "@/lib/cacheUtils"
import { getDoc, doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase/config"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { collection, query, where, getDocs } from "firebase/firestore"

// Define cache constants for consistency
const CACHE_COLLECTIONS = ["Users"]
const CACHE_EXPIRATION = 30 * 60 * 1000 // 30 minutes in milliseconds

const AdminSettings = () => {
  const [authenticated, setAuthenticated] = useState(false)
  const [pinDigits, setPinDigits] = useState(["", "", "", ""])
  const [errorMessage, setErrorMessage] = useState("")
  const [familyMembers, setFamilyMembers] = useState([])
  const [permissions, setPermissions] = useState({
    "read electricity consumption levels": false,
    "read daily water consumption levels": false,
    "read device temperature levels": false,
    "read device temperature levels": false,
    "control household devices": false,
  })
  const [isMobile, setIsMobile] = useState(false)
  const [activeTab, setActiveTab] = useState("family")
  const [showHomeIdModal, setShowHomeIdModal] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isCreatingPin, setIsCreatingPin] = useState(false)
  const [homeId, setHomeId] = useState("")
  const [adminPin, setAdminPin] = useState(null)

  // Get the current user
  const { user } = useAuth()
  const userId = user?.uid

  // Fetch user data with caching
  const {
    data: userData,
    loading: dataLoading,
    updateData,
  } = useFirestoreData("Users", userId, {
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
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1023)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    if (userData) {
      console.log("User data loaded:", userData)
      console.log("Admin PIN:", userData.adminPin)
      console.log("Is creating PIN:", isCreatingPin)
    }
  }, [userData, isCreatingPin])

  // Fetch family members from Firestore
  useEffect(() => {
    const fetchFamilyMembers = async () => {
      if (!userId || !authenticated) return

      try {
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

  const togglePermission = (perm) => {
    setPermissions((prev) => ({ ...prev, [perm]: !prev[perm] }))
  }

  const InfoCard = ({ icon: Icon, title, children, color }) => (
    <div className={`${styles.infoCard} ${styles[color]}`}>
      <div className={styles.infoCardHeader}>
        <Icon size={24} />
        <h3>{title}</h3>
      </div>
      {children}
    </div>
  )

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
                Share this code with family members to let them join your Smart Home. They'll need to enter this code
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
                  <li>Once registered, they'll have access to your smart home devices</li>
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
          <InfoCard icon={MdDescription} title="Account License" color="blue">
            <p>License Number ******678</p>
            <p>Expiry Date 13/02/2025</p>
            <button className={styles.actionButton}>
              <MdDescription size={16} />
              Terms and Conditions
            </button>
          </InfoCard>

          <InfoCard icon={MdHome} title="House Info" color="gray">
            <p>
              Building 22, Flat 9, Barsha building
              <br />
              Green Street, Dubai, UAE
            </p>
          </InfoCard>

          <InfoCard icon={MdSavings} title="Monthly Savings" color="green">
            <div className={styles.savingsAmount}>$1,250</div>
            <p className={styles.updatedText}>Updated 2 hours ago</p>
          </InfoCard>
        </div>

        {isMobile ? (
          <div className={styles.mobileContent}>
            <nav className={styles.tabs}>
              <button
                className={`${styles.tab} ${activeTab === "family" ? styles.activeTab : ""}`}
                onClick={() => setActiveTab("family")}
              >
                <MdPeople size={20} />
                Family Members
              </button>
              <button
                className={`${styles.tab} ${activeTab === "permissions" ? styles.activeTab : ""}`}
                onClick={() => setActiveTab("permissions")}
              >
                <MdShield size={20} />
                Permissions
              </button>
            </nav>

            <div className={styles.tabContent}>
              {activeTab === "family" ? (
                <div className={styles.familySection}>
                  <div className={styles.sectionHeader}>
                    <h2>Family Members</h2>
                    <button className={styles.addMemberButton} onClick={() => setShowHomeIdModal(true)}>
                      <MdPersonAdd size={20} />
                      Add Member
                    </button>
                  </div>
                  <div className={styles.memberList}>
                    {familyMembers.map((member) => (
                      <div key={member.id} className={styles.memberCard}>
                        <div className={styles.memberAvatar}>
                          {member.isAdmin ? (
                            <MdAdminPanelSettings size={20} className={styles.adminIcon} />
                          ) : (
                            <MdPerson size={20} className={styles.guestIcon} />
                          )}
                          <span>{member.name.charAt(0)}</span>
                        </div>
                        <div className={styles.memberInfo}>
                          <span className={styles.memberName}>{member.name}</span>
                          <span className={styles.memberEmail}>{member.email}</span>
                          <div className={`${styles.statusBadge} ${member.online ? styles.online : styles.offline}`}>
                            <span className={styles.statusDot} />
                            {member.online ? "Online" : "Offline"}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className={styles.permissionsSection}>
                  <h2>Permissions</h2>
                  <div className={styles.permissionsList}>
                    {Object.entries(permissions).map(([perm, value]) => (
                      <div key={perm} className={styles.permissionItem}>
                        <span>Allow SmartScape to {perm}</span>
                        <button
                          className={`${styles.toggleButton} ${value ? styles.active : ""}`}
                          onClick={() => togglePermission(perm)}
                        >
                          <div className={styles.toggleHandle} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className={styles.mobileDocumentsSection}>
                    <h2>Verified Documents</h2>
                    <div className={styles.documentGrid}>
                      {[
                        "Property Ownership",
                        "ID Verification",
                        "Utility Bills",
                        "Insurance Documents",
                        "Smart Device Registration",
                      ].map((doc) => (
                        <div key={doc} className={styles.documentCard}>
                          <MdCheck className={styles.verifiedIcon} size={20} />
                          <span>{doc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={styles.supportSection}>
                    <h2>24/7 Support</h2>
                    <p>Our dedicated support team is available round the clock</p>
                    <div className={styles.supportEmail}>
                      <MdEmail size={20} />
                      smartscape.grp15@gmail.com
                    </div>
                    <a href="mailto:smartscape.grp15@gmail.com" className={styles.actionButton}>
                      Contact Support
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Desktop view
          <div className={styles.desktopContent}>
            <div className={styles.mainSection}>
              <div className={styles.familySection}>
                <div className={styles.sectionHeader}>
                  <h2>Family Members</h2>
                  <button className={styles.addMemberButton} onClick={() => setShowHomeIdModal(true)}>
                    <MdPersonAdd size={20} />
                    Add Member
                  </button>
                </div>
                <div className={styles.memberList}>
                  {familyMembers.map((member) => (
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
                          <span className={styles.statusDot} />
                          {member.online ? "Online" : "Offline"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.permissionsSection}>
                <h2>Permissions</h2>
                <div className={styles.permissionsList}>
                  {Object.entries(permissions).map(([perm, value]) => (
                    <div key={perm} className={styles.permissionItem}>
                      <span>Allow SmartScape to {perm}</span>
                      <button
                        className={`${styles.toggleButton} ${value ? styles.active : ""}`}
                        onClick={() => togglePermission(perm)}
                      >
                        <div className={styles.toggleHandle} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <aside className={styles.sidebar}>
              <div className={styles.documentsSection}>
                <h2>Verified Documents</h2>
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

              <div className={styles.supportSection}>
                <h2>24/7 Support</h2>
                <p>Our dedicated support team is available round the clock</p>
                <div className={styles.supportEmail}>
                  <MdEmail size={20} />
                  smartscape.grp15@gmail.com
                </div>
                <a href="mailto:smartscape.grp15@gmail.com" className={styles.actionButton}>
                  Contact Support
                </a>
              </div>
            </aside>
          </div>
        )}
      </div>

      {/* Home ID Modal */}
      <HomeIdModal />
    </div>
  )
}

export default AdminSettings

