"use client"

import { useEffect, useRef, useState  } from "react"
import EmergencyButtons from "./EmergencyButtons"
import styles from "./EmergencyControl.module.css"

export default function EmergencyControl() {
  const videoRefs = useRef([])
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeCamera, setActiveCamera] = useState(0)
  const [isLockdown, setIsLockdown] = useState(false)

  useEffect(() => {
    // Play all videos
    videoRefs.current.forEach((video) => {
      if (video) {
        video.play().catch((error) => console.error("Error playing video:", error))
      }
    })

    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleCameraSelect = (index) => {
    setActiveCamera(index)
  }

  const handleLockdownChange = (lockdownActive) => {
    setIsLockdown(lockdownActive)
  }

  return (
    <div className={styles.pageContainer}>
      {/* Lockdown banner - shown when lockdown is active */}
      {isLockdown && <div className={styles.lockdownBanner}>EMERGENCY LOCKDOWN ACTIVE</div>}

      {/* Main Content */}
      <main className={`${styles.mainContent} ${isLockdown ? styles.lockdownActive : ""}`}>
        <div className={styles.header}>
          <h1 className={styles.emergencyTitle}>Emergency Control Center</h1>
        </div>

        {/* Emergency Buttons - Now placed above the videos */}
        <div className={styles.emergencyControlPanel}>
          <div className={styles.panelHeader}>
            <div className={styles.panelTitle}>Emergency Controls</div>
            <div className={styles.panelStatus}>
              Status:{" "}
              <span className={isLockdown ? styles.statusAlert : styles.statusNormal}>
                {isLockdown ? "LOCKDOWN ACTIVE" : "Normal"}
              </span>
            </div>
          </div>
          <EmergencyButtons onLockdownChange={handleLockdownChange} isLockdown={isLockdown} />
        </div>

        {/* CCTV Container - Now below the buttons */}
        <div className={styles.cctvContainer}>
          <div className={styles.sectionTitle}>Security Camera Feeds</div>
          <div className={styles.cctvGrid}>
            <div className={styles.cctvMain}>
              <div className={styles.feedContainer}>
                <video ref={(el) => (videoRefs.current[0] = el)} className={styles.cctvFeed} muted loop playsInline>
                  <source src="/emergency/video1.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <div className={styles.cameraLabel}>Camera 1 - Main Entrance</div>
              </div>
            </div>

            <div className={styles.cctvSecondary}>
              <div
                className={`${styles.cctvFeedContainer} ${activeCamera === 1 ? styles.activeFeed : ""}`}
                onClick={() => handleCameraSelect(1)}
              >
                <div className={styles.feedContainer}>
                  <video ref={(el) => (videoRefs.current[1] = el)} className={styles.cctvFeed} muted loop playsInline>
                    <source src="/emergency/video2.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <div className={styles.cameraLabel}>Camera 2 - Parking</div>
                </div>
              </div>

              <div
                className={`${styles.cctvFeedContainer} ${activeCamera === 2 ? styles.activeFeed : ""}`}
                onClick={() => handleCameraSelect(2)}
              >
                <div className={styles.feedContainer}>
                  <video ref={(el) => (videoRefs.current[2] = el)} className={styles.cctvFeed} muted loop playsInline>
                    <source src="/emergency/video3.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <div className={styles.cameraLabel}>Camera 3 - Living Room</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}






























