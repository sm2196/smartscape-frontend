"use client"

import { MdManageAccounts, MdSwitchAccount } from "react-icons/md"
import styles from "./AccountActions.module.css"

export default function AccountActions({ onManageAccount, onSwitchAccount, isMobile = false }) {
  const accountActions = [
    {
      icon: MdManageAccounts,
      text: "Manage your account",
      mobileText: "Manage",
      onClick: onManageAccount,
    },
    {
      icon: MdSwitchAccount,
      text: "Switch account",
      mobileText: "Switch",
      onClick: onSwitchAccount,
    },
  ]

  return (
    <div className={styles.userIcons}>
      {accountActions.map(({ icon: Icon, text, mobileText, onClick }) => (
        <button key={text} className={styles.iconWithText} onClick={onClick}>
          <div className={styles.iconWrapper}>
            <Icon size={24} />
          </div>
          <span>{isMobile ? mobileText : text}</span>
        </button>
      ))}
    </div>
  )
}

