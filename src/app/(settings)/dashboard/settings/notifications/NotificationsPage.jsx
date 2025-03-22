"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/hooks/useAuth"
import { useFirestoreData } from "@/hooks/useFirestoreData"
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
  MdNotifications,
  MdDashboard,
} from "react-icons/md"
import styles from "./NotificationsPage.module.css"
import { getUserId, getRelatedCollectionsFromCache, saveRelatedCollectionsToCache } from "@/lib/cacheUtils"

// Change the CACHE_COLLECTIONS constant to only include "Users"
const CACHE_COLLECTIONS = ["Users"]
const CACHE_EXPIRATION = 30 * 60 * 1000 // 30 minutes in milliseconds

export default function NotificationsPage() {
  const { user, loading: authLoading } = useAuth()
  const [error, setError] = useState(null)
  const [userId, setUserId] = useState(null)
  const [profile, setProfile] = useState(null)
  const [activeCategory, setActiveCategory] = useState("all")
  const [showNotificationDemo, setShowNotificationDemo] = useState(false)

  // Use useEffect to get userId on client-side only
  useEffect(() => {
    // Get user ID with priority from cache first, then from auth object
    setUserId(getUserId(user))
  }, [user])

  // Default notification settings - all notifications enabled by default
  const defaultEnabledNotifications = [
    "usageAlerts",
    "outageAlerts",
    "consumptionAlerts",
    "leakAlerts",
    "deviceStatus",
    "firmwareUpdates",
    "doorAlerts",
    "motionDetection",
    "maintenanceAlerts",
    "softwareUpdates",
    "batteryAlerts",
    "wifiConnectivity",
    // "homeAway" is disabled by default
  ]

  // Update the useFirestoreData hook usage to target the Users collection
  const {
    data: userData,
    loading: dataLoading,
    error: dataError,
    updateData,
    refetch,
  } = useFirestoreData("Users", userId, {
    localStorageCache: true, // Enable localStorage caching for persistence
    cacheDuration: 30 * 60 * 1000, // Cache for 30 minutes
    defaultData: { enabledNotifications: defaultEnabledNotifications }, // Default data for new users
  })

  // Extract enabled notifications from user data
  const enabledNotifications = userData?.enabledNotifications || defaultEnabledNotifications

  // Set error state if there's an error from the hook
  useEffect(() => {
    if (dataError) {
      setError(dataError)
    }
  }, [dataError])

  // Replace the fetchProfile function with this enhanced version that uses caching
  const fetchNotificationSettings = useCallback(
    async (skipCache = false) => {
      try {
        if (!userId) return

        // Check cache first if not skipping cache
        if (!skipCache) {
          const cachedData = getRelatedCollectionsFromCache(CACHE_COLLECTIONS, CACHE_EXPIRATION)
          if (cachedData && cachedData.users) {
            setProfile(cachedData.users)
            setError(null)
            return
          }
        }

        // If no cache or skipCache is true, fetch from Firestore
        if (userData) {
          // Store the user data
          setProfile(userData)

          // Update cache with fresh data
          saveRelatedCollectionsToCache(CACHE_COLLECTIONS, [userData])

          setError(null)
        } else {
          setError("User profile not found")
        }
      } catch (error) {
        console.error("Error fetching notification settings:", error)
        setError("Failed to load notification settings. Please try again.")
      }
    },
    [userId, userData], // Remove defaultEnabledNotifications from dependencies
  )

  // Update the useEffect that calls fetchProfile to be more robust
  useEffect(() => {
    // Only fetch if we have a userId and userData but no profile yet
    if (userId && userData && !profile) {
      fetchNotificationSettings()
    }
  }, [fetchNotificationSettings, userId, profile, userData])

  // Update the toggleNotification function to be more robust with caching
  const toggleNotification = async (type) => {
    if (!userId) return

    // Check if notification is currently enabled
    const isEnabled = enabledNotifications.includes(type)
    let updatedNotifications

    if (isEnabled) {
      // Remove from array if currently enabled
      updatedNotifications = enabledNotifications.filter((item) => item !== type)
    } else {
      // Add to array if currently disabled
      updatedNotifications = [...enabledNotifications, type]
    }

    try {
      // Update the enabledNotifications array in the user document
      const result = await updateData({
        enabledNotifications: updatedNotifications,
      })

      if (result.success) {
        // Update the cache with the new notification settings
        if (profile) {
          const updatedProfile = {
            ...profile,
            enabledNotifications: updatedNotifications,
          }

          // Save updated profile to cache
          saveRelatedCollectionsToCache(CACHE_COLLECTIONS, [updatedProfile])
        }

        // Show notification demo if motion detection was just enabled
        if (type === "motionDetection" && !isEnabled) {
          setShowNotificationDemo(true)
          setTimeout(() => setShowNotificationDemo(false), 5000)
        }
      } else {
        // If update failed, show error and refetch
        console.error("Failed to update notification settings")
        setError("Failed to update notification settings")
        refetch()
      }
    } catch (error) {
      console.error("Error updating Firestore:", error)
      setError("Failed to update notification settings")
      // If there's an error, refetch to ensure UI is in sync with server
      refetch()
    }
  }

  // Helper function to get the appropriate animation class based on notification type
  const getIconAnimationClass = (key, isEnabled) => {
    if (!isEnabled) return ""

    // Return specific animation class based on notification type
    if (key === "usageAlerts" || key === "outageAlerts") return styles.powerAnimation
    if (key === "consumptionAlerts" || key === "leakAlerts") return styles.waterAnimation
    if (key === "deviceStatus") return styles.deviceAnimation
    if (key === "firmwareUpdates" || key === "softwareUpdates") return styles.updateAnimation
    if (key === "doorAlerts" || key === "motionDetection") return styles.securityAnimation
    if (key === "batteryAlerts") return styles.batteryAnimation
    if (key === "wifiConnectivity") return styles.wifiAnimation
    if (key === "homeAway") return styles.homeAnimation
    if (key === "maintenanceAlerts") return styles.maintenanceAnimation

    return "" // Default: no animation
  }

  // Notification categories
  const notificationCategories = [
    {
      id: "utilities",
      title: "Utilities",
      icon: MdElectricBolt,
      color: "utilities",
      items: [
        {
          key: "usageAlerts",
          name: "Usage Alerts",
          icon: MdPower,
          description: "Get notified about unusual power usage patterns",
        },
        {
          key: "outageAlerts",
          name: "Outage Alerts",
          icon: MdPower,
          description: "Be alerted when power outages occur in your area",
        },
        {
          key: "consumptionAlerts",
          name: "Consumption Alerts",
          icon: MdWaterDrop,
          description: "Monitor your water consumption levels",
        },
        {
          key: "leakAlerts",
          name: "Leak Detection",
          icon: MdWaterDrop,
          description: "Get immediate alerts when water leaks are detected",
        },
      ],
    },
    {
      id: "devices",
      title: "Devices",
      icon: MdDevices,
      color: "devices",
      items: [
        {
          key: "deviceStatus",
          name: "Device Status",
          icon: MdDevices,
          description: "Stay updated on the status of all your connected devices",
        },
        {
          key: "firmwareUpdates",
          name: "Firmware Updates",
          icon: MdSystemUpdate,
          description: "Get notified when firmware updates are available",
        },
        {
          key: "batteryAlerts",
          name: "Battery Alerts",
          icon: MdInfo,
          description: "Receive alerts when device batteries are running low",
        },
        {
          key: "wifiConnectivity",
          name: "WiFi Connectivity",
          icon: MdWifi,
          description: "Be alerted when devices disconnect from WiFi",
        },
      ],
    },
    {
      id: "security",
      title: "Security",
      icon: MdSecurity,
      color: "security",
      items: [
        {
          key: "doorAlerts",
          name: "Door Alerts",
          icon: MdSecurity,
          description: "Get notified when doors are opened or left open",
        },
        {
          key: "motionDetection",
          name: "Motion Detection",
          icon: MdSecurity,
          description: "Receive alerts when motion is detected in your home",
        },
        {
          key: "homeAway",
          name: "Home/Away Status",
          icon: MdHome,
          description: "Automatically adjust settings when you're away from home",
        },
      ],
    },
    {
      id: "maintenance",
      title: "Maintenance",
      icon: MdSystemUpdate,
      color: "maintenance",
      items: [
        {
          key: "maintenanceAlerts",
          name: "Maintenance Reminders",
          icon: MdSystemUpdate,
          description: "Get reminders for regular device maintenance",
        },
        {
          key: "softwareUpdates",
          name: "Software Updates",
          icon: MdRefresh,
          description: "Stay updated with the latest software improvements",
        },
      ],
    },
  ]

  // Determine if we're in a loading state
  const isLoading = (authLoading && !userId) || (userId && dataLoading)

  // Filter categories based on active category
  const filteredCategories =
    activeCategory === "all"
      ? notificationCategories
      : notificationCategories.filter((category) => category.id === activeCategory)

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
        <div className={styles.headerContent}>
          <MdNotifications className={styles.headerIcon} />
          <div>
            <h1 className={styles.header}>Notifications</h1>
            <p className={styles.description}>
              Manage alerts for electricity, water, security, and your smart devices.
            </p>
          </div>
        </div>
        <button className={styles.refreshButton} onClick={refetch}>
          <MdRefresh size={16} />
          Refresh
        </button>
      </div>

      <div className={styles.categoryNav}>
        <button
          className={`${styles.categoryTab} ${activeCategory === "all" ? styles.activeTab : ""}`}
          onClick={() => setActiveCategory("all")}
        >
          <MdDashboard />
          <span>All</span>
        </button>
        {notificationCategories.map((category) => (
          <button
            key={category.id}
            className={`${styles.categoryTab} ${styles[`${category.color}Tab`]} ${activeCategory === category.id ? styles.activeTab : ""}`}
            onClick={() => setActiveCategory(category.id)}
          >
            <category.icon />
            <span>{category.title}</span>
          </button>
        ))}
      </div>

      <div className={styles.notificationGrid}>
        {filteredCategories.map((category) => (
          <div key={category.title} className={`${styles.categoryCard} ${styles[`${category.color}Card`]}`}>
            <div className={`${styles.categoryHeader} ${styles[`${category.color}Header`]}`}>
              <category.icon size={24} />
              <h2>{category.title}</h2>
            </div>
            <div className={styles.notificationList}>
              {category.items.map(({ key, name, icon: Icon, description }) => {
                const isEnabled = enabledNotifications.includes(key)
                const animationClass = getIconAnimationClass(key, isEnabled)

                return (
                  <div
                    key={key}
                    className={`${styles.notificationItem} ${isEnabled ? styles.enabled : styles.disabled}`}
                    onClick={() => toggleNotification(key)}
                    aria-label={`${isEnabled ? "Disable" : "Enable"} ${name}`}
                  >
                    <div className={styles.notificationInfo}>
                      <div
                        className={`${styles.notificationIconWrapper} ${styles[`${category.color}Icon`]} ${isEnabled ? styles.iconEnabled : ""}`}
                      >
                        <Icon size={20} className={`${styles.notificationIcon} ${animationClass}`} />
                      </div>
                      <div className={styles.notificationText}>
                        <span className={styles.notificationName}>{name}</span>
                        <span className={styles.notificationDescription}>{description}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Motion Detection Demo Notification */}
      {showNotificationDemo && (
        <div className={styles.demoNotification}>
          <div className={styles.demoNotificationIcon}>
            <MdSecurity size={24} />
          </div>
          <div className={styles.demoNotificationContent}>
            <h3>Motion Detected</h3>
            <p>Movement detected in Living Room at {new Date().toLocaleTimeString()}</p>
          </div>
        </div>
      )}
    </main>
  )
}

