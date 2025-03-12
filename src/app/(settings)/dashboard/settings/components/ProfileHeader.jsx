"use client"

import { useState, useRef, useEffect } from "react"
import { MdAccountCircle, MdAddAPhoto } from "react-icons/md"
import styles from "./ProfileHeader.module.css"
import { uploadProfileImage } from "@/lib/firebase/storage"

export default function ProfileHeader({ user, profile, handleSignOut, onProfileUpdate }) {
  const [profileImage, setProfileImage] = useState(profile?.profileImageUrl || null)
  const [isUploading, setIsUploading] = useState(false)
  const [displayName, setDisplayName] = useState("")
  const [displayEmail, setDisplayEmail] = useState("")
  const fileInputRef = useRef(null)

  // Update display values when profile changes
  useEffect(() => {
    if (profile) {
      setDisplayName(`${profile.firstName || ""} ${profile.lastName || ""}`.trim())
      setDisplayEmail(profile.email || "")
    }
  }, [profile])

  const handleProfileImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setIsUploading(true)

    if (user) {
      // Upload to Firebase Storage
      const result = await uploadProfileImage(user.uid, file)
      if (result.success) {
        setProfileImage(result.imageUrl)
        // Notify parent component of the update
        if (onProfileUpdate) {
          onProfileUpdate({ profileImageUrl: result.imageUrl })
        }
      } else {
        console.error("Error uploading image:", result.error)
      }
    } else {
      // Create a FileReader to read the image file (local preview only)
      const reader = new FileReader()
      reader.onload = (event) => {
        setProfileImage(event.target.result)
      }
      reader.onerror = () => {
        console.error("Error reading file")
      }
      reader.readAsDataURL(file)
    }

    setIsUploading(false)
  }

  return (
    <div className={styles.profileBox}>
      <div className={styles.profileHeader}>
        <div className={styles.profileInfo}>
          <div className={styles.profileImageContainer} onClick={handleProfileImageClick}>
            {profileImage ? (
              <img src={profileImage || "/placeholder.svg"} alt="Profile" className={styles.profileImage} />
            ) : (
              <MdAccountCircle className={styles.logo} size={64} aria-hidden="true" />
            )}
            <div className={styles.profileImageOverlay}>
              <MdAddAPhoto size={20} />
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className={styles.fileInput}
            />
            {isUploading && <div className={styles.uploadingIndicator}>Uploading...</div>}
          </div>
          <div className={styles.textContainer}>
            <p className={styles.profileName}>{displayName}</p>
            <p className={styles.profileEmail}>{user?.email || ""}</p>
          </div>
        </div>

        <div>
          <button className={styles.signOutButton} onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}

