"use client"

import { useState, useEffect } from "react"
import {
  MdDescription,
  MdPhone,
  MdPeople,
  MdShield,
  MdHome,
  MdSavings,
  MdCheck,
  MdPersonAdd,
  MdContentCopy,
  MdClose,
} from "react-icons/md"
import styles from "./AdminSettings.module.css"
import homeIdStyles from "../components/HomeIdCodeModal.module.css"

const AdminSettings = () => {
  const [authenticated, setAuthenticated] = useState(false)
  const [pinDigits, setPinDigits] = useState(["", "", "", ""])
  const [errorMessage, setErrorMessage] = useState("")
  const [familyMembers] = useState([
    { name: "Chang", email: "chang@example.com", lastOnline: "2 hours ago", online: true },
    { name: "Claire", email: "claire@example.com", lastOnline: "1 day ago", online: false },
    { name: "Lovisa", email: "lovisa@example.com", lastOnline: "30 minutes ago", online: true },
    { name: "Max", email: "max@example.com", lastOnline: "5 hours ago", online: false },
    { name: "Mom", email: "mom@example.com", lastOnline: "3 days ago", online: true },
  ])
  const [permissions, setPermissions] = useState({
    "read electricity consumption levels": false,
    "read daily water consumption levels": false,
    "read device temperature levels": false,
    "control household devices": false,
  })
  const [isMobile, setIsMobile] = useState(false)
  const [activeTab, setActiveTab] = useState("family")
  const [showHomeIdModal, setShowHomeIdModal] = useState(false)
  const [copied, setCopied] = useState(false)

  // Generate a random Home ID code
  const homeId = "SMART-" + Math.random().toString(36).substring(2, 8).toUpperCase()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1023)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const handlePinSubmit = (e) => {
    e.preventDefault()
    const enteredPin = pinDigits.join("")
    if (enteredPin === "1234") {
      setAuthenticated(true)
      setErrorMessage("")
    } else {
      setErrorMessage("Invalid PIN. Please try again.")
      setPinDigits(["", "", "", ""])
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

  if (!authenticated) {
    return (
      <div className={styles.pinContainer}>
        <div className={styles.pinBox}>
          <MdShield className={styles.pinIcon} size={32} />
          <h2 className={styles.pinTitle}>Admin Access Required</h2>
          <form onSubmit={handlePinSubmit}>
            <div className={styles.pinInputContainer}>
              {[0, 1, 2, 3].map((index) => (
                <input
                  key={index}
                  id={`pin-input-${index}`}
                  type="password"
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
            <button className={styles.pinButton}>Unlock Admin Settings</button>
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
                      <div key={member.name} className={styles.memberCard}>
                        <div className={styles.memberAvatar}>
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
                    <a href="tel:800-555-0192" className={styles.phoneNumber}>
                      <MdPhone size={20} />
                      800-555-0192
                    </a>
                    <button className={styles.actionButton}>Contact Support</button>
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
                    <div key={member.name} className={styles.memberCard}>
                      <div className={styles.memberInfo}>
                        <span className={styles.memberName}>{member.name}</span>
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
                <a href="tel:800-555-0192" className={styles.phoneNumber}>
                  <MdPhone size={20} />
                  800-555-0192
                </a>
                <button className={styles.actionButton}>Contact Support</button>
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

