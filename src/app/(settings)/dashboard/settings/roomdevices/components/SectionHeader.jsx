import React from "react"
import { MdHome, MdDevicesOther, MdAdd } from "react-icons/md"
import styles from "../RoomDeviceManagement.module.css"

export const RoomsSectionHeader = ({ onAddRoom }) => (
  <div className={styles.sectionHeader}>
    <div className={styles.sectionTitleWrapper}>
      <MdHome className={styles.sectionIcon} />
      <h2 className={styles.sectionTitle}>Rooms</h2>
    </div>
    <button className={styles.addButton} onClick={onAddRoom}>
      <MdAdd />
      <span>Add Room</span>
    </button>
  </div>
)

export const DevicesSectionHeader = ({ onAddDevice, roomsCount }) => (
  <div className={styles.sectionHeader}>
    <div className={styles.sectionTitleWrapper}>
      <MdDevicesOther className={styles.sectionIcon} />
      <h2 className={styles.sectionTitle}>All Devices</h2>
    </div>
    <button
      className={styles.addButton}
      onClick={onAddDevice}
      disabled={roomsCount === 0}
      title={roomsCount === 0 ? "Add a room first" : "Add a new device"}
    >
      <MdAdd />
      <span>Add Device</span>
    </button>
  </div>
)
