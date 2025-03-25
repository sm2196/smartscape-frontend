"use client"

import { useState, useEffect } from "react"
import {
  MdHome,
  MdInsertChart,
  MdLocalPolice,
  MdOutlineDevicesOther,
  MdSettings,
  MdChat,
  MdMenu,
  MdClose,
} from "react-icons/md"
import Link from "next/link"
import { usePathname } from "next/navigation"
import styles from "./DashboardNavbar.module.css"

const navigation = [
  { name: "Home", href: "#", icon: MdHome },
  { name: "Consumption Analysis", href: "#", icon: MdInsertChart },
  { name: "Emergency Controls", href: "#", icon: MdLocalPolice },
  { name: "Device Controls", href: "#", icon: MdOutlineDevicesOther },
  { name: "Customer Support", href: "#", icon: MdChat },
  { name: "Settings", href: "#", icon: MdSettings }, // Settings is included here
]

export default function DashboardNavbar() {
  const pathname = usePathname()
  const [time, setTime] = useState(new Date())
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const hours = time.getHours() % 12 || 12
  const minutes = time.getMinutes()
  const ampm = time.getHours() >= 12 ? "PM" : "AM"

  const timeString = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`

  const dateString = time.toLocaleDateString("en-AE", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <div className={`${styles.navbar} ${isMenuOpen ? styles.menuOpen : ""}`}>
      <div className={styles.timeDisplay}>
        <div className={styles.currentTime}>{timeString}</div>
        <div className={styles.ampm}>{ampm}</div>
        <div className={styles.currentDate}>{dateString}</div>
      </div>
      <nav className={`${styles.navMenu} ${isMenuOpen ? styles.show : ""}`}>
        {navigation.map((item) => {
          // Only set Consumption Analysis as active
          const isActive = item.name === "Consumption Analysis"

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`${styles.navLink} ${isActive ? styles.active : ""}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <item.icon className={styles.icon} />
              <span className={styles.navText}>{item.name}</span>
            </Link>
          )
        })}
      </nav>
      <button className={styles.menuToggle} onClick={toggleMenu}>
        {isMenuOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
      </button>
    </div>
  )
}

