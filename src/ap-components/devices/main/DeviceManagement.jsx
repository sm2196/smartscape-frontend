import React from 'react';
import { ChevronRight } from 'lucide-react';
import Button from '../additional/Button'; // Make sure this is the correct path
import styles from './DeviceManagement.module.css'; // Import the CSS module

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
            <Button key={room} variant="ghost" className={styles.buttonItem}>
              {room}
              <ChevronRight className={styles.chevronIcon} />
            </Button>
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
            <Button key={item} variant="ghost" className={styles.buttonItem}>
              {item}
              <ChevronRight className={styles.chevronIcon} />
            </Button>
          ))}
        </div>
      </div>

    </div>
  );
};

export default DeviceManagement;