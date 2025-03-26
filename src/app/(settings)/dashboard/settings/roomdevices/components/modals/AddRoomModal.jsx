import React from "react"
import { MdClose } from "react-icons/md"
import styles from "../../RoomDeviceManagement.module.css"

const AddRoomModal = ({ newRoomName, setNewRoomName, closePopup, handleSaveRoom }) => {
  return (
    <>
      <div className={styles.modalHeader}>
        <h2>Add New Room</h2>
        <button className={styles.closeButton} onClick={closePopup}>
          <MdClose />
        </button>
      </div>
      <div className={styles.modalContent}>
        <div className={styles.formGroup}>
          <label>Room Name</label>
          <input
            type="text"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            placeholder="Enter room name"
            className={styles.input}
          />
        </div>
      </div>
      <div className={styles.modalFooter}>
        <button className={styles.secondaryButton} onClick={closePopup}>
          Cancel
        </button>
        <button
          className={`${styles.primaryButton} ${!newRoomName.trim() ? styles.disabledButton : ""}`}
          onClick={handleSaveRoom}
          disabled={!newRoomName.trim()}
        >
          Add Room
        </button>
      </div>
    </>
  )
}

export default AddRoomModal
