import React from "react"
import { MdError } from "react-icons/md"
import styles from "../RoomDeviceManagement.module.css"

export const LoadingState = () => (
  <div className={styles.loadingContainer}>
    <div className={styles.loadingSpinner} />
    <p>Loading rooms and devices...</p>
  </div>
)

export const ErrorState = ({ error, onRetry }) => (
  <div className={styles.errorContainer}>
    <MdError size={48} className={styles.errorIcon} />
    <p className={styles.errorMessage}>{error}</p>
    <button onClick={onRetry} className={styles.retryButton}>
      Retry
    </button>
  </div>
)
