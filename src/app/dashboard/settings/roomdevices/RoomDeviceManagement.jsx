"use client"

import { useState } from "react"
import { MdChevronRight, MdAdd, MdRemove, MdWifi } from "react-icons/md"
import Button from "./RoomDeviceButton"
import styles from "./RoomDeviceManagement.module.css"

const DeviceManagement = () => {
  const [popupType, setPopupType] = useState(null)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [wifiEnabled, setWifiEnabled] = useState(false)
  const [bluetoothEnabled, setBluetoothEnabled] = useState(true)

  const openPopup = (type, room = null) => {
    setPopupType(type)
    if (room) setSelectedRoom(room)
  }

  const closePopup = () => {
    setPopupType(null)
    setSelectedRoom(null)
  }

  const rooms = [
    { name: "Hall", content: ["Hall 1", "Hall 2", "Master Bedroom Hall"] },
    { name: "Kitchen", content: ["Main Kitchen", "Dinner Table"] },
    { name: "Bedroom", content: ["Bedroom 1", "Bedroom 2", "Master Bedroom"] },
    { name: "Study room", content: ["Main Room", "Storage"] },
    { name: "Backyard", content: ["Barbicu Corner", "Pool", "Gym Room"] },
    { name: "Parking lot", content: ["Closed Garage", "Outside Garage"] },
  ];

  const devices = [
    { name: "Network settings", type: "network", icon: MdWifi },
    { name: "Choose by room", type: "room", icon: MdChevronRight },
    { name: "Choose by category", type: "category", icon: MdChevronRight },
  ]

  return (
    <div className={styles.deviceManagementContainer}>
      {/* Rooms Section */}
      <div className={styles.section}>
        <h2 className={styles.sectionHeader}>Rooms</h2>
        <div className={styles.buttonList}>
          {rooms.map(({ name, content }) => (
            <Button key={name} className={styles.buttonItem} onClick={() => (content ? openPopup("room", name) : null)}>
              {name}
              <MdChevronRight className={styles.chevronIcon} />
            </Button>
          ))}
        </div>
        <div className={styles.buttonGroup}>
          <Button className={styles.buttonItem}>
            <MdAdd /> Add Rooms
          </Button>
          <Button className={styles.buttonItem}>
            <MdRemove /> Remove Rooms
          </Button>
        </div>
      </div>

      {/* Devices Section */}
      <div className={styles.section}>
        <h2 className={styles.sectionHeader}>Devices</h2>
        <div className={styles.buttonList}>
          {devices.map(({ name, type, icon: Icon }) => (
            <Button key={name} className={styles.buttonItem} onClick={() => openPopup(type)}>
              {name}
              <Icon className={styles.chevronIcon} />
            </Button>
          ))}
        </div>
        <div className={styles.buttonGroup}>
          <Button className={styles.buttonItem}>
            <MdAdd /> Add Device
          </Button>
          <Button className={styles.buttonItem}>
            <MdRemove /> Remove Device
          </Button>
        </div>
      </div>

      {/* Pop-up for selected options */}
      {popupType && (
        <div className={styles.popupOverlay} onClick={closePopup}>
          <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
            <h3>Options</h3>

            {popupType === "network" && (
              <div>
                <div className={styles.toggleContainer}>
                  <label htmlFor="wifiToggle">WiFi:</label>
                  <label className={styles.toggleSwitch}>
                    <input
                      type="checkbox"
                      id="wifiToggle"
                      className={styles.toggleInput}
                      checked={wifiEnabled}
                      onChange={() => setWifiEnabled(!wifiEnabled)}
                    />
                    <span className={styles.toggleSlider}></span>
                  </label>
                </div>

                <select className={styles.dropdown}>
                  <option>Eduroam</option>
                  <option>HWUD_Temp</option>
                  <option>HWUD_Guest</option>
                </select>

                <div className={styles.toggleContainer}>
                  <label htmlFor="bluetoothToggle">Bluetooth:</label>
                  <label className={styles.toggleSwitch}>
                    <input
                      type="checkbox"
                      id="bluetoothToggle"
                      className={styles.toggleInput}
                      checked={bluetoothEnabled}
                      onChange={() => setBluetoothEnabled(!bluetoothEnabled)}
                    />
                    <span className={styles.toggleSlider}></span>
                  </label>
                </div>

                <select className={styles.dropdown}>
                  <option>XYZ Camera</option>
                  <option>XYZ TV</option>
                </select>
              </div>
            )}

            {popupType === "room" && (
              <div className={styles.popupList}>
                {selectedRoom
                  ? rooms
                      .find((room) => room.name === selectedRoom)
                      ?.content?.map((item, index) => (
                        <Button key={index} className={styles.popupButton}>
                          {item}
                        </Button>
                      ))
                  : rooms.map(({ name }) => (
                      <Button key={name} className={styles.popupButton}>
                        {name}
                      </Button>
                    ))}
              </div>
            )}

            {popupType === "category" && (
              <div className={styles.popupList}>
                {[
                  "Appliances",
                  "Bulbs",
                  "Cameras & Video Doorbells",
                  "Garage Door Openers",
                  "Hubs",
                  "Locks",
                  "Plugs",
                  "Sensors",
                  "Thermostats",
                  "TVs",
                ].map((item, index) => (
                  <Button key={index} className={styles.popupButton}>
                    {item}
                  </Button>
                ))}
              </div>
            )}

            <Button className={styles.popupClose} onClick={closePopup}>
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default DeviceManagement

