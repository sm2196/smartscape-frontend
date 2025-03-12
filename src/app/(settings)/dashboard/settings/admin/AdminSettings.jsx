"use client"

import { useState, useEffect } from "react"
import { MdAdd, MdClose, MdCheck, MdPhone, MdDescription, MdPeople, MdShield, MdHome, MdSavings } from "react-icons/md"
import styles from "./AdminSettings.module.css"

const AdminSettings = () => {
  const [authenticated, setAuthenticated] = useState(false)
  const [pinDigits, setPinDigits] = useState(["", "", "", ""])
  const [errorMessage, setErrorMessage] = useState("")
  const [familyMembers, setFamilyMembers] = useState([
    { name: "Chang", email: "chang@example.com", lastOnline: "2 hours ago", online: true },
    { name: "Claire", email: "claire@example.com", lastOnline: "1 day ago", online: false },
    { name: "Lovisa", email: "lovisa@example.com", lastOnline: "30 minutes ago", online: true },
    { name: "Max", email: "max@example.com", lastOnline: "5 hours ago", online: false },
    { name: "Mom", email: "mom@example.com", lastOnline: "3 days ago", online: true },
  ])
  const [newMemberName, setNewMemberName] = useState("")
  const [newMemberEmail, setNewMemberEmail] = useState("")
  const [permissions, setPermissions] = useState({
    "read electricity consumption levels": false,
    "read daily water consumption levels": false,
    "read device temperature levels": false,
    "control household devices": false,
  })
  const [selectedMember, setSelectedMember] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  const [activeTab, setActiveTab] = useState("family")
  const [showAddMember, setShowAddMember] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
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

  const handleAddMember = () => {
    if (newMemberName && newMemberEmail) {
      const newMember = {
        name: newMemberName,
        email: newMemberEmail,
        lastOnline: "Just now",
        online: true,
      }
      setFamilyMembers([...familyMembers, newMember])
      setNewMemberName("")
      setNewMemberEmail("")
      setShowAddMember(false)
    }
  }

  const handleRemoveMember = (name) => {
    setFamilyMembers(familyMembers.filter((member) => member.name !== name))
  }

  const toggleStatus = (name) => {
    setFamilyMembers(
      familyMembers.map((member) =>
        member.name === name ? { ...member, online: !member.online, lastOnline: "Just now" } : member,
      ),
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
                    <button className={styles.mobileAddButton} onClick={() => setShowAddMember(true)}>
                      <MdAdd size={20} />
                      <span>Add Member</span>
                    </button>
                  </div>
                  <div className={styles.memberList}>
                    {familyMembers.map((member) => (
                      <div key={member.name} className={styles.memberCard} onClick={() => setSelectedMember(member)}>
                        <div className={styles.memberInfo}>
                          <span className={styles.memberName}>{member.name}</span>
                          <span className={styles.memberEmail}>{member.email}</span>
                        </div>
                        <div className={styles.memberStatus}>
                          <span className={`${styles.statusDot} ${member.online ? styles.online : styles.offline}`} />
                          {member.online ? "Online" : "Offline"}
                        </div>
                      </div>
                    ))}
                  </div>
                  {familyMembers.length === 0 && (
                    <div className={styles.emptyState}>
                      <p>No family members added yet.</p>
                      <button className={styles.addButton} onClick={() => setShowAddMember(true)}>
                        <MdAdd size={20} />
                        Add Member
                      </button>
                    </div>
                  )}
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
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className={styles.desktopContent}>
            <div className={styles.mainSection}>
              <div className={styles.familySection}>
                <div className={styles.sectionHeader}>
                  <h2>Family Members</h2>
                  <button className={styles.addButton} onClick={() => setShowAddMember(true)}>
                    <MdAdd size={20} />
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
                        <button
                          className={`${styles.statusButton} ${member.online ? styles.online : styles.offline}`}
                          onClick={() => toggleStatus(member.name)}
                        >
                          <span className={styles.statusDot} />
                          {member.online ? "Online" : "Offline"}
                        </button>
                        <button className={styles.removeButton} onClick={() => handleRemoveMember(member.name)}>
                          <MdClose size={16} />
                          Remove
                        </button>
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

      {showAddMember && (
        <div className={styles.modal} onClick={() => setShowAddMember(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Add Family Member</h2>
              <button className={styles.closeButton} onClick={() => setShowAddMember(false)}>
                <MdClose size={20} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.inputGroup}>
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  type="text"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="Enter full name"
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  placeholder="Enter email address"
                />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.cancelButton} onClick={() => setShowAddMember(false)}>
                Cancel
              </button>
              <button
                className={styles.addButton}
                onClick={handleAddMember}
                disabled={!newMemberName || !newMemberEmail}
              >
                Add Member
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedMember && (
        <div className={styles.modal} onClick={() => setSelectedMember(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{selectedMember.name}'s Status</h2>
              <button className={styles.closeButton} onClick={() => setSelectedMember(null)}>
                <MdClose size={20} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.statusDetail}>
                <strong>Email:</strong>
                <span>{selectedMember.email}</span>
              </div>
              <div className={styles.statusDetail}>
                <strong>Status:</strong>
                <span className={selectedMember.online ? styles.statusOnline : styles.statusOffline}>
                  {selectedMember.online ? "Online" : "Offline"}
                </span>
              </div>
              <div className={styles.statusDetail}>
                <strong>Last Online:</strong>
                <span>{selectedMember.lastOnline}</span>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.actionButton} onClick={() => setSelectedMember(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminSettings

