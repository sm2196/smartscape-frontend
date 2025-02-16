"use client"

import { useEffect, useRef } from "react"
import EmergencyButtons from "./components/hk-components"
import { Sidebar } from "./components/sidebar-hk"
import styles from "./hk-emergencycontrol.module.css"

export default function EmergencyControl() {
  const videoRefs = useRef([])

  useEffect(() => {
    videoRefs.current.forEach((video) => {
      if (video) {
        video.play().catch((error) => console.error("Error playing video:", error))
      }
    })
  }, [])

  return (
    <>
      <Sidebar />
      <div className={styles.mainContent}>
        <h1 className={styles.emergencyTitle}>Emergency Control Center</h1>

        <div className={styles.cctvGrid}>
          <div className={styles.cctvMain}>
            <div className={styles.feedContainer}>
              <video ref={(el) => (videoRefs.current[0] = el)} className={styles.cctvFeed} muted loop playsInline>
                <source src="/videos/video1.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className={styles.timestamp}>Camera 1 - Main Entrance</div>
            </div>
          </div>

          <div className={styles.cctvSecondary}>
            <div className={styles.cctvFeedContainer}>
              <div className={styles.feedContainer}>
                <video ref={(el) => (videoRefs.current[1] = el)} className={styles.cctvFeed} muted loop playsInline>
                  <source src="/videos/video2.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <div className={styles.timestamp}>Camera 2 - Corridor</div>
              </div>
            </div>

            <div className={styles.cctvFeedContainer}>
              <div className={styles.feedContainer}>
                <video ref={(el) => (videoRefs.current[2] = el)} className={styles.cctvFeed} muted loop playsInline>
                  <source src="/videos/video3.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <div className={styles.timestamp}>Camera 3 - Parking</div>
              </div>
            </div>
          </div>
        </div>

        <EmergencyButtons />
      </div>
    </>
  )
}








