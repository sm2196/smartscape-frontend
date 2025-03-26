import React from "react"
import { MdChevronRight } from "react-icons/md"
import styles from "../RoomDeviceManagement.module.css"

const RoomItem = ({ room, devices, onRoomClick }) => {
  return (
    <div className={styles.card} onClick={() => onRoomClick(room)} data-testid={`room-item-${room.id}`}>
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{room.roomName}</h3>
        <p className={styles.cardSubtitle}>{devices[room.id]?.length || 0} devices</p>
      </div>
      <div className={styles.cardArrowWrapper}>
        <MdChevronRight className={styles.cardArrow} />
      </div>
    </div>
  )
}

export default RoomItem
