"use client"

import { MdHome, MdInsertChart, MdLocalPolice, MdOutlineDevicesOther, MdSettings, MdChat } from "react-icons/md"
import Link from "next/link"
import { usePathname } from "next/navigation"
import styles from "./Sidebar.module.css"

const navigation = [
  { name: "Home", href: "/dashboard", icon: MdHome },
  { name: "Consumption Analysis", href: "/dashboard/consumption-analysis", icon: MdInsertChart },
  { name: "Emergency Controls", href: "/dashboard/emergency-controls", icon: MdLocalPolice },
  { name: "Device Controls", href: "/dashboard/device-controls", icon: MdOutlineDevicesOther },
  { name: "Customer Support", href: "/dashboard/customer-support", icon: MdChat },
  { name: "Settings", href: "/dashboard/settings", icon: MdSettings },
]

export function Sidebar() {
  const pathname = usePathname()
  const currentTime = new Date()
  const hours = currentTime.getHours() % 12 || 12 // Convert to 12-hour format
  const minutes = currentTime.getMinutes()
  const ampm = currentTime.getHours() >= 12 ? "pm" : "am"
  const timeString = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")} ${ampm}`
  const dateString = currentTime.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
  })

  return (
    <div className={styles.sidebar}>
      <div className={styles.timeDisplay}>
        <div className={styles.currentTime}>{timeString}</div>
        <div className={styles.currentDate}>{dateString}</div>
      </div>
      <nav className={styles.navMenu}>
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.name} href={item.href} className={`${styles.navLink} ${isActive ? styles.active : ""}`}>
              <item.icon />
              {item.name}
            </Link>
          )
        })}
      </nav>

    </div>
  )
}