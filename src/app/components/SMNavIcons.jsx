import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaRegBookmark, FaRegUser } from 'react-icons/fa';
import { IoSettingsOutline } from 'react-icons/io5';
import { MdLogout } from 'react-icons/md';
import './SMNavIcons.css';

function SMIcons() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="SMicons-wrapper">
      <div className="SMicons-container">
        <div className="SMicon-item">
          <FaSearch className="SMicon" />
        </div>
        <div className="SMicon-item">
          <FaRegBookmark className="SMicon" />
        </div>
        <div className="SMprofile-container" ref={dropdownRef}>
          <div
            className="SMicon-item"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            <FaRegUser className={`SMicon ${isProfileOpen ? 'active' : ''}`} />
          </div>

          {isProfileOpen && (
            <div className="SMprofile-dropdown">
              <div className="SMprofile-header">
                <div className="SMprofile-info">
                  <img
                    src="/default-avatar.png"
                    alt="Profile"
                    className="SMprofile-avatar"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/40';
                    }}
                  />
                  <div className="SMprofile-details">
                    <h4>User Name</h4>
                    <p>user@example.com</p>
                  </div>
                </div>
              </div>

              <div className="SMprofile-menu">
                <Link to="/profile" className="SMdropdown-item">
                  <FaRegUser className="SMdropdown-icon" />
                  <span>Your Profile</span>
                </Link>
                <Link to="/settings" className="SMdropdown-item">
                  <IoSettingsOutline className="SMdropdown-icon" />
                  <span>Settings</span>
                </Link>
                <div className="SMdropdown-divider"></div>
                <button
                  className="SMdropdown-item SMlogout-btn"
                  onClick={() => console.log('Logout clicked')}
                >
                  <MdLogout className="SMdropdown-icon" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SMIcons;