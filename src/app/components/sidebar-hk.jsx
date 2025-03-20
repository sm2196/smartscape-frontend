"use client"

import { MdHome, MdInsertChart, MdLocalPolice, MdOutlineDevicesOther, MdSettings, MdChat } from "react-icons/md"
import Link from "next/link"
import { usePathname } from "next/navigation"
import styles from "./sidebar-hk.module.css"

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
  const minutes = currentTime.getMinutes().toString().padStart(2, "0")
  const ampm = currentTime.getHours() >= 12 ? "pm" : "am"
  const timeString = `${hours}:${minutes} ${ampm}`
  const dateString = currentTime.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  })

  return (
    <div className={styles.hksidebar}>
      <div className={styles.hktimeDisplay}>
        <div className={styles.hkcurrentTime}>{timeString}</div>
        <div className={styles.hkcurrentDate}>{dateString}</div>
      </div>
      <nav className={styles.hknavMenu}>
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.name} href={item.href} className={`${styles.hknavLink} ${isActive ? styles.hkactive : ""}`}>
              <item.icon className={styles.hknavIcon} />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}





