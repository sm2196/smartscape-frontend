import styles from "./DeviceCard.module.css"

export function DeviceCard({ title, status, icon: Icon, isActive = false, onClick, statusColor }) {
  return (
    <button onClick={onClick} className={`${styles.deviceCard} ${isActive ? styles.active : ""}`}>
      <Icon className={`${styles.deviceIcon} ${styles[statusColor] || ""}`} />
      <div className={styles.deviceName}>{title}</div>
      <div className={styles.deviceStatus}>{status}</div>
    </button>
  )
}