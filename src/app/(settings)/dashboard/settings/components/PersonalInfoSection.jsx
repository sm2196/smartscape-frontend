"use client"

import { MdOutlineMode, MdAdd } from "react-icons/md"
import styles from "./PersonalInfoSection.module.css"

export default function PersonalInfoSection({ personalInfo, onEdit }) {
  return (
    <div className={styles.personalInfoSection}>
      <h2 className={styles.personalInfo}>Personal Info</h2>
      <ul className={styles.infoList}>
        {personalInfo.map(({ title, value, action, field }) => (
          <li key={title} className={styles.infoItem}>
            <div className={styles.infoHeader}>
              <div className={styles.infoTitle}>{title}</div>
              {action && (
                <button className={styles.editButton} onClick={() => onEdit(field)}>
                  {action === "Edit" ? <MdOutlineMode size={16} /> : <MdAdd size={16} />}
                  <span>{action}</span>
                </button>
              )}
            </div>
            <div className={styles.infoValue}>{value}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}

