"use client";

import { useState, useEffect } from "react";
import { MdChevronRight, MdAdd, MdRemove, MdWifi } from "react-icons/md";
import Button from "./RoomDeviceButton";
import styles from "./RoomDeviceManagement.module.css";
import { db } from "./firebaseConfig"; // Import the Firebase setup
import { collection, getDocs } from "firebase/firestore";

const DeviceManagement = () => {
  const [popupType, setPopupType] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [newRoomName, setNewRoomName] = useState("");
  const [rooms, setRooms] = useState([]);
  const [wifiEnabled, setWifiEnabled] = useState(false);
  const [bluetoothEnabled, setBluetoothEnabled] = useState(true);
  const [newDeviceCategory, setNewDeviceCategory] = useState("");
  const [newDeviceName, setNewDeviceName] = useState(""); // Add Devices
  const [newDevices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);

  const settings = [
    { name: "Network settings", type: "network", icon: MdWifi },
  ];

  // Fetch room names from Firestore
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "rooms"));
        const roomNames = querySnapshot.docs.map((doc) => doc.data().roomName); // Use 'roomName' instead of 'name'
        setRooms(roomNames);
      } catch (error) {
        console.error("Error fetching rooms: ", error);
      }
    };

    fetchRooms();
  }, []);

  // Fetch devices from Firestore
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "devices"));
        const fetchedDevices = querySnapshot.docs.map((doc) => doc.data()); // Fetch device data
        setDevices(fetchedDevices);
      } catch (error) {
        console.error("Error fetching devices: ", error);
      }
    };

    fetchDevices();
  }, []);

  const openPopup = (type, room = null, device = null) => {
    setPopupType(type);
    if (room) setSelectedRoom(room);
    if (device) setSelectedDevice(device);
  };

  const closePopup = () => {
    setPopupType(null);
    setSelectedRoom(null);
    setNewRoomName("");
    setNewDeviceCategory("");
    setNewDeviceName("");
  };

  const handleSaveRoom = () => {
    if (newRoomName.trim() === "") {
      alert("Room name cannot be empty!");
      return;
    }

    if (rooms.includes(newRoomName.trim())) {
      alert("Room already exists!");
      return;
    }

    // Save to Firestore
    const roomRef = collection(db, "rooms");
    roomRef
      .add({ name: newRoomName.trim() })
      .then(() => {
        setRooms((prevRooms) => [...prevRooms, newRoomName.trim()]);
        closePopup();
      })
      .catch((error) => console.error("Error adding room: ", error));
  };

  const handleRemoveRoom = (roomName) => {
    // Remove from Firestore
    const roomRef = collection(db, "rooms");
    roomRef
      .where("name", "==", roomName)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          doc.ref.delete();
        });
        setRooms((prevRooms) => prevRooms.filter((room) => room !== roomName));
        closePopup();
      })
      .catch((error) => console.error("Error removing room: ", error));
  };

  const handleSaveDevice = () => {
    if (!newDeviceName.trim()) {
      alert("Device name cannot be empty!");
      return;
    }

    if (!newDeviceCategory.trim()) {
      alert("Please select a room for the device!");
      return;
    }

    // Add device to Firestore (add similar to room)
    const newDevice = {
      id: newDevices.length + 1,
      name: newDeviceName.trim(),
      category: newDeviceCategory,
      room: newDeviceCategory,
    };

    setDevices((prevDevices) => [...prevDevices, newDevice]);
    closePopup();
  };

  const DevicesList = () => (
    <div>
      {devices.length > 0 ? (
        devices.map(({ id, name, room }) => (
          <Button
            key={id}
            className={styles.buttonItem}
            onClick={() => openPopup("device", null, name)}
          >
            {name} - {room}
          </Button>
        ))
      ) : (
        <p>No devices found.</p>
      )}
    </div>
  );

  const renderPopupContent = () => {
    switch (popupType) {
      case "network":
        return (
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
            <select className={styles.inputField}>
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
            <select className={styles.inputField}>
              <option>XYZ Camera</option>
              <option>XYZ TV</option>
            </select>
          </div>
        );
      case "room":
        return selectedRoom ? (
          <Button
            className={`${styles.popupButton} ${styles.removeRoomButton}`}
            onClick={() => handleRemoveRoom(selectedRoom)}
          >
            Remove Room
          </Button>
        ) : (
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
        );
      case "addRoom":
        return (
          <div>
            <h3>Add New Room</h3>
            <input
              type="text"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSaveRoom()}
              className={styles.inputField}
              placeholder="Enter room name"
            />
            <div className={styles.popupButtonGroup}>
              <Button onClick={handleSaveRoom} className={styles.popupButton}>
                Save Room
              </Button>
            </div>
          </div>
        );

      case "addDevice":
        return (
          <div>
            <h3>Add New Device</h3>
            <select
              className={styles.inputField}
              value={newDeviceCategory}
              onChange={(e) => setNewDeviceCategory(e.target.value)} // Change handler to rooms
            >
              <option value="">Select Room</option>
              {rooms.map((room, index) => (
                <option key={index} value={room}>
                  {room}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={newDeviceName}
              onChange={(e) => setNewDeviceName(e.target.value)}
              className={styles.inputField}
              placeholder="Enter device name"
            />
            <div className={styles.popupButtonGroup}>
              <Button onClick={handleSaveDevice} className={styles.popupButton}>
                Save Device
              </Button>
            </div>
          </div>
        );

      case "device":
        return selectedDevice ? (
          <div>
            <h3>Modify {selectedDevice}</h3>
            <p>
              Location:{" "}
              {
                newDevices.find((device) => device.name === selectedDevice)
                  ?.room
              }
            </p>
            <Button
              className={`${styles.popupButton} ${styles.removeRoomButton}`}
              onClick={() => handleRemoveDevice(selectedDevice)}
            >
              Remove Device
            </Button>
          </div>
        ) : (
          <p>No device selected</p>
        );

      default:
        return null;
    }
  };

  return (
    <div className={styles.deviceManagementContainer}>
      {/* Rooms Section */}
      <div className={styles.section}>
        <h2 className={styles.sectionHeader}>Rooms</h2>
        <div className={styles.buttonList}>
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
          <Button
            className={styles.buttonItem}
            onClick={() => openPopup("addRoom")}
          >
            <MdAdd /> Add Room
          </Button>
        </div>
      </div>

      {/* Devices Section */}
      <div className={styles.section}>
        <h2 className={styles.sectionHeader}>Devices</h2>
        <div>
          <p className={styles.paragraph}>All Devices</p>
          <div className={styles.popupGrid}>
            {newDevices.length > 0 ? (
              newDevices.map(({ name }) => (
                <Button
                  key={name}
                  className={styles.buttonItem}
                  onClick={() => openPopup("device", null, name)}
                >
                  {name}
                  <MdChevronRight className={styles.chevronIcon} />
                </Button>
              ))
            ) : (
              <p>No devices found.</p>
            )}
          </div>
        </div>
        <div className={styles.buttonGroup}>
          <Button
            className={styles.buttonItem}
            onClick={() => openPopup("addDevice")}
          >
            <MdAdd /> Add Device
          </Button>
        </div>
      </div>

      {/* Pop-up */}
      {popupType && (
        <div className={styles.popupOverlay} onClick={closePopup}>
          <div
            className={styles.popupContent}
            onClick={(e) => e.stopPropagation()}
          >
            <h1>Options</h1>
            <h3>{selectedRoom}</h3> {/* Room name */}
            {renderPopupContent()}
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
