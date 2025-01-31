import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import { FaBars, FaTimes } from "react-icons/fa";
import SMIcons from "./SMNavIcons";

function SMNavbar() {
  const [SMclick, setSMClick] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setSMClick(!SMclick);
  };

  const closeMobileMenu = () => {
    setSMClick(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector('.SMheader');
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className="SMheader">
        <div className="SMcontainer">
          <nav>
            {/* Logo */}
            <Link to="/" className="SMnavbar-logo" onClick={closeMobileMenu}>
              <img src="/Logo.png" alt="Logo" className="SMnavbar-logo-image" />
            </Link>

            {/* Expandable navigation menu */}
            <ul className={SMclick ? "SMnav-link active" : "SMnav-link"}>
              <li>
                <Link to="/" onClick={closeMobileMenu}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" onClick={closeMobileMenu}>
                  About
                </Link>
              </li>
              <li>
                <Link to="/services" onClick={closeMobileMenu}>
                  Services
                </Link>
              </li>
              <li>
                <Link to="/contact" onClick={closeMobileMenu}>
                  Contact Me
                </Link>
              </li>
              <li>
                <Link to="/faq" onClick={closeMobileMenu}>
                  FAQ
                </Link>
              </li>
            </ul>

            {/* Icons for extra functions */}
            <SMIcons />

            {/* Expandable menu button */}
            <div
              className="SMicon"
              onClick={toggleMenu}
              aria-label={SMclick ? "Close menu" : "Open menu"}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  toggleMenu();
                }
              }}
            >
              {SMclick ? <FaTimes /> : <FaBars />}
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}

export default SMNavbar;