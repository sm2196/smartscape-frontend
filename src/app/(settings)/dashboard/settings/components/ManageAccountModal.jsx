"use client"

import { useRouter } from "next/navigation"
import { MdClose, MdOutlineMode, MdPersonAddAlt1, MdDeleteOutline, MdLock } from "react-icons/md"
import styles from "./ModalStyles.module.css"
import accountStyles from "./ManageAccountModal.module.css"

export default function ManageAccountModal({ isOpen, onClose, onEdit, onDelete, onChangePassword }) {
  const router = useRouter()

  if (!isOpen) return null

  // Function to handle navigation to privacy settings
  const handleNavigateToPrivacy = () => {
    onClose() // Close the modal first
    router.push("/dashboard/settings/privacy") // Navigate to privacy settings
  }

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
            <button className={accountStyles.accountOption} onClick={onChangePassword}>
              <MdLock size={20} />
              <span>Change Password</span>
            </button>
            <button className={accountStyles.accountOption} onClick={handleNavigateToPrivacy}>
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

