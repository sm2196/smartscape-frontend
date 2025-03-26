"use client"

import { useState, useEffect, useCallback } from "react"
import { MdOutlineSecurity, MdDevices, MdCastConnected, MdInfo } from "react-icons/md"
import { FaSpotify, FaApple, FaWhatsapp, FaInstagram, FaYoutube } from "react-icons/fa"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase/config"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "react-toastify"
import { clearRelatedCollectionsCache, saveRelatedCollectionsToCache } from "@/lib/cacheUtils"
import "./PrivacySecurity.css"

// Define cache constants for consistency
const CACHE_COLLECTIONS = ["Users"]

// Define available security settings
const AVAILABLE_SECURITY_SETTINGS = [
  "enable two-factor authentication",
  "allow data sharing with third-party apps",
  "allow camera",
  "allow calendar",
  "allow microphone",
  "allow location",
  "allow notifications",
]

const PrivacySecurity = () => {
  const { user } = useAuth()
  const userId = user?.uid

  const [thirdPartyAppInfo, setThirdPartyAppInfo] = useState("")
  const [enabledSecurity, setEnabledSecurity] = useState([])
  const [isSavingSecurity, setIsSavingSecurity] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const [devices, setDevices] = useState([
    { id: 1, name: "Spotify", status: "Unlinked", integrated: false, preferences: {} },
    { id: 2, name: "Apple Music", status: "Unlinked", integrated: false, preferences: {} },
    { id: 3, name: "WhatsApp", status: "Unlinked", integrated: false, preferences: {} },
    { id: 4, name: "Instagram", status: "Unlinked", integrated: false, preferences: {} },
    { id: 5, name: "YouTube", status: "Unlinked", integrated: false, preferences: {} },
  ])

  // Fetch user data with caching
  const fetchUserData = useCallback(
    async (skipCache = true) => {
      try {
        if (!userId) return

        setIsLoading(true)

        // Directly fetch from Firestore, bypassing all caches
        const userDocRef = doc(db, "Users", userId)
        const userDocSnap = await getDoc(userDocRef)

        if (userDocSnap.exists()) {
          const freshUserData = userDocSnap.data()
          console.log("Direct from Firestore - enabledSecurity:", freshUserData.enabledSecurity)

          // Set enabled security settings from Firestore
          if (freshUserData.enabledSecurity && Array.isArray(freshUserData.enabledSecurity)) {
            setEnabledSecurity(freshUserData.enabledSecurity)
          } else {
            setEnabledSecurity([])
          }

          // Force clear and update cache
          clearRelatedCollectionsCache(CACHE_COLLECTIONS)
          saveRelatedCollectionsToCache(CACHE_COLLECTIONS, [freshUserData])

          return freshUserData
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
        toast.error("Failed to load user data. Please try again.")
      } finally {
        setIsLoading(false)
      }
    },
    [userId],
  )

  // Initial data load
  useEffect(() => {
    let mounted = true

    const fetchData = async () => {
      // First clear any cached data
      clearRelatedCollectionsCache(CACHE_COLLECTIONS)

      // Directly fetch from Firestore
      const userDocRef = doc(db, "Users", userId)
      try {
        const userDocSnap = await getDoc(userDocRef)

        if (userDocSnap.exists() && mounted) {
          const freshData = userDocSnap.data()
          console.log("Direct Firestore fetch - enabledSecurity:", freshData.enabledSecurity)

          // Set enabled security settings from Firestore
          if (freshData.enabledSecurity && Array.isArray(freshData.enabledSecurity)) {
            setEnabledSecurity(freshData.enabledSecurity)
          } else {
            setEnabledSecurity([])
          }
        }
      } catch (error) {
        console.error("Error in direct Firestore fetch:", error)
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    if (userId) {
      fetchData()
    }

    return () => {
      mounted = false
    }
  }, [userId])

  // Toggle security setting and update Firestore
  const toggleSecurity = async (setting) => {
    try {
      setIsSavingSecurity(true)

      // Update local state first for immediate UI feedback
      let updatedSecurity = [...enabledSecurity]

      if (updatedSecurity.includes(setting)) {
        // Remove setting if it exists
        updatedSecurity = updatedSecurity.filter((p) => p !== setting)
      } else {
        // Add setting if it doesn't exist
        updatedSecurity.push(setting)
      }

      setEnabledSecurity(updatedSecurity)

      // Update Firestore
      const userDocRef = doc(db, "Users", userId)
      await updateDoc(userDocRef, {
        enabledSecurity: updatedSecurity,
      })

      toast.success("Security settings updated successfully")
    } catch (error) {
      console.error("Error updating security settings:", error)
      toast.error("Failed to update security settings")

      // Revert to previous state if there was an error
      fetchUserData(true)
    } finally {
      setIsSavingSecurity(false)
    }
  }

  const getThirdPartyAppIcon = (name) => {
    const iconStyle = { fontSize: "20px", marginRight: "10px" }

    switch (name) {
      case "Spotify":
        return <FaSpotify style={{ ...iconStyle, color: "#1DB954" }} />
      case "Apple Music":
        return <FaApple style={{ ...iconStyle, color: "#000" }} />
      case "WhatsApp":
        return <FaWhatsapp style={{ ...iconStyle, color: "#25D366" }} />
      case "Instagram":
        return <FaInstagram style={{ ...iconStyle, color: "#C13584" }} />
      case "YouTube":
        return <FaYoutube style={{ ...iconStyle, color: "#FF0000" }} />
      default:
        return null
    }
  }

  useEffect(() => {
    const userAgent = navigator.userAgent
    if (/mobile/i.test(userAgent)) {
      setThirdPartyAppInfo("Mobile Device")
    } else if (/tablet/i.test(userAgent)) {
      setThirdPartyAppInfo("Tablet")
    } else if (/iPad|Android/i.test(userAgent)) {
      setThirdPartyAppInfo("Tablet or Touch Device")
    } else {
      setThirdPartyAppInfo("Desktop")
    }

    const linkedThirdPartyApp = JSON.parse(localStorage.getItem("linkedThirdPartyApp")) || []
    setDevices(
      devices.map((app) => {
        if (linkedThirdPartyApp.includes(app.name)) {
          return { ...app, status: "Linked", integrated: true }
        }
        return app
      }),
    )
  }, [])

  const loginLinks = {
    Spotify: "https://accounts.spotify.com/login",
    "Apple Music": "https://music.apple.com/account/login",
    WhatsApp: "https://web.whatsapp.com/",
    Instagram: "https://www.instagram.com/accounts/login/",
    YouTube: "https://accounts.google.com/ServiceLogin?service=youtube",
  }

  useEffect(() => {
    const integratingApp = sessionStorage.getItem("integratingApp")
    if (integratingApp) {
      const linkedThirdPartyApp = JSON.parse(localStorage.getItem("linkedThirdPartyApp")) || []
      if (!linkedThirdPartyApp.includes(integratingApp)) {
        linkedThirdPartyApp.push(integratingApp)
        localStorage.setItem("linkedThirdPartyApp", JSON.stringify(linkedThirdPartyApp))
      }

      setDevices((prevDevices) =>
        prevDevices.map((app) => (app.name === integratingApp ? { ...app, status: "Linked", integrated: true } : app)),
      )
      sessionStorage.removeItem("integratingApp")
    }
  }, [])

  // Handle app linking/unlinking
  const handleAppClick = (id) => {
    const app = devices.find((app) => app.id === id)

    if (app.integrated) {
      // If already integrated, unlink it
      let linkedThirdPartyApp = JSON.parse(localStorage.getItem("linkedThirdPartyApp")) || []
      linkedThirdPartyApp = linkedThirdPartyApp.filter((name) => name !== app.name)
      localStorage.setItem("linkedThirdPartyApp", JSON.stringify(linkedThirdPartyApp))

      setDevices((prevDevices) =>
        prevDevices.map((d) => (d.id === id ? { ...d, integrated: false, status: "Unlinked" } : d)),
      )

      toast.success(`${app.name} has been unlinked`)
    } else {
      // If not integrated, link it
      const appLoginURL = loginLinks[app.name]
      setDevices((prevDevices) => prevDevices.map((d) => (d.id === id ? { ...d, status: "Integrating..." } : d)))
      sessionStorage.setItem("integratingApp", app.name)
      window.location.href = appLoginURL
    }
  }

  // Helper function to check if a security setting is enabled
  const isSecurityEnabled = (setting) => {
    return enabledSecurity.includes(setting)
  }

  // Check if data sharing is enabled
  const isDataSharingEnabled = isSecurityEnabled("allow data sharing with third-party apps")

  if (isLoading) {
    return (
      <div className="privacyContainer">
        <div className="loading-container">
          <div className="loadingSpinner"></div>
          <p className="loadingText">Loading security settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="privacyContainer">
      <h2 className="title">Privacy and Security</h2>
      <p className="subtitle">
        Manage your information, privacy and security to make SmartScape work better for you.
        <a href="#" className="link">
          Learn More
        </a>
      </p>

      <div className="privacy-grid">
        {/* Browser Logins - Compact Version */}
        <div className="card browser-logins">
          <div className="cardheader">
            <MdDevices className="icon" style={{ color: "#2563eb" }} />
            <h3>Browser logins</h3>
          </div>
          <div className="browser-session">
            <div className="session-info">
              <p className="session-device">1 session on {thirdPartyAppInfo}</p>
              <p className="session-location">Dubai, United Arab Emirates</p>
            </div>
            <button className="session-info-btn">
              <MdInfo />
            </button>
          </div>
        </div>

        {/* Third-party Integrations - Redesigned without scrollbar */}
        <div className={`card integrations ${!isDataSharingEnabled ? "disabled-card" : ""}`}>
          <div className="cardheader">
            <MdCastConnected className="icon" style={{ color: "#2563eb" }} />
            <h3>Your third-party integrations</h3>
          </div>

          {!isDataSharingEnabled && (
            <div className="disabled-overlay">
              <div className="disabled-message">
                Enable "Allow data sharing with third-party apps" in Security settings to manage integrations
              </div>
            </div>
          )}

          <div className="integration-list">
            {devices.map((app) => (
              <div key={app.id} className="integration-item">
                <div className="integration-app">
                  {getThirdPartyAppIcon(app.name)}
                  {app.name}
                </div>
                <button
                  className={`integration-button ${app.integrated ? "unlinked" : "linked"}`}
                  onClick={() => handleAppClick(app.id)}
                >
                  {app.integrated ? "Unlink" : "Link"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Security Section */}
        <div className="card security">
          <div className="cardheader">
            <MdOutlineSecurity className="icon" style={{ color: "#0f172a" }} />
            <h3>Security</h3>
          </div>

          <div className="security-settings">
            <div className="setting">
              <label>Enable Two-Factor Authentication (2FA)</label>
              <input
                type="checkbox"
                className="toggles"
                checked={isSecurityEnabled("enable two-factor authentication")}
                onChange={() => toggleSecurity("enable two-factor authentication")}
                disabled={isSavingSecurity}
              />
            </div>

            <div className="setting">
              <label>Allow data sharing with third-party apps</label>
              <input
                type="checkbox"
                className="toggles"
                checked={isDataSharingEnabled}
                onChange={() => toggleSecurity("allow data sharing with third-party apps")}
                disabled={isSavingSecurity}
              />
            </div>

            <h4 className="permissions-title">Web App Permissions</h4>

            <div className="permissions-grid">
              <div className="setting">
                <label>Allow Camera</label>
                <input
                  type="checkbox"
                  className="toggles"
                  checked={isSecurityEnabled("allow camera")}
                  onChange={() => toggleSecurity("allow camera")}
                  disabled={isSavingSecurity}
                />
              </div>

              <div className="setting">
                <label>Allow Calendar</label>
                <input
                  type="checkbox"
                  className="toggles"
                  checked={isSecurityEnabled("allow calendar")}
                  onChange={() => toggleSecurity("allow calendar")}
                  disabled={isSavingSecurity}
                />
              </div>

              <div className="setting">
                <label>Allow Microphone</label>
                <input
                  type="checkbox"
                  className="toggles"
                  checked={isSecurityEnabled("allow microphone")}
                  onChange={() => toggleSecurity("allow microphone")}
                  disabled={isSavingSecurity}
                />
              </div>

              <div className="setting">
                <label>Allow Location</label>
                <input
                  type="checkbox"
                  className="toggles"
                  checked={isSecurityEnabled("allow location")}
                  onChange={() => toggleSecurity("allow location")}
                  disabled={isSavingSecurity}
                />
              </div>

              <div className="setting">
                <label>Allow Notifications</label>
                <input
                  type="checkbox"
                  className="toggles"
                  checked={isSecurityEnabled("allow notifications")}
                  onChange={() => toggleSecurity("allow notifications")}
                  disabled={isSavingSecurity}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacySecurity

