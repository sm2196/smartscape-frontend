import React, { useState, useRef, useEffect } from 'react';
import Link  from 'next/link';
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
    { id: 1, title: 'Energy saving tips', url: 'https://www.greenmatch.co.uk/blog/2020/03/how-to-save-energy-at-home' },
    { id: 2, title: 'What is a smarthome?', url: 'https://www.investopedia.com/terms/s/smart-home.asp' },
    { id: 3, title: 'Save money on energy', url: 'https://www.hsbc.ae/sustainability/how-to-save-money-on-energy/' },
    { id: 4, title: 'Best Smart home devices in 2025', url: 'https://www.pcmag.com/picks/the-best-smart-home-devices' },
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
                      href={bookmark.url}
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
                <Link href="/auth" className="SMdropdown-item">
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