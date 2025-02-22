"use client"

import { useState } from "react";
import { MdChevronRight } from 'react-icons/md';
import Button from "../../../../components/DeviceButton";
import styles from "./DeviceManagement.module.css";

const DeviceManagement = () => {
  const [popupType, setPopupType] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [wifiEnabled, setWifiEnabled] = useState(false);
  const [bluetoothEnabled, setBluetoothEnabled] = useState(true);

  const openPopup = (type, room = null) => {
    setPopupType(type);
    if (room) setSelectedRoom(room);
  };

  const closePopup = () => {
    setPopupType(null);
    setSelectedRoom(null);
  };

  const rooms = [
    { name: "Hall", content: ["Hall 1", "Hall 2", "Master Bedroom Hall"] },
    { name: "Dining room", content: null },
    { name: "Bedroom", content: ["Bedroom 1", "Bedroom 2", "Master Bedroom"] },
    { name: "Study room", content: null },
    { name: "Backyard", content: null },
    { name: "Parking lot", content: ["Closed Garage", "Outside Garage"] },
  ];

  const devices = [
    { name: "Network configuration", type: "network" },
    { name: "Choose by room", type: "room" },
    { name: "Choose by category", type: "category" },
  ];

  return (
    <div className={styles.ap_deviceManagementContainer}>
      {/* Rooms Section */}
      <div className={styles.ap_section}>
        <h2 className={styles.ap_sectionHeader}>Rooms</h2>
        <div className={styles.ap_buttonList}>
          {rooms.map(({ name, content }) => (
            <Button
              key={name}
              variant="ghost"
              className={styles.ap_buttonItem}
              onClick={() => (content ? openPopup("room", name) : null)}
            >
              {name}
              <MdChevronRight className={styles.ap_chevronIcon} />
            </Button>
          ))}
        </div>
        <div className={styles.ap_buttonGroup}>
          <Button className={styles.ap_buttonItem}>Add Rooms</Button>
          <Button className={styles.ap_buttonItem}>Remove Rooms</Button>
        </div>
      </div>

      {/* Devices Section */}
      <div className={styles.ap_section}>
        <h2 className={styles.ap_sectionHeader}>Devices</h2>
        <div className={styles.ap_buttonList}>
          {devices.map(({ name, type }) => (
            <Button
              key={name}
              variant="ghost"
              className={styles.ap_buttonItem}
              onClick={() => openPopup(type)}
            >
              {name}
              <MdChevronRight className={styles.ap_chevronIcon} />
            </Button>
          ))}
        </div>
        <div className={styles.ap_buttonGroup}>
          <Button className={styles.ap_buttonItem}>Add Device</Button>
          <Button className={styles.ap_buttonItem}>Remove Device</Button>
        </div>
      </div>

      {/* Pop-up for selected options */}
      {popupType && (
        <div className={styles.ap_popupOverlay} onClick={closePopup}>
          <div
            className={styles.ap_popupContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Options</h3>

            {popupType === "network" && (
              <div>
                {/* WiFi Toggle */}
                <div className={styles.ap_toggleContainer}>
                  <label htmlFor="wifiToggle">WiFi:</label>
                  <label className={styles.ap_toggleSwitch}>
                    <input
                      type="checkbox"
                      id="wifiToggle"
                      className={styles.ap_toggleInput}
                      checked={wifiEnabled}
                      onChange={() => setWifiEnabled(!wifiEnabled)}
                    />
                    <span className={styles.ap_toggleSlider}></span>
                  </label>
                </div>

                {/* WiFi Network Selection */}
                <select className={styles.ap_dropdown}>
                  <option>Eduroam</option>
                  <option>HWUD_Temp</option>
                  <option>HWUD_Guest</option>
                </select>

                {/* Bluetooth Toggle */}
                <div className={styles.ap_toggleContainer}>
                  <label htmlFor="bluetoothToggle">Bluetooth:</label>
                  <label className={styles.ap_toggleSwitch}>
                    <input
                      type="checkbox"
                      id="bluetoothToggle"
                      className={styles.ap_toggleInput}
                      checked={bluetoothEnabled}
                      onChange={() => setBluetoothEnabled(!bluetoothEnabled)}
                    />
                    <span className={styles.ap_toggleSlider}></span>
                  </label>
                </div>

                {/* Bluetooth Device List */}
                <select className={styles.ap_dropdown}>
                  <option>XYZ Camera</option>
                  <option>XYZ TV</option>
                </select>
              </div>
            )}

            {popupType === "room" && (
              <div className={styles.ap_popupList}>
                {/* Show sub-options if a specific room is selected */}
                {selectedRoom
                  ? rooms
                      .find((room) => room.name === selectedRoom)
                      ?.content?.map((item, index) => (
                        <Button key={index} className={styles.ap_popupButton}>
                          {item}
                        </Button>
                      ))
                  : /* Otherwise, show all available rooms */
                    rooms.map(({ name }) => (
                      <Button key={name} className={styles.ap_popupButton}>
                        {name}
                      </Button>
                    ))}
              </div>
            )}

            {popupType === "category" && (
              <div className={styles.ap_popupList}>
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
                  <Button key={index} className={styles.ap_popupButton}>
                    {item}
                  </Button>
                ))}
              </div>
            )}

            <Button className={styles.ap_popupClose} onClick={closePopup}>
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceManagement;
