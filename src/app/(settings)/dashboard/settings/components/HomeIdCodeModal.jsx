"use client"

import { useState } from "react"
import { MdClose, MdContentCopy, MdHome, MdCheck } from "react-icons/md"
import styles from "./ModalStyles.module.css"
import homeIdStyles from "./HomeIdCodeModal.module.css"

export default function HomeIdCodeModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false)
  // Generate a random Home ID code
  const homeId = "SMART-" + Math.random().toString(36).substring(2, 8).toUpperCase()

  if (!isOpen) return null

  const handleCopy = () => {
    navigator.clipboard.writeText(homeId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Home ID Code</h2>
          <button className={styles.modalCloseButton} onClick={onClose}>
            <MdClose size={20} />
          </button>
        </div>
        <div className={styles.modalContent}>
          <div className={homeIdStyles.homeIdContainer}>
            <MdHome className={homeIdStyles.homeIcon} size={48} />
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
              <h3 className={homeIdStyles.instructionsTitle}>How to join:</h3>
              <ol className={homeIdStyles.instructionsList}>
                <li>Share this code with family members</li>
                <li>Ask them to create a new SmartScape account</li>
                <li>During registration, they should enter this Home ID code</li>
                <li>Once registered, they'll have access to your smart home devices</li>
              </ol>
            </div>
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

