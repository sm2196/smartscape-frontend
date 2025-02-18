import React from 'react';
import { ChevronRight } from 'lucide-react';
import Button from '../additional/ap_button'; // Make sure this is the correct path
import styles from './ap_DeviceManagement.module.css'; // Import the CSS module

<meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>

const DeviceManagement = () => {
  return (
    <div className={styles.ap_deviceManagementContainer}>
      {/* Rooms Section */}
      <div className={styles.ap_section}>
        <h2 className={styles.ap_sectionHeader}>Rooms</h2>
        <div className={styles.ap_buttonList}>
          {[ 'Hall', 'Dining room', 'Bedroom', 'Store room', 'Study room', 'Backyard', 'Parking lot' ].map(room => (
            <Button key={room} variant="ghost" className={styles.ap_buttonItem}>
              {room}
              <ChevronRight className={styles.ap_chevronIcon} />
            </Button>
          ))}
        </div>
        <div className={styles.ap_buttonGroup}>
        <Button className={styles.ap_buttonItem}>Add Rooms</Button>
        <Button className={styles.ap_buttonItem}>Remove Rooms</Button>
      </div>
      </div>


      {/* Devices Section */}
      <div className={styles.section}>
        <div className={styles.ap_sectionHeader}>
          <h2>Devices</h2>
        </div>
        <div className={styles.ap_buttonList}>
          {[ 'Bluetooth configuration', 'Choose a room', 'Choose by category', 'Network settings', 'Exclude device from shutdown', 'Manual override' ].map(item => (
            <Button key={item} variant="ghost" className={styles.ap_buttonItem}>
              {item}
              <ChevronRight className={styles.ap_chevronIcon} />
            </Button>
          ))}
        </div>
        <div className={styles.ap_buttonGroup}>
        <Button className={styles.ap_buttonItem}>Add Device</Button>
        <Button className={styles.ap_buttonItem}>Remove Device</Button>
      </div>
      </div>


    </div>
  );
};

export default DeviceManagement;