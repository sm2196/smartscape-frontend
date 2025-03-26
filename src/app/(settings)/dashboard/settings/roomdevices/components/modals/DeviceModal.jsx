import React from "react"
import { MdClose, MdDelete } from "react-icons/md"
import styles from "../../RoomDeviceManagement.module.css"
import { DEVICE_TYPES } from "../../constants/deviceTypes"

const DeviceModal = ({
  selectedDevice,
  selectedRoom,
  editedDeviceName,
  setEditedDeviceName,
  editedDeviceIcon,
  closePopup,
  handleRemoveDevice,
  handleUpdateDevice,
  renderDeviceIcon,
  DEVICE_ICONS,
  handleEditedDeviceIconSelect,
}) => {
  return (
    <>
      <div className={styles.modalHeader}>
        <div className={styles.editNameContainer}>
          <input
            type="text"
            value={editedDeviceName}
            onChange={(e) => setEditedDeviceName(e.target.value)}
            className={`${styles.input} ${styles.editNameInput}`}
            placeholder="Device Name"
          />
        </div>
        <button className={styles.closeButton} onClick={closePopup}>
          <MdClose />
        </button>
      </div>
      <div className={styles.modalContent}>
        <div className={styles.formGroup}>
          <label>Device Icon</label>
          <div className={styles.currentIconDisplay}>
            <div className={styles.selectedIconPreview}>
              {editedDeviceIcon
                ? renderDeviceIcon(editedDeviceIcon)
                : renderDeviceIcon(selectedDevice.deviceIcon) || <span>No icon selected</span>}
            </div>
          </div>

          {selectedDevice.deviceType && DEVICE_ICONS[selectedDevice.deviceType] && (
            <div className={styles.iconSelectionGrid}>
              {DEVICE_ICONS[selectedDevice.deviceType].map((iconConfig) => {
                const IconComponent = iconConfig.icon
                return (
                  <div
                    key={iconConfig.name}
                    className={`${styles.iconOption} ${
                      (editedDeviceIcon || selectedDevice.deviceIcon) === iconConfig.name
                        ? styles.selectedIcon
                        : ""
                    }`}
                    onClick={() => handleEditedDeviceIconSelect(iconConfig.name)}
                    title={iconConfig.label}
                  >
                    <IconComponent className={styles.iconDisplay} />
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className={styles.deviceDetails}>
          <div className={styles.deviceTypeDisplay}>
            <span className={styles.detailLabel}>Type:</span>
            <span className={styles.detailValue}>
              {DEVICE_TYPES.find((t) => t.value === selectedDevice.deviceType)?.label ||
                selectedDevice.deviceType}
            </span>
          </div>
          <div className={styles.deviceRoomDisplay}>
            <span className={styles.detailLabel}>Room:</span>
            <span className={styles.detailValue}>{selectedRoom.roomName}</span>
          </div>
        </div>
      </div>
      <div className={styles.modalFooter}>
        <button className={styles.dangerButton} onClick={() => handleRemoveDevice(selectedDevice)}>
          <MdDelete />
          Remove Device
        </button>
        <div className={styles.actionButtons}>
          <button className={styles.secondaryButton} onClick={closePopup}>
            Cancel
          </button>
          <button
            className={`${styles.primaryButton} ${
              !editedDeviceName.trim() ||
              (editedDeviceName === selectedDevice.deviceName && editedDeviceIcon === selectedDevice.deviceIcon)
                ? styles.disabledButton
                : ""
            }`}
            onClick={handleUpdateDevice}
            disabled={
              !editedDeviceName.trim() ||
              (editedDeviceName === selectedDevice.deviceName && editedDeviceIcon === selectedDevice.deviceIcon)
            }
          >
            Save Changes
          </button>
        </div>
      </div>
    </>
  )
}

export default DeviceModal
