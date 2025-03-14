"use client"

import { useState, useEffect } from "react"
import { MdErrorOutline, MdOutlineSecurity, MdDevices, MdCastConnected } from "react-icons/md"
import { FaSpotify, FaApple, FaWhatsapp, FaInstagram, FaYoutube } from "react-icons/fa"
import "./PrivacySecurity.css"

const PrivacySecurity = () => {
  const [isLockDownEnabled, setisLockDownEnabled] = useState(false)
  const [thirdPartyAppInfo, setThirdPartyAppInfo] = useState("")
  const [isThirdPartyOpen, setIsThirdPartyOpen] = useState(false)
  const [is2FAEnabled, setIs2FAEnabled] = useState(false)
  const [permissions, setPermissions] = useState({
    camera: false,
    calendar: false,
    microphone: false,
    location: false,
    notifications: false,
  })
  const [devices, setDevices] = useState([
    { id: 1, name: "Spotify", status: "Unlinked", integrated: false, preferences: {} },
    { id: 2, name: "Apple Music", status: "Unlinked", integrated: false, preferences: {} },
    { id: 3, name: "WhatsApp", status: "Unlinked", integrated: false, preferences: {} },
    { id: 4, name: "Instagram", status: "Unlinked", integrated: false, preferences: {} },
    { id: 5, name: "YouTube", status: "Unlinked", integrated: false, preferences: {} },
  ])

  const getThirdPartyAppIcon = (name) => {
    const iconStyle = { fontSize: "20px", marginRight: "10px" } // Increased size

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

  const handleLockdownClick = () => {
    setisLockDownEnabled(true)
  }

  const handleCloseModal = () => {
    setisLockDownEnabled(false)
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

  const handleAppClick = (id) => {
    const app = devices.find((app) => app.id === id)
    const appLoginURL = loginLinks[app.name]

    setDevices((prevDevices) => prevDevices.map((d) => (d.id === id ? { ...d, status: "Integrating..." } : d)))

    sessionStorage.setItem("integratingApp", app.name)

    window.location.href = appLoginURL
  }

  const handleUnintegrate = (id) => {
    const app = devices.find((app) => app.id === id)

    let linkedThirdPartyApp = JSON.parse(localStorage.getItem("linkedThirdPartyApp")) || []
    linkedThirdPartyApp = linkedThirdPartyApp.filter((name) => name !== app.name)
    localStorage.setItem("linkedThirdPartyApp", JSON.stringify(linkedThirdPartyApp))

    setDevices((prevDevices) =>
      prevDevices.map((d) => (d.id === id ? { ...d, integrated: false, status: "Unlinked" } : d)),
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

      {/* Cards Section - Redesigned without General settings */}
      <div className="grid-container">
        {/* First Row */}
        <div className="card alert">
          <div className="cardheader">
            <MdErrorOutline className="icon" style={{ color: "#dc2626" }} />
            <h3>Alerts</h3>
          </div>
          <div className="alert-item">
            <p>Main door opened for more than 30 seconds</p>
            <input type="checkbox" className="toggles" />
          </div>
          <div className="alert-item">
            <p>Break-in detected</p>
            <input type="checkbox" className="toggles" />
          </div>
          <button className="alert-btn" onClick={handleLockdownClick}>
            Lockdown
          </button>
        </div>

        <div className="card logins">
          <div className="cardheader">
            <MdDevices className="icon" style={{ color: "#2563eb" }} />
            <h3>Browser logins</h3>
          </div>{" "}
          <div className="alert-item">
            <p>1 session on {thirdPartyAppInfo}</p>{" "}
          </div>
          <div className="alert-itemSub">
            <p>Dubai, United Arab Emirates</p>
          </div>
        </div>

        {/* Second Row */}
        <div className="card security">
          <div className="cardheader">
            <MdOutlineSecurity className="icon" style={{ color: "#0f172a" }} />
            <h3>Security</h3>
          </div>

          <div className="setting">
            <label>Enable Two-Factor Authentication (2FA)</label>
            <input
              type="checkbox"
              className="toggles"
              checked={is2FAEnabled}
              onChange={() => setIs2FAEnabled(!is2FAEnabled)}
            />
          </div>
          <div className="setting" style={{ marginTop: "15px" }}>
            <label>Allow data sharing with third-party apps</label>
            <input type="checkbox" className="toggles" />
          </div>

          <h4 style={{ marginTop: "2rem" }}>Web App Permissions</h4>
          {Object.keys(permissions).map((perm) => (
            <div key={perm} className="setting">
              <label>Allow {perm.charAt(0).toUpperCase() + perm.slice(1)}</label>
              <input
                type="checkbox"
                className="toggles"
                style={{ marginTop: "2px" }}
                checked={permissions[perm]}
                onChange={() => setPermissions({ ...permissions, [perm]: !permissions[perm] })}
              />
            </div>
          ))}
        </div>

        <div className="card apps">
          <div className="cardheader">
            <MdCastConnected className="icon" style={{ color: "#2563eb" }} />
            <h3>Your third-party integrations</h3>
          </div>

          {/* Scrollable app List */}
          <div className="app-list">
            {devices.map((app) => (
              <div key={app.id} className="app-card" onClick={() => !app.integrated && handleAppClick(app.id)}>
                <div className="app-name">
                  {getThirdPartyAppIcon(app.name)}
                  {app.name}
                </div>
                {app.integrated ? (
                  <p className="integrated-status">Linked</p>
                ) : (
                  <p className="integrated-status">Link {app.name}</p>
                )}
              </div>
            ))}
          </div>

          <button className="manage-btn" onClick={() => setIsThirdPartyOpen(true)}>
            Manage Linked Apps
          </button>
        </div>
      </div>

      {/* View All Modal */}
      {isThirdPartyOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="close-btn" onClick={() => setIsThirdPartyOpen(false)}>
              ✖
            </button>
            <h3>Your third-party integrations</h3>
            {devices.map((app) => (
              <div key={app.id} className="list-app">
                <div>
                  <p className="app-name">{app.name}</p>
                  {app.integrated}
                </div>
                {app.integrated ? (
                  <button className="unlink-btn" onClick={() => handleUnintegrate(app.id)}>
                    Unlink
                  </button>
                ) : (
                  <button className="link-btn" onClick={() => handleAppClick(app.id)}>
                    Link
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lockdown Modal  */}
      {isLockDownEnabled && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="close-btn" onClick={handleCloseModal}>
              ✖
            </button>
            <h3>Confirm Action</h3>
            <p>Do you also want to contact the authorities?</p>
            <div className="modal-buttons">
              <button className="confirm-btn">Lockdown Only</button>
              <button className="cancel-btn">Contact Authorities</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PrivacySecurity

