"use client"

import { useEffect, useRef, useState } from "react"
import EmergencyButtons from "./components/hk-components"
import { Sidebar } from "./components/sidebar-hk"
import styles from "./hk-emergencycontrol.module.css"

export default function EmergencyControl() {
  const videoRefs = useRef([])
  const [currentTime, setCurrentTime] = useState(new Date())
  const [activeCamera, setActiveCamera] = useState(0)

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

  return (
    <div className={styles.hkpageContainer}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className={styles.hkmainContent}>
        <div className={styles.hkheader}>
          <h1 className={styles.hkemergencyTitle}>Emergency Control Center</h1>
        </div>

        <div className={styles.hkcctvContainer}>
          <div className={styles.hkcctvGrid}>
            <div className={styles.hkcctvMain}>
              <div className={styles.hkfeedContainer}>
                <video ref={(el) => (videoRefs.current[0] = el)} className={styles.hkcctvFeed} muted loop playsInline>
                  <source src="/videos/video1.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <div className={styles.hkcameraLabel}>Camera 1 - Main Entrance</div>
              </div>
            </div>

            <div className={styles.hkcctvSecondary}>
              <div
                className={`${styles.hkcctvFeedContainer} ${activeCamera === 1 ? styles.activeFeed : ""}`}
                onClick={() => handleCameraSelect(1)}
              >
                <div className={styles.hkfeedContainer}>
                  <video ref={(el) => (videoRefs.current[1] = el)} className={styles.hkcctvFeed} muted loop playsInline>
                    <source src="/videos/video2.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <div className={styles.hkcameraLabel}>Camera 2 - Parking</div>
                </div>
              </div>

              <div
                className={`${styles.hkcctvFeedContainer} ${activeCamera === 2 ? styles.hkactiveFeed : ""}`}
                onClick={() => handleCameraSelect(2)}
              >
                <div className={styles.hkfeedContainer}>
                  <video ref={(el) => (videoRefs.current[2] = el)} className={styles.hkcctvFeed} muted loop playsInline>
                    <source src="/videos/video3.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <div className={styles.hkcameraLabel}>Camera 3 - Living Room</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.hkbuttonSection}>
          <EmergencyButtons />
        </div>
      </main>
    </div>
  )
}



























