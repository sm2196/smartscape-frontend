"use client"
import { MdClose, MdDelete } from "react-icons/md"
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
  const isRoomNameValid = editedRoomName && editedRoomName.trim().length > 0
  const hasChanges = selectedRoom && editedRoomName && editedRoomName.trim() !== selectedRoom.roomName

  return (
    <>
      <div className={styles.modalHeader}>
        <div className={styles.editNameContainer}>
          <input
            type="text"
            value={editedRoomName || ""}
            onChange={(e) => setEditedRoomName(e.target.value)}
            className={`${styles.input} ${styles.editNameInput}`}
            placeholder="Room Name"
            maxLength={50}
          />
        </div>
        <button className={styles.closeButton} onClick={closePopup}>
          <MdClose />
        </button>
      </div>
      <div className={styles.modalContent}>
        {!isRoomNameValid && <p className={styles.errorText}>Room name cannot be empty</p>}

        <h3 className={styles.modalSubtitle}>Devices in this room</h3>
        <div className={styles.deviceList}>
          {selectedRoom &&
            devices[selectedRoom.id]?.map((device) => (
              <div key={device.id} className={styles.deviceItem}>
                <div className={styles.deviceItemContent}>
                  <span className={styles.deviceItemName}>{device.deviceName}</span>
                  {device.deviceIcon && renderDeviceIcon(device.deviceIcon)}
                </div>
              </div>
            ))}
          {selectedRoom && (!devices[selectedRoom.id] || !devices[selectedRoom.id]?.length) && (
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
        <button
          className={styles.dangerButton}
          onClick={() => selectedRoom && handleRemoveRoom(selectedRoom)}
          disabled={!selectedRoom}
        >
          <MdDelete />
          Remove Room
        </button>
        <div className={styles.actionButtons}>
          <button className={styles.secondaryButton} onClick={closePopup}>
            Cancel
          </button>
          <button
            className={`${styles.primaryButton} ${!isRoomNameValid || !hasChanges ? styles.disabledButton : ""}`}
            onClick={handleUpdateRoom}
            disabled={!isRoomNameValid || !hasChanges}
          >
            Save Changes
          </button>
        </div>
      </div>
    </>
  )
}

export default RoomModal

