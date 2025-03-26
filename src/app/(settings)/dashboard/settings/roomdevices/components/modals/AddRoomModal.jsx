"use client"
import { MdClose } from "react-icons/md"
import styles from "../../RoomDeviceManagement.module.css"

const AddRoomModal = ({ newRoomName, setNewRoomName, closePopup, handleSaveRoom }) => {
  const isRoomNameValid = newRoomName && newRoomName.trim().length > 0

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
            maxLength={50}
          />
          {newRoomName !== undefined && newRoomName.trim() === "" && (
            <p className={styles.errorText}>Room name cannot be empty</p>
          )}
        </div>
      </div>
      <div className={styles.modalFooter}>
        <button className={styles.secondaryButton} onClick={closePopup}>
          Cancel
        </button>
        <button
          className={`${styles.primaryButton} ${!isRoomNameValid ? styles.disabledButton : ""}`}
          onClick={handleSaveRoom}
          disabled={!isRoomNameValid}
        >
          Add Room
        </button>
      </div>
    </>
  )
}

export default AddRoomModal

