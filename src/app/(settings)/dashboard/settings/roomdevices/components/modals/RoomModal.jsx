import React from "react"
import { MdClose, MdDelete, MdDevicesOther } from "react-icons/md"
import styles from "../../RoomDeviceManagement.module.css"
import { EmptyRoomDevicesState } from "../EmptyState"

const RoomModal = ({
  selectedRoom,
  devices,
  editedRoomName,
  setEditedRoomName,
  closePopup,
  handleRemoveRoom,
  handleUpdateRoom,
  renderDeviceIcon,
  openAddDevicePopup,
}) => {
  return (
    <>
      <div className={styles.modalHeader}>
        <div className={styles.editNameContainer}>
          <input
            type="text"
            value={editedRoomName}
            onChange={(e) => setEditedRoomName(e.target.value)}
            className={`${styles.input} ${styles.editNameInput}`}
            placeholder="Room Name"
          />
        </div>
        <button className={styles.closeButton} onClick={closePopup}>
          <MdClose />
        </button>
      </div>
      <div className={styles.modalContent}>
        <h3 className={styles.modalSubtitle}>Devices in this room</h3>
        <div className={styles.deviceList}>
          {devices[selectedRoom.id]?.map((device) => (
            <div key={device.id} className={styles.deviceItem}>
              <div className={styles.deviceItemContent}>
                <span className={styles.deviceItemName}>{device.deviceName}</span>
                {device.deviceIcon && renderDeviceIcon(device.deviceIcon)}
              </div>
            </div>
          ))}
          {!devices[selectedRoom.id]?.length && (
            <EmptyRoomDevicesState
              onAddDevice={() => {
                closePopup()
                setTimeout(() => openAddDevicePopup(), 100)
              }}
            />
          )}
        </div>
      </div>
      <div className={styles.modalFooter}>
        <button className={styles.dangerButton} onClick={() => handleRemoveRoom(selectedRoom)}>
          <MdDelete />
          Remove Room
        </button>
        <div className={styles.actionButtons}>
          <button className={styles.secondaryButton} onClick={closePopup}>
            Cancel
          </button>
          <button
            className={`${styles.primaryButton} ${!editedRoomName.trim() ? styles.disabledButton : ""}`}
            onClick={handleUpdateRoom}
            disabled={!editedRoomName.trim() || editedRoomName === selectedRoom.roomName}
          >
            Save Changes
          </button>
        </div>
      </div>
    </>
  )
}

export default RoomModal
