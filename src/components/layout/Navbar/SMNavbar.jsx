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
    <header className="SMheader">
      <div className="SMcontainer">
        <nav>
          <Link to="/" className="SMnavbar-logo" onClick={closeMobileMenu}>
            <img src="/Logo.png" alt="Logo" className="SMnavbar-logo-image" />
          </Link>

          <ul className={SMclick ? "SMnav-link active" : "SMnav-link"}>
            <li>
              <Link
                to="/"
                className={`SMa ${location.pathname === "/" ? "SMactive" : ""}`}
                onClick={closeMobileMenu}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className={`SMa ${location.pathname === "/about" ? "SMactive" : ""}`}
                onClick={closeMobileMenu}
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/services"
                className={`SMa ${location.pathname === "/services" ? "SMactive" : ""}`}
                onClick={closeMobileMenu}
              >
                Services
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className={`SMa ${location.pathname === "/contact" ? "SMactive" : ""}`}
                onClick={closeMobileMenu}
              >
                Contact Me
              </Link>
            </li>
            <li>
              <Link
                to="/faq"
                className={`SMa ${location.pathname === "/faq" ? "SMactive" : ""}`}
                onClick={closeMobileMenu}
              >
                FAQ
              </Link>
            </li>
          </ul>

          <div className="SMnavbar-right">
            <SMIcons />
            <div
              className="SMmenu-icon"
              onClick={toggleMenu}
              aria-label={SMclick ? "Close menu" : "Open menu"}
              role="button"
              tabIndex={0}
            >
              {SMclick ? <FaTimes /> : <FaBars />}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default SMNavbar;