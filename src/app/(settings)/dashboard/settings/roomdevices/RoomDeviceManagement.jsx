"use client";

import { useState, useEffect } from "react";
import { MdChevronRight, MdAdd, MdRemove, MdWifi } from "react-icons/md";
import Button from "./RoomDeviceButton";
import styles from "./RoomDeviceManagement.module.css";
import roomsData from "./rooms.json"; // Import the rooms data from the JSON file

const DeviceManagement = () => {
  // State hooks for managing the app's data
  const [popupType, setPopupType] = useState(null); // Tracks the current popup type (add room, add device, etc.)
  const [selectedRoom, setSelectedRoom] = useState(null); // Tracks the currently selected room
  const [wifiEnabled, setWifiEnabled] = useState(false); // State for enabling/disabling WiFi
  const [bluetoothEnabled, setBluetoothEnabled] = useState(true); // State for enabling/disabling Bluetooth
  const [newRoomName, setNewRoomName] = useState(""); // State for storing the new room name
  const [newDeviceCategory, setNewDeviceCategory] = useState(""); // State for storing the new device category
  const [newDeviceName, setNewDeviceName] = useState(""); // State for storing the new device name
  const [rooms, setRooms] = useState(roomsData[0]?.content || []); // Loads the rooms data from the JSON file into state

  // Function to open a popup based on type (e.g., "addRoom", "addDevice")
  const openPopup = (type, room = null) => {
    setPopupType(type); // Set the popup type (add room, add device, etc.)
    if (room) setSelectedRoom(room); // If a room is passed, set it as the selected room
  };

  // Function to close the currently open popup and reset states
  const closePopup = () => {
    setPopupType(null); // Clear the popup type to close the popup
    setSelectedRoom(null); // Clear the selected room
    setNewRoomName(""); // Reset the new room name
    setNewDeviceCategory(""); // Reset the new device category
    setNewDeviceName(""); // Reset the new device name
  };

  // Function to save the new room after it is entered
  const handleSaveRoom = () => {
    if (newRoomName.trim() !== "") {
      // If room name is not empty, add it to the content array of roomName object
      setRooms((prevRooms) => {
        const updatedRooms = [...prevRooms]; // Copy previous state to avoid direct mutation
        updatedRooms.push(newRoomName); // Add the new room to the end of the rooms array
        return updatedRooms; // Return the updated state
      });
      closePopup(); // Close the popup after saving
    }
  };

  // Function to remove a room from the rooms list
  const handleRemoveRoom = (roomName) => {
    setRooms((prevRooms) => prevRooms.filter((room) => room !== roomName)); // Filter by string
    closePopup(); // Close the popup after removing the room
  };

  // Function to save the new device after it is entered
  const handleSaveDevice = () => {
    if (newDeviceCategory.trim() !== "" && newDeviceName.trim() !== "") {
      // If device category and name are not empty, save the new device
      console.log("New Device:", newDeviceCategory, newDeviceName);
      closePopup(); // Close the popup after saving
    }
  };

  // Array for predefined devices
  const devices = [
    { name: "Network settings", type: "network", icon: MdWifi },
    { name: "Choose by room", type: "room", icon: MdChevronRight },
    { name: "Choose by category", type: "category", icon: MdChevronRight },
  ];

  return (
    <div className={styles.deviceManagementContainer}>
      {/* Rooms Section */}
      <div className={styles.section}>
        <h2 className={styles.sectionHeader}>Rooms</h2>
        <div className={styles.buttonList}>
          {/* Map through the rooms array and display buttons for each room */}
          {rooms.map((roomName) => (
            <Button
              key={roomName}
              className={styles.buttonItem}
              onClick={() => openPopup("room", roomName)}
            >
              {roomName}
              <MdChevronRight className={styles.chevronIcon} />
            </Button>
          ))}
        </div>
        <div className={styles.buttonGroup}>
          {/* Button to open the popup for adding a new room */}
          <Button
            className={styles.buttonItem}
            onClick={() => openPopup("addRoom")}
          >
            <MdAdd /> Add Room
          </Button>
          {/* Button for removing rooms (functionality not implemented here) */}
          <Button className={styles.buttonItem}>
            <MdRemove /> Remove Room
          </Button>
        </div>
      </div>

      {/* Devices Section */}
      <div className={styles.section}>
        <h2 className={styles.sectionHeader}>Devices</h2>
        <div className={styles.buttonList}>
          {/* Map through predefined devices array and display buttons for each device */}
          {devices.map(({ name, type, icon: Icon }) => (
            <Button
              key={name}
              className={styles.buttonItem}
              onClick={() => openPopup(type)} // Open appropriate popup based on device type
            >
              {name}
              <Icon className={styles.chevronIcon} />
            </Button>
          ))}
        </div>
        <div className={styles.buttonGroup}>
          {/* Button to open the popup for adding a new device */}
          <Button
            className={styles.buttonItem}
            onClick={() => openPopup("addDevice")}
          >
            <MdAdd /> Add Device
          </Button>
          {/* Button for removing devices (functionality not implemented here) */}
          <Button className={styles.buttonItem}>
            <MdRemove /> Remove Device
          </Button>
        </div>
      </div>

      {/* Pop-up for selected options */}
      {popupType && (
        <div className={styles.popupOverlay} onClick={closePopup}>
          <div
            className={styles.popupContent}
            onClick={(e) => e.stopPropagation()} // Prevent click on the popup from closing it
          >
            <h3>Options</h3>

            {/* Network settings popup */}
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
                      onChange={() => setWifiEnabled(!wifiEnabled)} // Toggle WiFi state
                    />
                    <span className={styles.toggleSlider}></span>
                  </label>
                </div>

                {/* Dropdown to choose WiFi network */}
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
                      onChange={() => setBluetoothEnabled(!bluetoothEnabled)} // Toggle Bluetooth state
                    />
                    <span className={styles.toggleSlider}></span>
                  </label>
                </div>

                {/* Dropdown to choose Bluetooth device */}
                <select className={styles.dropdown}>
                  <option>XYZ Camera</option>
                  <option>XYZ TV</option>
                </select>
              </div>
            )}

            {/* Room management popup */}
            {popupType === "room" && (
              <div>
                <h3>Manage {selectedRoom || "Rooms"}</h3>

                {/* If no room is selected, show all room buttons */}
                {!selectedRoom ? (
                  <div className={styles.popupList}>
                    {rooms.map((roomName) => (
                      <Button
                        key={roomName}
                        className={styles.buttonItem}
                        onClick={() => openPopup("room", roomName)}
                      >
                        {roomName}
                        <MdChevronRight className={styles.chevronIcon} />
                      </Button>
                    ))}
                  </div>
                ) : (
                  // If a room is selected, show the "Remove Room" button with red styling
                  <Button
                    className={`${styles.popupButton} ${styles.removeRoomButton}`}
                    onClick={() => handleRemoveRoom(selectedRoom)} // Remove the selected room
                  >
                    Remove Room
                  </Button>
                )}
              </div>
            )}

            {/* Device category management popup */}
            {popupType === "category" && (
              <div className={styles.popupList}>
                {/* List of device categories */}
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

            {/* Add Room Popup */}
            {popupType === "addRoom" && (
              <div>
                <h3>Add New Room</h3>

                {/* Input field for room name */}
                <input
                  type="text"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)} // Update room name state
                  onKeyPress={(e) => e.key === "Enter" && handleSaveRoom()} // Pressing Enter saves the room
                  className={styles.inputField}
                  placeholder="Enter room name"
                />
                <div className={styles.popupButtonGroup}>
                  <Button
                    onClick={handleSaveRoom}
                    className={styles.popupButton}
                  >
                    Save Room
                  </Button>
                </div>
              </div>
            )}

            {/* Add Device Popup */}
            {popupType === "addDevice" && (
              <div>
                <h3>Add New Device</h3>

                {/* Device Category Selection */}
                <select
                  className={styles.inputField}
                  value={newDeviceCategory}
                  onChange={(e) => setNewDeviceCategory(e.target.value)}
                >
                  <option value="">Select Category</option>
                  <option value="Light">Light</option>
                  <option value="Thermostat">Thermostat</option>
                  <option value="Plug">Plug</option>
                </select>

                {/* Device Name Input */}
                <input
                  type="text"
                  value={newDeviceName}
                  onChange={(e) => setNewDeviceName(e.target.value)}
                  className={styles.inputField}
                  placeholder="Enter device name"
                />
                <div className={styles.popupButtonGroup}>
                  <Button
                    onClick={handleSaveDevice}
                    className={styles.popupButton}
                  >
                    Save Device
                  </Button>
                </div>
              </div>
            )}
            <Button className={styles.popupClose} onClick={closePopup}>
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceManagement;
