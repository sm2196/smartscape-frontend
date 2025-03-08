"use client"

import { FiChevronDown } from "react-icons/fi"
import { useState, useEffect, useRef } from "react" // Add useRef and useEffect
import styles from "./RoomSection.module.css"

export function RoomSection({ title, rooms, handleRoomChange, children }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null) // Add ref for dropdown container

  // Add click outside handler
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    // Add event listener when dropdown is open
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    // Cleanup event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isDropdownOpen])

  const handleRoomSelect = (room) => {
    handleRoomChange(room)
    setIsDropdownOpen(false)
  }

  return (
    <div className={styles.roomSection}>
      <div className={styles.roomTitleWrapper} ref={dropdownRef}>
        <h2 className={styles.roomTitle}>
          {title}
          {rooms && (
            <button className={styles.dropdownToggle} onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              <FiChevronDown size={24} />
            </button>
          )}
        </h2>
        {rooms && isDropdownOpen && (
          <div className={styles.dropdownMenu}>
            {rooms.map((room) => (
              <button key={room} className={styles.dropdownItem} onClick={() => handleRoomSelect(room)}>
                {room}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className={styles.deviceGrid}>{children}</div>
    </div>
  )
}