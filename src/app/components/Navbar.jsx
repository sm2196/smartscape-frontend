import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { FaBars, FaTimes } from "react-icons/fa";
import SMIcons from "./SMNavIcons";
import AboutUs from "./AboutUsHome";

function SMNavbar() {
  const [SMclick, setSMClick] = useState(false);

  const toggleMenu = () => {
    setSMClick(!SMclick);
  };

  const closeMobileMenu = () => {
    setSMClick(false);
  };

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
                <a href="/home" onClick={closeMobileMenu}>
                  Home
                </a>
              </li>
              <li>
                <a href="/About" onClick={closeMobileMenu}>
                  About
                </a>
              </li>
              <li>
                <a href="/services" onClick={closeMobileMenu}>
                  Services
                </a>
              </li>
              <li>
                <a href="/contact" onClick={closeMobileMenu}>
                  Contact Me
                </a>
              </li>
              <li>
                <a href="/FAQ" onClick={closeMobileMenu}>
                  FAQ
                </a>
              </li>
            </ul>

            {/* Icons for extra functions */}
            <SMIcons />

            {/* Explandable menu, to expand and minize */}
            <div className="SMicon" onClick={toggleMenu}>
              {SMclick ? <FaTimes /> : <FaBars />}
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}

export default SMNavbar;
