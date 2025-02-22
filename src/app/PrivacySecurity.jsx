import React, { useState, useEffect } from "react";
import { CiCircleAlert } from "react-icons/ci";
import { MdOutlineSecurity, MdDevices, MdCastConnected, MdKeyboardArrowRight } from "react-icons/md";
import { FaSpotify, FaApple, FaWhatsapp, FaInstagram, FaYoutube } from "react-icons/fa";
import { RiSettingsLine } from "react-icons/ri";

const PrivacySecurity = () => {
  const [isLockDownEnabled, setisLockDownEnabled] = useState(false);
  const [thirdPartyAppInfo, setThirdPartyAppInfo] = useState("");
  const [isThirdPartyOpen, setIsThirdPartyOpen] = useState(false);
  const [isFamilyListOpen, setIsFamilyListOpen] = useState(false);
  const [isDevicesListOpen, setIsDevicesListOpen] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [permissions, setPermissions] = useState({
    camera: false,
    calendar: false,
    microphone: false,
    location: false,
    notifications: false,
  });
  const [devices, setDevices] = useState([
    { id: 1, name: "Spotify", status: "Unlinked", integrated: false, preferences: {} },
    { id: 2, name: "Apple Music", status: "Unlinked", integrated: false, preferences: {} },
    { id: 3, name: "WhatsApp", status: "Unlinked", integrated: false, preferences: {} },
    { id: 4, name: "Instagram", status: "Unlinked", integrated: false, preferences: {} },
    { id: 5, name: "YouTube", status: "Unlinked", integrated: false, preferences: {} }
  ]);

  const getThirdPartyAppIcon = (name) => {
    const iconStyle = { fontSize: "20px", marginRight: "10px" }; // Increased size

    switch (name) {
      case "Spotify":
        return <FaSpotify style={{ ...iconStyle, color: "#1DB954" }} />;
      case "Apple Music":
        return <FaApple style={{ ...iconStyle, color: "#000" }} />;
      case "WhatsApp":
        return <FaWhatsapp style={{ ...iconStyle, color: "#25D366" }} />;
      case "Instagram":
        return <FaInstagram style={{ ...iconStyle, color: "#C13584" }} />;
      case "YouTube":
        return <FaYoutube style={{ ...iconStyle, color: "#FF0000" }} />;
      default:
        return null;
    }
  };


  const handleLockdownClick = () => {
    setisLockDownEnabled(true);
  };

  const handleCloseModal = () => {
    setisLockDownEnabled(false);
  };

  useEffect(() => {
    const userAgent = navigator.userAgent;
    if (/mobile/i.test(userAgent)) {
      setThirdPartyAppInfo("Mobile Device");
    } else if (/tablet/i.test(userAgent)) {
      setThirdPartyAppInfo("Tablet");
    } else if (/iPad|Android/i.test(userAgent)) {
      setThirdPartyAppInfo("Tablet or Touch Device");
    } else {
      setThirdPartyAppInfo("Desktop");
    }

    const linkedThirdPartyApp = JSON.parse(localStorage.getItem("linkedThirdPartyApp")) || [];
    setDevices(devices.map(app => {
      if (linkedThirdPartyApp.includes(app.name)) {
        return { ...app, status: "Linked", integrated: true };
      }
      return app;
    }));
  }, []);

  const loginLinks = {
    Spotify: "https://accounts.spotify.com/login",
    "Apple Music": "https://music.apple.com/account/login",
    WhatsApp: "https://web.whatsapp.com/",
    Instagram: "https://www.instagram.com/accounts/login/",
    YouTube: "https://accounts.google.com/ServiceLogin?service=youtube",
  };


  useEffect(() => {
    const integratingApp = sessionStorage.getItem("integratingApp");
    if (integratingApp) {
      let linkedThirdPartyApp = JSON.parse(localStorage.getItem("linkedThirdPartyApp")) || [];
      if (!linkedThirdPartyApp.includes(integratingApp)) {
        linkedThirdPartyApp.push(integratingApp);
        localStorage.setItem("linkedThirdPartyApp", JSON.stringify(linkedThirdPartyApp));
      }

      setDevices((prevDevices) =>
        prevDevices.map((app) =>
          app.name === integratingApp
            ? { ...app, status: "Linked", integrated: true }
            : app
        )
      );
      sessionStorage.removeItem("integratingApp");
    }
  }, []);


  const handleAppClick = (id) => {
    const app = devices.find((app) => app.id === id);
    const appLoginURL = loginLinks[app.name];

    setDevices((prevDevices) =>
      prevDevices.map((d) =>
        d.id === id ? { ...d, status: "Integrating..." } : d
      )
    );

    sessionStorage.setItem("integratingApp", app.name);

    window.location.href = appLoginURL;
  };


  const handleUnintegrate = (id) => {
    const app = devices.find((app) => app.id === id);

    let linkedThirdPartyApp = JSON.parse(localStorage.getItem("linkedThirdPartyApp")) || [];
    linkedThirdPartyApp = linkedThirdPartyApp.filter((name) => name !== app.name);
    localStorage.setItem("linkedThirdPartyApp", JSON.stringify(linkedThirdPartyApp));

    setDevices((prevDevices) =>
      prevDevices.map((d) =>
        d.id === id ? { ...d, integrated: false, status: "Unlinked" } : d
      )
    );
  };


  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);

  const handlePasswordChange = () => {
    setShowPasswordModal(true);
  };

  const handlePhoneChange = () => {
    setShowPhoneModal(true);
  };

  const handleEmailChange = () => {
    setShowEmailModal(true);
  };


  return (
    <div className="RScontainer">
      <h2 className="title">Privacy and Security</h2>
      <p className="subtitle">Manage your information, privacy and security to make SmartScape work better for you.  <a href="#" className="link">Learn More</a></p>

      {/* Cards Section */}
      <div className="grid-container">
        {/* First Row */}
        <div className="card alert">
          <h3 className="cardheader">
            <CiCircleAlert className="icon" style={{ color: "#8c0500" }} />
            Alerts
          </h3>
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
          <h3 className="cardheader">
            <MdDevices className="icon" style={{ color: "#005745" }} />
            Browser logins
          </h3>  <div className="alert-item">
            <p>1 session on {thirdPartyAppInfo}</p> </div>
          <div className="alert-itemSub">
            <p>Dubai, United Arab Emirates</p></div>
        </div>

        {/* Second Row */}
        <div className="card security">
          <h3 className="cardheader">
            <MdOutlineSecurity className="icon" style={{ color: "#152447" }} />
            Security
          </h3>

          <div className="setting">
            <label>Enable Two-Factor Authentication (2FA)</label>
            <input type="checkbox" className="toggles" checked={is2FAEnabled} onChange={() => setIs2FAEnabled(!is2FAEnabled)} />
          </div>
          <div className="setting" style={{ marginTop: "15px" }}>
            <label>Allow data sharing with third-party apps</label>
            <input type="checkbox" className="toggles" />
          </div>

          <h4 style={{ marginTop: "2rem" }}>Web App Permissions</h4>
          {Object.keys(permissions).map((perm) => (
            <div key={perm} className="setting">
              <label>Allow {perm.charAt(0).toUpperCase() + perm.slice(1)}</label>
              <input type="checkbox" className="toggles" style={{ marginTop: "2px" }} checked={permissions[perm]} onChange={() => setPermissions({ ...permissions, [perm]: !permissions[perm] })} />
            </div>
          ))}

        </div>

        <div className="card apps">
          <h3 className="cardheader">
            <MdCastConnected className="icon" />
            Your third-party integrations
          </h3>

          {/* Scrollable app List */}
          <div className="app-list">
            {devices.map((app) => (
              <div
                key={app.id}
                className="app-card"
                onClick={() => !app.integrated && handleAppClick(app.id)}
              >
                <p className="app-name">
                  {getThirdPartyAppIcon(app.name)}
                  {app.integrated ? app.name : `Link ${app.name}`}
                </p>

                {app.integrated && (
                  <p className="integrated-status">Linked</p>
                )}
              </div>
            ))}
          </div>

          <button className="manage-btn" onClick={() => setIsThirdPartyOpen(true)}>
            Manage Linked Apps
          </button>
        </div>

        {/* View All Modal */}
        {isThirdPartyOpen && (
          <div className="modal-overlay">
            <div className="modal">
              <button className="close-btn" onClick={() => setIsThirdPartyOpen(false)}>✖</button>
              <h3>Your third-party integrations</h3>
              {devices.map((app) => (
                <div key={app.id} className="list-app">
                  <div>
                    <p className="app-name">{app.name}</p>
                    {app.integrated}
                  </div>
                  {app.integrated ? (
                    <button className="unlink-btn" onClick={() => handleUnintegrate(app.id)}>Unlink</button>
                  ) : (
                    <button className="link-btn" onClick={() => handleAppClick(app.id)}>Link</button>
                  )}
                </div>
              ))}

            </div>
          </div>
        )}



        {/* Third Row (General Settings) */}
        <div className="general-settings">
          <h3><RiSettingsLine className="icon" />General settings</h3>

          {/* Settings List */}
          <div className="settings-list" style={{ marginTop: "-20px" }}>
            <div className="settin-g" onClick={() => setIsFamilyListOpen(true)}>
              Viewable Family List <MdKeyboardArrowRight />
            </div>

            <div className="settin-g" onClick={() => setIsDevicesListOpen(true)}>
              Viewable Devices List <MdKeyboardArrowRight />
            </div>

            <div className="settin-g" onClick={() => setShowPasswordModal(true)}>
              <div className="setting-content">
                <span>Change Password</span>
                <span className="last-changed">Last Changed: Jan 15, 2024</span>
              </div>
              <MdKeyboardArrowRight />
            </div>


            <div className="settin-g" onClick={() => setShowPhoneModal(true)}>
              Add Recovery Phone Number
              <MdKeyboardArrowRight /> </div>

            <div className="settin-g" onClick={() => setShowEmailModal(true)}>
              Add Recovery Email
              <MdKeyboardArrowRight /> </div>
          </div>



          {isFamilyListOpen && (
            <div className="modal-overlay">
              <div className="modal">
                <button className="close-btn" onClick={() => setIsFamilyListOpen(false)}>✖</button>
                <h3>Family Members Linked to Your Account</h3>

                <ul className="styled-list">
                  <li>
                    <div className="list-item">
                      <span className="name">John Doe</span> <span className="role admin">Admin</span>
                    </div>
                  </li>
                  <hr className="divider" />
                  <li>
                    <div className="list-item">
                      <span className="name">Jane Doe</span> <span className="role member">Member</span>
                    </div>
                  </li>
                  <hr className="divider" />
                  <li>
                    <div className="list-item">
                      <span className="name">Emily Doe</span> <span className="role member">Member</span>
                    </div>
                  </li>

                </ul>
              </div>
            </div>
          )}

          {/* Devices List Modal */}
          {isDevicesListOpen && (
            <div className="modal-overlay">
              <div className="modal">
                <button className="close-btn" onClick={() => setIsDevicesListOpen(false)}>✖</button>
                <h3>Devices Linked to Your Account</h3>

                <ul className="styled-list">
                  <li>
                    <div className="list-item">
                      <span className="device">Smart Lock</span>
                    </div>
                  </li>
                  <hr className="divider" />
                  <li>
                    <div className="list-item">
                      <span className="device">Security Camera</span>
                    </div>
                  </li>
                  <hr className="divider" />
                  <li>
                    <div className="list-item">
                      <span className="device">Smart Thermostat</span>
                    </div>
                  </li>

                </ul>
              </div>
            </div>
          )}

          {/* Modals for Updating Info */}
          {showPasswordModal && (
            <div className="modal-overlay">
              <div className="modal">
                <button className="close-btn" onClick={() => setShowPasswordModal(false)}>✖</button>
                <h3>Change Password</h3>
                <div className="input-group">
                  <input type="password" className="input" required />
                  <label className="user-label">Old Password</label>
                </div>
                <div className="input-group">
                  <input type="password" className="input" required />
                  <label className="user-label">New Password</label>
                </div>

                <button className="manage-btn" style={{ marginTop: "7px", width: "90%" }}>Save Changes</button>
              </div>
            </div>
          )}

          {showPhoneModal && (
            <div className="modal-overlay">
              <div className="modal">
                <button className="close-btn" onClick={() => setShowPhoneModal(false)}>✖</button>
                <h3>Update Recovery Phone Number</h3>
                <div className="input-group">
                  <input type="text" className="input" required />
                  <label className="user-label">Enter Phone Number</label>
                </div>
                <button className="manage-btn" style={{ marginTop: "7px", width: "90%" }}>Save Changes</button>
              </div>
            </div>
          )}

          {showEmailModal && (
            <div className="modal-overlay">
              <div className="modal">
                <button className="close-btn" onClick={() => setShowEmailModal(false)}>✖</button>
                <h3>Update Recovery Email</h3>
                <div className="input-group">
                  <input type="text" className="input" required />
                  <label className="user-label">Enter Email Address</label>
                </div>
                <button className="manage-btn" style={{ marginTop: "7px", width: "90%" }}>Save Changes</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Lockdown Modal  */}
      {isLockDownEnabled && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="close-btn" onClick={handleCloseModal}>✖</button>
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
  );
};

export default PrivacySecurity;
