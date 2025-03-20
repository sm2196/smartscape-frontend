"use client";

import { useState, useEffect } from "react";
import { MdChevronRight, MdAdd, MdRemove, MdWifi } from "react-icons/md";
import Button from "./RoomDeviceButton";
import styles from "./RoomDeviceManagement.module.css";
import db from "./firebaseConfig"; // Import the Firebase setup
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  addDoc,
} from "firebase/firestore";

const DeviceManagement = () => {
  // State for managing popups
  const [popupType, setPopupType] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [newRoomName, setNewRoomName] = useState("");

  // State for managing rooms and devices
  const [rooms, setRooms] = useState([]);
  const [newDevices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);

  // State for network settings
  const [wifiEnabled, setWifiEnabled] = useState(false);
  const [bluetoothEnabled, setBluetoothEnabled] = useState(true);

  // State for new device input
  const [newDeviceCategory, setNewDeviceCategory] = useState("");
  const [newDeviceName, setNewDeviceName] = useState(""); // Add Devices

  const db = getFirestore();
  const devicesCollectionRef = collection(db, "devices");

  // Query Firestore for a device by name
  const deviceQuery = query(
    devicesCollectionRef,
    where("name", "==", newDeviceName)
  );

  const settings = [
    { name: "Network settings", type: "network", icon: MdWifi },
  ];

  // Fetch rooms from Firestore
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

  // Open and close popup functions
  const openPopup = (type, room = null, device = null) => {
    setPopupType(type);
    if (room) setSelectedRoom(room);
    if (device) setSelectedDevice(device);
  };

  // Close popup function
  const closePopup = () => {
    setPopupType(null);
    setSelectedRoom(null);
    setNewRoomName("");
    setNewDeviceCategory("");
    setNewDeviceName("");
  };

  // Save room function
  const handleSaveRoom = async () => {
    if (newRoomName.trim() === "") {
      alert("Room name cannot be empty!");
      return;
    }

    // Check if the room already exists
    if (rooms.includes(newRoomName.trim())) {
      alert("Room already exists!");
      return;
    }

    // Add new room to Firestore
    try {
      const roomRef = collection(db, "rooms");
      await addDoc(roomRef, { roomName: newRoomName.trim() });
      setRooms((prevRooms) => [...prevRooms, newRoomName.trim()]);
      closePopup();
    } catch (error) {
      console.error("Error adding room: ", error);
    }
  };

  // Remove room function
  const handleRemoveRoom = async (roomName) => {
    try {
      const roomRef = collection(db, "rooms");
      const q = query(roomRef, where("roomName", "==", roomName));
      const querySnapshot = await getDocs(q);

      // Check if the room exists
      if (querySnapshot.empty) {
        alert("Room not found!");
        return;
      }

      // Delete each matching document by its ID
      querySnapshot.forEach(async (roomDoc) => {
        await deleteDoc(doc(db, "rooms", roomDoc.id));
      });

      // Update UI state
      setRooms((prevRooms) => prevRooms.filter((room) => room !== roomName));
      closePopup();
    } catch (error) {
      console.error("Error removing room: ", error);
    }
  };

  // Save device function
  const handleSaveDevice = async () => {
    if (!newDeviceName.trim()) {
      alert("Device name cannot be empty!");
      return;
    }

    // Check if the device already exists
    if (!newDeviceCategory.trim()) {
      alert("Please select a room for the device!");
      return;
    }

    try {
      const deviceRef = collection(db, "devices");
      // Add new device to Firestore
      await addDoc(deviceRef, {
        name: newDeviceName.trim(),
        category: newDeviceCategory,
        room: newDeviceCategory,
      });
      setDevices((prevDevices) => [
        ...prevDevices,
        { name: newDeviceName.trim(), category: newDeviceCategory },
      ]);
      closePopup();
    } catch (error) {
      console.error("Error adding device: ", error);
    }
  };

  // Remove device function
  const handleRemoveDevice = async (deviceName) => {
    try {
      const deviceRef = collection(db, "devices");

      // Query Firestore for devices with the matching name
      const deviceQuery = query(deviceRef, where("name", "==", deviceName));
      const querySnapshot = await getDocs(deviceQuery);

      // Check if the device exists
      if (querySnapshot.empty) {
        alert("Device not found!");
        return;
      }

      // Iterate over each matching document and delete
      querySnapshot.forEach(async (deviceDoc) => {
        await deleteDoc(doc(db, "devices", deviceDoc.id));
      });

      // Update local state to remove the device from UI
      setDevices((prevDevices) =>
        prevDevices.filter((device) => device.name !== deviceName)
      );

      closePopup();
    } catch (error) {
      console.error("Error removing device: ", error);
    }
  };

  // Component to display a list of devices with buttons.
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

  // Function to render the content of the popup based on the type.
  const renderPopupContent = () => {
    switch (popupType) {
      // Add a case for the network popup
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
      // Add a case for the room popup
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
      // Add a case for the add room popup
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

      // Add a case for the add device popup
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

      // Add a case for the device popup
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

  // Return the JSX for the component
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
