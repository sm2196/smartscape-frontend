"use client"

import { MdClose, MdOutlineMode, MdSwitchAccount, MdPersonAddAlt1, MdDeleteOutline } from "react-icons/md"
import styles from "./ModalStyles.module.css"
import accountStyles from "./ManageAccountModal.module.css"

export default function ManageAccountModal({ isOpen, onClose, onEdit, onDelete }) {
  if (!isOpen) return null

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Manage Account</h2>
          <button className={styles.modalCloseButton} onClick={onClose}>
            <MdClose size={20} />
          </button>
        </div>
        <div className={styles.modalContent}>
          <div className={accountStyles.accountManagementOptions}>
            <button className={accountStyles.accountOption} onClick={() => onEdit("name")}>
              <MdOutlineMode size={20} />
              <span>Edit Profile Information</span>
            </button>
            <button className={accountStyles.accountOption} onClick={onClose}>
              <MdSwitchAccount size={20} />
              <span>Change Password</span>
            </button>
            <button className={accountStyles.accountOption} onClick={onClose}>
              <MdPersonAddAlt1 size={20} />
              <span>Privacy Settings</span>
            </button>
            <button className={`${accountStyles.accountOption} ${accountStyles.dangerOption}`} onClick={onDelete}>
              <MdDeleteOutline size={20} />
              <span>Delete Account</span>
            </button>
          </div>
        </div>
        <div className={styles.modalFooter}>
          <button className={styles.modalButtonSecondary} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

