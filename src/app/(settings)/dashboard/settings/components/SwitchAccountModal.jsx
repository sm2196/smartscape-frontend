"use client"

import { MdClose, MdAccountCircle } from "react-icons/md"
import styles from "../ProfileContent.module.css"

export default function SwitchAccountModal({ isOpen, onClose, accounts, onSwitchAccount }) {
  if (!isOpen) return null

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Switch Account</h2>
          <button className={styles.modalCloseButton} onClick={onClose}>
            <MdClose size={20} />
          </button>
        </div>
        <div className={styles.modalContent}>
          <p className={styles.modalDescription}>Select an account to switch to:</p>
          <div className={styles.accountsList}>
            {accounts.map((account) => (
              <div key={account.id} className={styles.accountItem}>
                <div className={styles.accountAvatar}>
                  <MdAccountCircle size={24} />
                </div>
                <div className={styles.accountInfo}>
                  <div className={styles.accountName}>{account.name}</div>
                  <div className={styles.accountEmail}>{account.email}</div>
                  <div className={styles.accountRole}>{account.role === "admin" ? "Administrator" : "User"}</div>
                </div>
                {account.isActive ? (
                  <div className={styles.activeAccount}>Current</div>
                ) : (
                  <button className={styles.switchToButton} onClick={() => onSwitchAccount(account.id)}>
                    Switch
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.modalButtonSecondary} onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

