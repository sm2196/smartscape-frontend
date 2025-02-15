import React from 'react';
import { ChevronRight } from 'lucide-react';
import Button from '../additional/ap_button'; // Make sure this is the correct path
import styles from './ap_DeviceManagement.module.css'; // Import the CSS module
import Popup from 'reactjs-popup'; // Import the Popup component

const DeviceManagement = () => {
  return (
    <div className={styles.deviceManagementContainer}>

      {/* Rooms Section */}
      <div className={styles.section}>
        <h2 className={styles.sectionHeader}>Rooms</h2>
        <div className={styles.buttonList}>
          {[
            'Hall',
            'Dining room',
            'Bedroom',
            'Store room',
            'Study room',
            'Backyard',
            'Parking lot'
          ].map(room => (
            <Popup
              key={room}
              trigger={
                <Button variant="ghost" className={styles.buttonItem}>
                  {room}
                  <ChevronRight className={styles.chevronIcon} />
                </Button>
              }
              modal
              closeOnDocumentClick
            >
              {(close) => (
                <div className={styles.popupContent}>
                  <h2>{room}</h2>
                  <p>Here you can add more details about the {room}.</p>
                  <Button onClick={close}>Close</Button>
                </div>
              )}
            </Popup>
          ))}
        </div>
      </div>

      {/* Devices Section */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Devices</h2>
          <div className={styles.buttonGroup}>
            <Button className={styles.buttonItem}>Add device</Button>
            <Button className={styles.buttonItem}>Remove device</Button>
          </div>
        </div>
        <div className={styles.buttonList}>
          {[
            'Bluetooth configuration',
            'Choose a room',
            'Choose by category',
            'Network settings',
            'Exclude device from shutdown',
            'Manual override',
          ].map(item => (
            <Popup
              key={item}
              trigger={
                <Button variant="ghost" className={styles.buttonItem}>
                  {item}
                  <ChevronRight className={styles.chevronIcon} />
                </Button>
              }
              modal
              closeOnDocumentClick
            >
              {(close) => (
                <div className={styles.popupContent}>
                  <h2>{item}</h2>
                  <p>Details about {item} can be added here.</p>
                  <Button onClick={close}>Close</Button>
                </div>
              )}
            </Popup>
          ))}
        </div>
      </div>

    </div>
  );
};

export default DeviceManagement;
