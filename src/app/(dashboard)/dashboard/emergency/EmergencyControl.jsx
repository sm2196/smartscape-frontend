"use client"

import { useEffect, useRef } from "react"
import { MdShield, MdFullscreen, MdZoomIn } from "react-icons/md"
import EmergencyButtons from "./EmergencyButtons"
import styles from "./EmergencyControl.module.css"

export default function EmergencyControl() {
  const videoRefs = useRef([])

  useEffect(() => {
    // Play all videos
    videoRefs.current.forEach((video) => {
      if (video) {
        video.play().catch((error) => console.error("Error playing video:", error))
      }
    })
  }, [])

  return (
    <div className={styles.pageContainer}>
      <div className={styles.mainContent}>
        <div className={styles.header}>
          <div className={styles.titleContainer}>
            <MdShield className={styles.titleIcon} />
            <h1 className={styles.emergencyTitle}>Emergency Control Center</h1>
          </div>
        </div>

        <div className={styles.cameraSection}>
          <div className={styles.cameraGrid}>
            {/* Main camera - full width */}
            <div className={`${styles.cameraCard} ${styles.mainCamera}`}>
              <div className={styles.cameraHeader}>
                <span className={styles.cameraLabel}>Camera 1 - Main Entrance</span>
                <span className={styles.liveIndicator}>● LIVE</span>
              </div>
              <div className={styles.cameraFeed}>
                <video ref={(el) => (videoRefs.current[0] = el)} className={styles.videoElement} muted loop playsInline>
                  <source src="/videos/video1.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <button className={styles.fullscreenButton} aria-label="Fullscreen">
                  <MdFullscreen />
                </button>
              </div>
            </div>

            {/* Secondary cameras - side by side */}
            <div className={styles.secondaryCameras}>
              <div className={styles.cameraCard}>
                <div className={styles.cameraHeader}>
                  <span className={styles.cameraLabel}>Camera 2 - Parking</span>
                  <span className={styles.liveIndicator}>● LIVE</span>
                </div>
                <div className={styles.cameraFeed}>
                  <video
                    ref={(el) => (videoRefs.current[1] = el)}
                    className={styles.videoElement}
                    muted
                    loop
                    playsInline
                  >
                    <source src="/videos/video2.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <button className={styles.zoomButton} aria-label="Zoom">
                    <MdZoomIn />
                  </button>
                </div>
              </div>

              <div className={styles.cameraCard}>
                <div className={styles.cameraHeader}>
                  <span className={styles.cameraLabel}>Camera 3 - Living Room</span>
                  <span className={styles.liveIndicator}>● LIVE</span>
                </div>
                <div className={styles.cameraFeed}>
                  <video
                    ref={(el) => (videoRefs.current[2] = el)}
                    className={styles.videoElement}
                    muted
                    loop
                    playsInline
                  >
                    <source src="/videos/video3.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <button className={styles.zoomButton} aria-label="Zoom">
                    <MdZoomIn />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.buttonSection}>
          <EmergencyButtons />
        </div>
      </div>
    </div>
  )
}

