"use client"

import { useState, useEffect } from "react"
import { MdShield, MdLock, MdRemoveRedEye } from "react-icons/md"
import styles from "./InfoPanel-as.module.css"

export default function InfoPanel() {
  const [isMobile, setIsMobile] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    section1: true,
    section2: true,
    section3: true,
  })

  const sections = [
    {
      id: "section1",
      icon: MdShield,
      iconColor: "#9BBEC7",
      title: "Why isn't my info shown here?",
      content: "We're hiding some account details to protect your identity.",
    },
    {
      id: "section2",
      icon: MdLock,
      iconColor: "#E2C391",
      title: "Which details can be edited?",
      content:
        "Identity verification details can't be changed. You can edit contact info and personal details but may need to verify your identity again.",
    },
    {
      id: "section3",
      icon: MdRemoveRedEye,
      iconColor: "#A8B7AB",
      title: "What info is shared with others?",
      content: "Your usage of SmartScape, feedback, and savings percentage may be shared with others.",
    },
  ]

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 480)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }))
  }

  return (
    <aside className={styles.infoPanel}>
      <div className={styles.card}>
        {sections.map(({ id, icon: Icon, iconColor, title, content }) => (
          <div key={id} className={styles.section}>
            <button className={styles.toggleButton} onClick={() => toggleSection(id)}>
              <Icon size={isMobile ? 24 : 58} color={iconColor} />
              <h2>{title}</h2>
            </button>
            <p className={`${styles.paragraph} ${expandedSections[id] ? styles.expanded : ""}`}>{content}</p>
          </div>
        ))}
      </div>
    </aside>
  )
}

