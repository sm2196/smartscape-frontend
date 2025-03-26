"use client"

import { useRef } from "react"
import { MdClose, MdSearch, MdCheck } from "react-icons/md"
import styles from "../../RoomDeviceManagement.module.css"

const AddDeviceModal = ({
  newDeviceName,
  setNewDeviceName,
  newDeviceCategory,
  setNewDeviceCategory,
  newDeviceType,
  setNewDeviceType, // Added setNewDeviceType here
  deviceTypeSearch,
  setDeviceTypeSearch,
  showDeviceTypeDropdown,
  setShowDeviceTypeDropdown,
  selectedDeviceIcon,
  closePopup,
  handleSaveDevice,
  handleDeviceTypeSelect,
  handleDeviceIconSelect,
  filteredDeviceTypes,
  rooms,
  DEVICE_ICONS,
}) => {
  const deviceTypeDropdownRef = useRef(null)

  const isDeviceNameValid = newDeviceName && newDeviceName.trim().length > 0
  const isDeviceCategoryValid = newDeviceCategory && newDeviceCategory.trim().length > 0
  const isDeviceTypeValid = newDeviceType && newDeviceType.trim().length > 0
  const isIconRequired = newDeviceType && DEVICE_ICONS[newDeviceType] && DEVICE_ICONS[newDeviceType].length > 1
  const isIconValid = !isIconRequired || (selectedDeviceIcon && selectedDeviceIcon.trim().length > 0)

  const isFormValid = isDeviceNameValid && isDeviceCategoryValid && isDeviceTypeValid && isIconValid

  return (
    <>
      <div className={styles.modalHeader}>
        <h2>Add New Device</h2>
        <button className={styles.closeButton} onClick={closePopup}>
          <MdClose />
        </button>
      </div>
      <div className={styles.modalContent}>
        <div className={styles.formGroup}>
          <label>Device Name</label>
          <input
            type="text"
            value={newDeviceName || ""}
            onChange={(e) => setNewDeviceName(e.target.value)}
            placeholder="Enter device name"
            className={styles.input}
            maxLength={50}
          />
          {newDeviceName !== undefined && newDeviceName.trim() === "" && (
            <p className={styles.errorText}>Device name cannot be empty</p>
          )}
        </div>
        <div className={styles.formGroup} ref={deviceTypeDropdownRef}>
          <label>Device Type</label>
          <div className={styles.searchableDropdown}>
            <div className={styles.searchInputWrapper}>
              <input
                type="text"
                value={deviceTypeSearch || ""}
                onChange={(e) => {
                  setDeviceTypeSearch(e.target.value)
                  setShowDeviceTypeDropdown(true)
                  if (!e.target.value) {
                    setNewDeviceType("")
                  }
                }}
                onFocus={() => setShowDeviceTypeDropdown(true)}
                placeholder="Search device type"
                className={styles.input}
              />
              <MdSearch className={styles.searchIcon} />
            </div>
            {showDeviceTypeDropdown && (
              <div className={styles.dropdownList}>
                {filteredDeviceTypes.length > 0 ? (
                  filteredDeviceTypes.map((type) => (
                    <div
                      key={type.value}
                      className={`${styles.dropdownItem} ${newDeviceType === type.value ? styles.selected : ""}`}
                      onClick={() => handleDeviceTypeSelect(type)}
                    >
                      {type.label}
                      {newDeviceType === type.value && <MdCheck className={styles.checkIcon} />}
                    </div>
                  ))
                ) : (
                  <div className={styles.noResults}>No device types found</div>
                )}
              </div>
            )}
          </div>
          {!isDeviceTypeValid && deviceTypeSearch && (
            <p className={styles.errorText}>Please select a valid device type</p>
          )}
        </div>

        {/* Icon selection for device types with icons */}
        {newDeviceType && DEVICE_ICONS[newDeviceType] && (
          <div className={styles.formGroup}>
            <label>Select Icon {isIconRequired && <span className={styles.requiredField}>*</span>}</label>
            <div className={styles.iconSelectionGrid}>
              {DEVICE_ICONS[newDeviceType].map((iconConfig) => {
                const IconComponent = iconConfig.icon
                return (
                  <div
                    key={iconConfig.name}
                    className={`${styles.iconOption} ${
                      selectedDeviceIcon === iconConfig.name ? styles.selectedIcon : ""
                    }`}
                    onClick={() => handleDeviceIconSelect(iconConfig.name)}
                    title={iconConfig.label}
                  >
                    <IconComponent className={styles.iconDisplay} />
                    <span className={styles.iconLabel}>{iconConfig.label}</span>
                  </div>
                )
              })}
            </div>
            {isIconRequired && !isIconValid && (
              <p className={styles.errorText}>Please select an icon for this device</p>
            )}
          </div>
        )}

        <div className={styles.formGroup}>
          <label>Room</label>
          <select
            value={newDeviceCategory || ""}
            onChange={(e) => setNewDeviceCategory(e.target.value)}
            className={styles.select}
          >
            <option value="">Select Room</option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.roomName}
              </option>
            ))}
          </select>
          {!isDeviceCategoryValid && <p className={styles.errorText}>Please select a room</p>}
        </div>
      </div>
      <div className={styles.modalFooter}>
        <button className={styles.secondaryButton} onClick={closePopup}>
          Cancel
        </button>
        <button
          className={`${styles.primaryButton} ${!isFormValid ? styles.disabledButton : ""}`}
          onClick={handleSaveDevice}
          disabled={!isFormValid}
        >
          Add Device
        </button>
      </div>
    </>
  )
}

export default AddDeviceModal

