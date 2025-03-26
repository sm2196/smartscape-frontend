import React from "react"
import { MdChevronRight } from "react-icons/md"
import styles from "../RoomDeviceManagement.module.css"

const DeviceItem = ({ device, room, onDeviceClick, renderDeviceIcon }) => {
  return (
    <div
      className={`${styles.deviceListItem}`}
      onClick={() => onDeviceClick(room, device)}
      data-testid={`device-item-${device.id}`}
    >
      <div className={styles.deviceListItemContent}>
        <div className={styles.deviceListItemLeft}>
          <div className={styles.deviceListItemName}>{device.deviceName}</div>
          <div className={styles.deviceListItemRoom}>{room.roomName}</div>
        </div>
        <div className={styles.deviceListItemRight}>
          {device.deviceIcon && (
            <div className={styles.deviceIconContainer}>{renderDeviceIcon(device.deviceIcon)}</div>
          )}
          <MdChevronRight className={styles.deviceListItemArrow} />
        </div>
      </div>
    </div>
  )
}

export default DeviceItem
