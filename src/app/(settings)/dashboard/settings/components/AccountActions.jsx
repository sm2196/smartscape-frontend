"use client"

import { MdManageAccounts, MdSwitchAccount, MdAdd } from "react-icons/md"
import styles from "../ProfileContent.module.css"

export default function AccountActions({ onManageAccount, onSwitchAccount, onAddAccount, isMobile = false }) {
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
    {
      icon: MdAdd,
      text: "Add account",
      mobileText: "Add",
      onClick: onAddAccount,
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