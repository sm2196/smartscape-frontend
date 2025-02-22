"use client"

import { useState, useEffect } from "react"
import {
  MdOutlineMode,
  MdDeleteOutline,
  MdManageAccounts,
  MdSwitchAccount,
  MdPersonAddAlt1,
  MdAccountCircle,
} from "react-icons/md"
import styles from "./ProfileContent.module.css"

export default function ProfileContent() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 480)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const accountActions = [
    {
      icon: MdManageAccounts,
      text: "Manage your account",
      mobileText: "Manage",
    },
    {
      icon: MdSwitchAccount,
      text: "Switch account",
      mobileText: "Switch",
    },
    {
      icon: MdPersonAddAlt1,
      text: "Add account",
      mobileText: "Add",
    },
  ]

  const personalInfoSections = [
    { title: "Legal name", value: "Gerald", action: "Edit" },
    { title: "Email address", value: "x*****@hw.ac.uk", action: "Edit" },
    {
      title: "Phone numbers",
      value: "Add a number to get in touch with you. You can add other numbers and choose how they're used.",
      action: "Add",
    },
    { title: "Government ID", value: "Verified", action: "Edit" },
    { title: "Address", value: "Not provided", action: "Edit" },
  ]

  return (
    <main className={styles.mainContent}>
      <h1 className={styles.header}>Your Profile</h1>
      <div className={styles.profileBox}>
        {/* Edit and Delete Icons */}
        <div className={styles.actionIcons}>
          <button className={styles.iconButton}>
            <MdOutlineMode size={22} />
          </button>
          <button className={styles.iconButton}>
            <MdDeleteOutline size={22} />
          </button>
        </div>

        {/* Profile Info */}
        <div className={styles.profileInfo}>
          <MdAccountCircle className={styles.logo} size={54} aria-hidden="true" />
          <div className={styles.textContainer}>
            <p>Admin XYZ</p>
            <p>xyz1234@hw.ac.uk</p>
          </div>
        </div>

        {/* Sign-Out Button */}
        <button className={styles.signOutButton}>Sign Out</button>
      </div>

      {/* User Icons */}
      <div className={styles.userIcons}>
        {accountActions.map(({ icon: Icon, text, mobileText }) => (
          <button key={text} className={styles.iconWithText}>
            <Icon size={24} />
            <span>{isMobile ? mobileText : text}</span>
          </button>
        ))}
      </div>

      {/* Personal Info */}
      <div>
        <h2 className={styles.personalInfo}>Personal Info</h2>
        <ul className={styles.infoList}>
          {personalInfoSections.map(({ title, value, action }) => (
            <li key={title} className={styles.infoItem}>
              <div className={styles.infoTitle}>
                {title} <button className={styles.editButton}>{action}</button>
              </div>
              <div className={styles.infoValue}>{value}</div>
              <div className={styles.infoUnderline}></div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}

