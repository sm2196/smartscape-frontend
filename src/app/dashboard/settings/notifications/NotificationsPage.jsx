"use client"

import { useState, useEffect } from "react"
import {
  MdNotificationsActive,
  MdNotificationsOff,
  MdPower,
  MdWaterDrop,
  MdDevices,
  MdSecurity,
  MdSystemUpdate,
} from "react-icons/md"
import styles from "./NotificationsPage.module.css"

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState({
    electricity: { usageAlerts: true, outageAlerts: true },
    water: { consumptionAlerts: true, leakAlerts: true },
    devices: { deviceStatus: true, firmwareUpdates: true },
    security: { doorAlerts: true, motionDetection: true },
    system: { maintenanceAlerts: true, softwareUpdates: true },
  })

  useEffect(() => {
    const savedNotifications = JSON.parse(localStorage.getItem("notifications"))
    if (savedNotifications) setNotifications(savedNotifications)
  }, [])

  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications))
  }, [notifications])

  const toggleNotification = (category, type) => {
    setNotifications((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [type]: !prev[category][type],
      },
    }))
  }

  const notificationCategories = [
    {
      title: "Electricity",
      icon: MdPower,
      key: "electricity",
      subcategories: [
        { key: "usageAlerts", name: "Usage Alerts" },
        { key: "outageAlerts", name: "Outage Alerts" },
      ],
    },
    {
      title: "Water",
      icon: MdWaterDrop,
      key: "water",
      subcategories: [
        { key: "consumptionAlerts", name: "Consumption Alerts" },
        { key: "leakAlerts", name: "Leak Detection" },
      ],
    },
    {
      title: "Smart Devices",
      icon: MdDevices,
      key: "devices",
      subcategories: [
        { key: "deviceStatus", name: "Device Status" },
        { key: "firmwareUpdates", name: "Firmware Updates" },
      ],
    },
    {
      title: "Security",
      icon: MdSecurity,
      key: "security",
      subcategories: [
        { key: "doorAlerts", name: "Door Alerts" },
        { key: "motionDetection", name: "Motion Detection" },
      ],
    },
    {
      title: "System Alerts",
      icon: MdSystemUpdate,
      key: "system",
      subcategories: [
        { key: "maintenanceAlerts", name: "Maintenance Reminders" },
        { key: "softwareUpdates", name: "Software Updates" },
      ],
    },
  ]

  return (
    <main className={styles.mainContent}>
      <h1 className={styles.header}>Notifications</h1>
      <p className={styles.description}>Manage alerts for electricity, water, security, and your smart devices.</p>

      <div className={styles.notificationContainer}>
        {notificationCategories.map(({ title, icon: Icon, key, subcategories }) => (
          <div key={key} className={styles.notificationCategory}>
            <div className={styles.categoryHeader}>
              <Icon size={28} />
              <h2>{title}</h2>
            </div>
            <div className={styles.subcategoryList}>
              {subcategories.map(({ key: subKey, name }) => (
                <div key={subKey} className={styles.notificationItem}>
                  <span>{name}</span>
                  <button
                    className={`${styles.toggleButton} ${
                      notifications[key][subKey] ? styles.on : styles.off
                    }`}
                    onClick={() => toggleNotification(key, subKey)}
                  >
                    {notifications[key][subKey] ? <MdNotificationsActive size={20} /> : <MdNotificationsOff size={20} />}
                    {notifications[key][subKey] ? "On" : "Off"}
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
