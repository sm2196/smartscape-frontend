"use client"

import { useState, useEffect } from "react"
import { initializeApp } from "firebase/app"
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore"
import {
  MdNotificationsActive,
  MdNotificationsOff,
  MdPower,
  MdWaterDrop,
  MdDevices,
  MdSecurity,
  MdSystemUpdate,
} from "react-icons/md" // ✅ FIXED import
import styles from "./NotificationsPage.module.css"

// 🔥 Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyAlcx97VjChNpSbLZbvfeMkremnLXHJgo0",
  authDomain: "smartscape-e062e.firebaseapp.com",
  projectId: "smartscape-e062e",
  storageBucket: "smartscape-e062e.appspot.com",
  messagingSenderId: "10186914859",
  appId: "1:10186914859:web:fa2ce3e7c403d15ca6fe6e",
  measurementId: "G-XD1W6VEJ36"
}

// 🔥 Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// 🔥 Firestore Document ID
const NOTIF_DOC_ID = "5RbPgXddvtbaMFNsZcTya5K55w13"

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState({})

  // ✅ Fetch notifications from Firestore
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const docRef = doc(db, "Notifications", NOTIF_DOC_ID)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          setNotifications(docSnap.data())
        } else {
          console.error("No document found!")
        }
      } catch (error) {
        console.error("Error fetching notifications:", error)
      }
    }

    fetchNotifications()
  }, [])

  // ✅ Toggle notification and update Firestore
  const toggleNotification = async (type) => {
    const updatedNotifications = {
      ...notifications,
      [type]: !notifications[type],
    }

    setNotifications(updatedNotifications) // Update UI first

    try {
      await setDoc(doc(db, "Notifications", NOTIF_DOC_ID), updatedNotifications, { merge: true })
    } catch (error) {
      console.error("Error updating Firestore:", error)
    }
  }

  // ✅ Notification List
  const notificationList = [
    { key: "usageAlerts", name: "Usage Alerts", icon: MdPower },
    { key: "outageAlerts", name: "Outage Alerts", icon: MdPower },
    { key: "consumptionAlerts", name: "Consumption Alerts", icon: MdWaterDrop },
    { key: "leakAlerts", name: "Leak Detection", icon: MdWaterDrop },
    { key: "deviceStatus", name: "Device Status", icon: MdDevices },
    { key: "firmwareUpdates", name: "Firmware Updates", icon: MdDevices },
    { key: "doorAlerts", name: "Door Alerts", icon: MdSecurity },
    { key: "motionDetection", name: "Motion Detection", icon: MdSecurity },
    { key: "maintenanceAlerts", name: "Maintenance Reminders", icon: MdSystemUpdate },
    { key: "softwareUpdates", name: "Software Updates", icon: MdSystemUpdate },
  ]

  return (
    <main className={styles.mainContent}>
      <h1 className={styles.header}>Notifications</h1>
      <p className={styles.description}>Manage alerts for electricity, water, security, and your smart devices.</p>

      <div className={styles.notificationContainer}>
        {notificationList.map(({ key, name, icon: Icon }) => (
          <div key={key} className={styles.notificationItem}>
            <Icon size={28} />
            <span>{name}</span>
            <button
              className={`${styles.toggleButton} ${
                notifications[key] ? styles.on : styles.off
              }`}
              onClick={() => toggleNotification(key)}
            >
              {notifications[key] ? <MdNotificationsActive size={20} /> : <MdNotificationsOff size={20} />}
              {notifications[key] ? "On" : "Off"}
            </button>
          </div>
        ))}
      </div>
    </main>
  )
}
