"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useFirestoreData } from "@/hooks/useFirestoreData"
import { getUserId } from "@/lib/userCache"
import {
  MdPower,
  MdWaterDrop,
  MdDevices,
  MdSecurity,
  MdSystemUpdate,
  MdInfo,
  MdRefresh,
  MdElectricBolt,
  MdWifi,
  MdHome,
} from "react-icons/md"
import styles from "./NotificationsPage.module.css"

export default function NotificationsPage() {
  const { user, loading: authLoading } = useAuth()
  const [error, setError] = useState(null)

  // Get user ID with priority from cache first, then from auth object
  const userId = getUserId(user)

  // Default notification settings for new users
  const defaultNotifications = {
    usageAlerts: true,
    outageAlerts: true,
    consumptionAlerts: true,
    leakAlerts: true,
    deviceStatus: true,
    firmwareUpdates: true,
    doorAlerts: true,
    motionDetection: true,
    maintenanceAlerts: true,
    softwareUpdates: true,
    batteryAlerts: true,
    wifiConnectivity: true,
    homeAway: false,
  }

  // Use our custom hook to fetch and cache notification settings
  const {
    data: notifications,
    loading: dataLoading,
    error: dataError,
    updateData,
    refetch,
  } = useFirestoreData("Notifications", userId, {
    localStorageCache: true, // Enable localStorage caching for persistence
    cacheDuration: 30 * 60 * 1000, // Cache for 30 minutes
    defaultData: defaultNotifications, // Default data for new users
  })

  // Set error state if there's an error from the hook
  useEffect(() => {
    if (dataError && dataError !== "Document ID is required") {
      setError(dataError)
    }
  }, [dataError])

  // Toggle notification and update Firestore
  const toggleNotification = async (type) => {
    if (!userId) return

    const updatedValue = !notifications[type]

    try {
      // Use our updateData function to update both Firestore and cache
      await updateData({ [type]: updatedValue })
    } catch (error) {
      console.error("Error updating Firestore:", error)
      setError("Failed to update notification settings")
      // If there's an error, refetch to ensure UI is in sync with server
      refetch()
    }
  }

  // Notification categories
  const notificationCategories = [
    {
      title: "Utilities",
      icon: MdElectricBolt,
      items: [
        { key: "usageAlerts", name: "Usage Alerts", icon: MdPower },
        { key: "outageAlerts", name: "Outage Alerts", icon: MdPower },
        { key: "consumptionAlerts", name: "Consumption Alerts", icon: MdWaterDrop },
        { key: "leakAlerts", name: "Leak Detection", icon: MdWaterDrop },
      ],
    },
    {
      title: "Devices",
      icon: MdDevices,
      items: [
        { key: "deviceStatus", name: "Device Status", icon: MdDevices },
        { key: "firmwareUpdates", name: "Firmware Updates", icon: MdSystemUpdate },
        { key: "batteryAlerts", name: "Battery Alerts", icon: MdInfo },
        { key: "wifiConnectivity", name: "WiFi Connectivity", icon: MdWifi },
      ],
    },
    {
      title: "Security",
      icon: MdSecurity,
      items: [
        { key: "doorAlerts", name: "Door Alerts", icon: MdSecurity },
        { key: "motionDetection", name: "Motion Detection", icon: MdSecurity },
        { key: "homeAway", name: "Home/Away Status", icon: MdHome },
      ],
    },
    {
      title: "Maintenance",
      icon: MdSystemUpdate,
      items: [
        { key: "maintenanceAlerts", name: "Maintenance Reminders", icon: MdSystemUpdate },
        { key: "softwareUpdates", name: "Software Updates", icon: MdRefresh },
      ],
    },
  ]

  // Determine if we're in a loading state
  const isLoading = (authLoading && !userId) || (userId && dataLoading)

  if (isLoading) {
    return (
      <main className={styles.mainContent}>
        <div className={styles.pageHeader}>
          <h1 className={styles.header}>Notifications</h1>
        </div>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p className={styles.loadingText}>Loading notification settings...</p>
        </div>
      </main>
    )
  }

  // If no user ID is available, show authentication required message
  if (!userId) {
    return (
      <main className={styles.mainContent}>
        <div className={styles.pageHeader}>
          <h1 className={styles.header}>Notifications</h1>
        </div>
        <div className={styles.errorContainer}>
          <p className={styles.errorMessage}>Authentication required. Please log in to view your notifications.</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className={styles.mainContent}>
        <div className={styles.pageHeader}>
          <h1 className={styles.header}>Notifications</h1>
        </div>
        <div className={styles.errorContainer}>
          <p className={styles.errorMessage}>{error}</p>
          <button className={styles.retryButton} onClick={refetch}>
            <MdRefresh size={16} />
            Retry
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className={styles.mainContent}>
      <div className={styles.pageHeader}>
        <h1 className={styles.header}>Notifications</h1>
        <p className={styles.description}>Manage alerts for electricity, water, security, and your smart devices.</p>
      </div>

      <div className={styles.notificationGrid}>
        {notificationCategories.map((category) => (
          <div key={category.title} className={styles.categoryCard}>
            <div className={styles.categoryHeader}>
              <category.icon size={24} />
              <h2>{category.title}</h2>
            </div>
            <div className={styles.notificationList}>
              {category.items.map(({ key, name, icon: Icon }) => (
                <div key={key} className={styles.notificationItem}>
                  <div className={styles.notificationInfo}>
                    <Icon size={20} className={styles.notificationIcon} />
                    <span>{name}</span>
                  </div>
                  <button
                    className={`${styles.toggleButton} ${notifications && notifications[key] ? styles.on : styles.off}`}
                    onClick={() => toggleNotification(key)}
                    aria-label={`${notifications && notifications[key] ? "Disable" : "Enable"} ${name}`}
                  >
                    <span className={styles.toggleTrack}>
                      <span className={styles.toggleThumb} />
                    </span>
                    <span className={styles.toggleStatus}>{notifications && notifications[key] ? "On" : "Off"}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}

