import React from "react"
import styles from "../RoomDeviceManagement.module.css"
import AddRoomModal from "./modals/AddRoomModal"
import RoomModal from "./modals/RoomModal"
import AddDeviceModal from "./modals/AddDeviceModal"
import DeviceModal from "./modals/DeviceModal"

const Modal = ({
  popupType,
  selectedRoom,
  selectedDevice,
  newRoomName,
  setNewRoomName,
  newDeviceCategory,
  setNewDeviceCategory,
  newDeviceName,
  setNewDeviceName,
  newDeviceType,
  setNewDeviceType,
  deviceTypeSearch,
  setDeviceTypeSearch,
  showDeviceTypeDropdown,
  setShowDeviceTypeDropdown,
  devices,
  selectedDeviceIcon,
  editedRoomName,
  setEditedRoomName,
  editedDeviceName,
  setEditedDeviceName,
  editedDeviceIcon,
  closePopup,
  handleSaveRoom,
  handleUpdateRoom,
  handleRemoveRoom,
  handleSaveDevice,
  handleUpdateDevice,
  handleRemoveDevice,
  handleDeviceTypeSelect,
  handleDeviceIconSelect,
  handleEditedDeviceIconSelect,
  filteredDeviceTypes,
  rooms,
  renderDeviceIcon,
  DEVICE_ICONS,
  deviceTypeDropdownRef,
  setPopupType, // Added setPopupType to props
}) => {
  if (!popupType) return null

  return (
    <div
      className={styles.modalOverlay}
      onClick={(e) => {
        // Only allow closing by clicking outside for viewing rooms or devices
        // Prevent closing when adding rooms or devices
        if (popupType !== "addRoom" && popupType !== "addDevice") {
          closePopup()
        }
      }}
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {popupType === "addRoom" && (
          <AddRoomModal
            newRoomName={newRoomName}
            setNewRoomName={setNewRoomName}
            closePopup={closePopup}
            handleSaveRoom={handleSaveRoom}
          />
        )}

        {popupType === "room" && selectedRoom && (
          <RoomModal
            selectedRoom={selectedRoom}
            devices={devices}
            editedRoomName={editedRoomName}
            setEditedRoomName={setEditedRoomName}
            closePopup={closePopup}
            handleRemoveRoom={handleRemoveRoom}
            handleUpdateRoom={handleUpdateRoom}
            renderDeviceIcon={renderDeviceIcon}
            openAddDevicePopup={() => {
              closePopup()
              setTimeout(() => {
                setPopupType("addDevice")
                setNewDeviceCategory(selectedRoom.id)
              }, 100)
            }}
          />
        )}

        {popupType === "addDevice" && (
          <AddDeviceModal
            newDeviceName={newDeviceName}
            setNewDeviceName={setNewDeviceName}
            newDeviceCategory={newDeviceCategory}
            setNewDeviceCategory={setNewDeviceCategory}
            newDeviceType={newDeviceType}
            deviceTypeSearch={deviceTypeSearch}
            setDeviceTypeSearch={setDeviceTypeSearch}
            showDeviceTypeDropdown={showDeviceTypeDropdown}
            setShowDeviceTypeDropdown={setShowDeviceTypeDropdown}
            selectedDeviceIcon={selectedDeviceIcon}
            closePopup={closePopup}
            handleSaveDevice={handleSaveDevice}
            handleDeviceTypeSelect={handleDeviceTypeSelect}
            handleDeviceIconSelect={handleDeviceIconSelect}
            filteredDeviceTypes={filteredDeviceTypes}
            rooms={rooms}
            DEVICE_ICONS={DEVICE_ICONS}
          />
        )}

        {popupType === "device" && selectedDevice && selectedRoom && (
          <DeviceModal
            selectedDevice={selectedDevice}
            selectedRoom={selectedRoom}
            editedDeviceName={editedDeviceName}
            setEditedDeviceName={setEditedDeviceName}
            editedDeviceIcon={editedDeviceIcon}
            closePopup={closePopup}
            handleRemoveDevice={handleRemoveDevice}
            handleUpdateDevice={handleUpdateDevice}
            renderDeviceIcon={renderDeviceIcon}
            DEVICE_ICONS={DEVICE_ICONS}
            handleEditedDeviceIconSelect={handleEditedDeviceIconSelect}
          />
        )}
      </div>
    </div>
  )
}

export default Modal
