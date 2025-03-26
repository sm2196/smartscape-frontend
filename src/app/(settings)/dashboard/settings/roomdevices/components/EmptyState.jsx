import React from "react"
import { MdHome, MdDevicesOther } from "react-icons/md"
import styles from "../RoomDeviceManagement.module.css"

export const EmptyRoomsState = ({ onAddRoom }) => (
  <div className={styles.emptyStateCard}>
    <MdHome className={styles.emptyStateIcon} />
    <p>No rooms added yet</p>
    <button className={styles.emptyStateButton} onClick={onAddRoom}>
      Add Your First Room
    </button>
  </div>
)

export const EmptyDevicesState = ({ onAddDevice, hasRooms }) => (
  <div className={styles.emptyStateCard}>
    <MdDevicesOther className={styles.emptyStateIcon} />
    <p>No devices added yet</p>
    <button
      className={styles.emptyStateButton}
      onClick={onAddDevice}
      disabled={!hasRooms}
    >
      {!hasRooms ? "Add a room first" : "Add Your First Device"}
    </button>
  </div>
)

export const EmptyRoomDevicesState = ({ onAddDevice }) => (
  <div className={styles.emptyState}>
    <MdDevicesOther className={styles.emptyStateIcon} />
    <p>No devices in this room</p>
    <button className={styles.emptyStateButton} onClick={onAddDevice}>
      Add a device
    </button>
  </div>
)
