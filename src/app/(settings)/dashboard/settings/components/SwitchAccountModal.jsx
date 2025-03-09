"use client"

import { MdClose, MdAccountCircle } from "react-icons/md"
import styles from "./ModalStyles.module.css"
import accountStyles from "./SwitchAccountModal.module.css"

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
          <div className={accountStyles.accountsList}>
            {accounts.map((account) => (
              <div key={account.id} className={accountStyles.accountItem}>
                <div className={accountStyles.accountAvatar}>
                  <MdAccountCircle size={24} />
                </div>
                <div className={accountStyles.accountInfo}>
                  <div className={accountStyles.accountName}>{account.name}</div>
                  <div className={accountStyles.accountEmail}>{account.email}</div>
                  <div className={accountStyles.accountRole}>{account.role === "admin" ? "Administrator" : "User"}</div>
                </div>
                {account.isActive ? (
                  <div className={accountStyles.activeAccount}>Current</div>
                ) : (
                  <button className={accountStyles.switchToButton} onClick={() => onSwitchAccount(account.id)}>
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

