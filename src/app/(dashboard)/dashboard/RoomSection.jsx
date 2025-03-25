"use client"

import { useState } from "react"
import styles from "./RoomSection.module.css"

export const RoomSection = ({ title, children, rooms, handleRoomChange }) => {
  const [isOpen, setIsOpen] = useState(false)

  // Check if there are any children to display
  const hasChildren = Array.isArray(children) ? children.length > 0 : !!children

  return (
    <div className={styles.roomSection}>
      <div className={styles.roomHeader}>
        <div className={styles.titleContainer}>
          <h2 className={styles.roomTitle}>{title}</h2>
          {rooms && rooms.length > 0 && (
            <div className={styles.roomSelector}>
              <button className={styles.roomSelectorButton} onClick={() => setIsOpen(!isOpen)} aria-expanded={isOpen}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`${styles.chevron} ${isOpen ? styles.chevronUp : ""}`}
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              {isOpen && (
                <div className={styles.roomDropdown}>
                  {rooms.map((room) => (
                    <button
                      key={room}
                      className={`${styles.roomOption} ${title === room ? styles.activeRoom : ""}`}
                      onClick={() => {
                        handleRoomChange(room)
                        setIsOpen(false)
                      }}
                    >
                      {room}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {hasChildren ? (
        <div className={styles.deviceGrid}>{children}</div>
      ) : (
        <div className={styles.emptyRoom}>No devices in this room</div>
      )}
    </div>
  )
}

