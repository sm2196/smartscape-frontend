import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaRegBookmark, FaRegUser, FaTimes } from 'react-icons/fa';
import { IoSettingsOutline } from 'react-icons/io5';
import { MdLogout } from 'react-icons/md';
import './SMNavIcons.css';

function SMIcons() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isBookmarkOpen, setIsBookmarkOpen] = useState(false);
  const dropdownRef = useRef(null);
  const bookmarkRef = useRef(null);

  // Sample bookmarks data
  const bookmarks = [
    { id: 1, title: 'Home Renovation Tips', url: '/blog/home-renovation' },
    { id: 2, title: 'Garden Design Ideas', url: '/blog/garden-design' },
    { id: 3, title: 'Interior Decoration', url: '/blog/interior' },
    { id: 4, title: 'Smart Home Solutions', url: '/blog/smart-home' },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (bookmarkRef.current && !bookmarkRef.current.contains(event.target)) {
        setIsBookmarkOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="SMicons-wrapper">
      <div className="SMicons-container">
        {/* Bookmark Icon and Dropdown */}
        <div className="SMbookmark-container" ref={bookmarkRef}>
          <div
            className={`SMicon-item ${isBookmarkOpen ? 'active' : ''}`}
            onClick={() => setIsBookmarkOpen(!isBookmarkOpen)}
          >
            <FaRegBookmark className="SMicon" />
            <span className="SMicon-tooltip">Bookmarks</span>
          </div>

          {isBookmarkOpen && (
            <div className="SMbookmark-dropdown">
              <div className="SMbookmark-header">
                <h3>Your Bookmarks</h3>
                <button className="SMmanage-bookmarks">
                  Manage
                </button>
              </div>
              <div className="SMbookmark-list">
                {bookmarks.length > 0 ? (
                  bookmarks.map(bookmark => (
                    <Link
                      key={bookmark.id}
                      to={bookmark.url}
                      className="SMbookmark-item"
                    >
                      <FaRegBookmark className="SMbookmark-icon" />
                      <span>{bookmark.title}</span>
                    </Link>
                  ))
                ) : (
                  <div className="SMno-bookmarks">
                    <FaRegBookmark className="SMno-bookmarks-icon" />
                    <p>No bookmarks yet</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Icon and Dropdown */}
        <div className="SMprofile-container" ref={dropdownRef}>
          <div
            className={`SMicon-item ${isProfileOpen ? 'active' : ''}`}
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            <FaRegUser className="SMicon" />
            <span className="SMicon-tooltip">Profile</span>
          </div>

          {isProfileOpen && (
            <div className="SMprofile-dropdown">
              <div className="SMprofile-menu">
                <Link to="/login" className="SMdropdown-item">
                  <FaRegUser className="SMdropdown-icon" />
                  <span>Login</span>
                </Link>
                <Link to="/signup" className="SMdropdown-item">
                  <IoSettingsOutline className="SMdropdown-icon" />
                  <span>Sign Up</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SMIcons;