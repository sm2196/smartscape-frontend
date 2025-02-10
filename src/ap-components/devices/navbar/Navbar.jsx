"use client"

import { useState, useEffect } from "react"
import {
  MdPerson,
  MdSecurity,
  MdSettings,
  MdNotifications,
  MdDevices,
  MdArrowBackIosNew,
  MdMenu,
  MdClose,
} from "react-icons/md"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { WeatherWidget } from "./Weather"
import styles from "./Navbar.module.css"

const navigation = [
  { name: "Profiles", href: "#", icon: MdPerson },
  { name: "Privacy & Security", href: "#", icon: MdSecurity },
  { name: "Admin Settings", href: "#", icon: MdSettings },
  { name: "Notifications", href: "#", icon: MdNotifications },
  { name: "Rooms & Devices", href: "#", icon: MdDevices },
  { name: "Dashboard", href: "#", icon: MdArrowBackIosNew },
]

export default function Navbar() {
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

  const timeString = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} ${ampm}`

  const dateString = time.toLocaleDateString("en-AE", {
    weekday: "long",
    day: "numeric",
    month: "short",
  })

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <div className={`${styles.navbar} ${isMenuOpen ? styles.menuOpen : ""}`}>
      <div className={styles.mobileHeader}>
        <div className={styles.timeDisplay}>
          <div className={styles.currentTime}>{timeString}</div>
          <div className={styles.currentDate}>{dateString}</div>
        </div>
        <button className={styles.menuToggle} onClick={toggleMenu}>
          {isMenuOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
        </button>
      </div>
      <nav className={`${styles.navMenu} ${isMenuOpen ? styles.show : ""}`}>
        {navigation.map((item) => {
          const isActive = pathname === item.href
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
      <div className={styles.weatherContainer}>
        <WeatherWidget />
      </div>
    </div>
  )
}
