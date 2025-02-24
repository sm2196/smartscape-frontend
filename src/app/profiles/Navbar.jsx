"use client"

import { useState, useEffect } from "react"
import { MdPerson, MdSecurity, MdSettings, MdNotifications, MdDevices, MdArrowBackIosNew } from "react-icons/md"
import Link from "next/link"
import { usePathname } from "next/navigation"
import styles from "./Navbar.module.css"

const navigation = [
  { name: "Profiles", href: "#", icon: MdPerson },
  { name: "Privacy & Security", href: "#", icon: MdSecurity },
  { name: "Admin Settings", href: "#", icon: MdSettings },
  { name: "Notifications", href: "#", icon: MdNotifications },
  { name: "Rooms & Devices", href: "#", icon: MdDevices },
  { name: "Back", href: "#", icon: MdArrowBackIosNew },
]

export default function Navbar() {
  const pathname = usePathname()
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
    }, 1000) // Update every second

    return () => clearInterval(interval) // Cleanup on unmount
  }, [])

  const hours = time.getHours() % 12 || 12
  const minutes = time.getMinutes()
  const ampm = time.getHours() >= 12 ? "PM" : "AM"

  const timeString = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} ${ampm}`

  const dateString = time.toLocaleDateString("en-AE", {
    weekday: "long", // e.g., "Wednesday"
    day: "numeric",  // e.g., "3"
    month: "short",  // e.g., "Feb"
  })

  return (
    <div className={styles.navbar}>
      <div className={styles.timeDisplay}>
        <div className={styles.currentTime}>{timeString}</div>
        <div className={styles.currentDate}>{dateString}</div>
      </div>
      <nav className={styles.navMenu}>
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.name} href={item.href} className={`${styles.navLink} ${isActive ? styles.active : ""}`}>
              <item.icon className={styles.icon} />
              <span className={styles.navText}>{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}