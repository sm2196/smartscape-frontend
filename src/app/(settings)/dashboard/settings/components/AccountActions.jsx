"use client"

import { MdLock, MdDeleteForever } from "react-icons/md"
import styles from "./AccountActions.module.css"

export default function AccountActions({ onDeleteAccount, onChangePassword }) {
  const accountActions = [
    {
      icon: MdLock,
      text: "Change Password",
      onClick: onChangePassword,
      className: "",
    },
    {
      icon: MdDeleteForever,
      text: "Delete Account",
      onClick: onDeleteAccount,
      className: styles.dangerAction,
    },
  ]

  return (
    <div className={styles.userIcons}>
      {accountActions.map(({ icon: Icon, text, onClick, className }) => (
        <button key={text} className={`${styles.iconWithText} ${className || ""}`} onClick={onClick}>
          <div className={styles.iconWrapper}>
            <Icon size={24} />
          </div>
          <span>{text}</span>
        </button>
      ))}
    </div>
  )
}

