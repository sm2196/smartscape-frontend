import React from 'react';
import { ChevronRight } from 'lucide-react';
import Button from '../additional/ap_button'; // Make sure this is the correct path
import styles from './ap_DeviceManagement.module.css'; // Import the CSS module
import Popup from 'reactjs-popup'; // Import the Popup component

const DeviceManagement = () => {
  return (
    <div className={styles.ap_deviceManagementContainer}>

      {/* Rooms Section */}
      <div className={styles.ap_section}>
        <h2 className={styles.ap_sectionHeader}>Rooms</h2>
        <div className={styles.ap_buttonList}>
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
                <Button variant="ghost" className={styles.ap_buttonItem}>
                  {room}
                  <ChevronRight className={styles.ap_chevronIcon} />
                </Button>
              }
              modal
              closeOnDocumentClick
            >
              {(close) => (
                <div className={styles.ap_popupContent}>
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
        <div className={styles.ap_sectionHeader}>
          <h2>Devices</h2>
          <div className={styles.ap_buttonGroup}>
            <Button className={styles.ap_buttonItem}>Add device</Button>
            <Button className={styles.ap_buttonItem}>Remove device</Button>
          </div>
        </div>
        <div className={styles.ap_buttonList}>
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
                <Button variant="ghost" className={styles.ap_buttonItem}>
                  {item}
                  <ChevronRight className={styles.ap_chevronIcon} />
                </Button>
              }
              modal
              closeOnDocumentClick
            >
              {(close) => (
                <div className={styles.ap_popupContent}>
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
