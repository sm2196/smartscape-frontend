import React, { useState } from "react";
import { FaBars } from "react-icons/fa";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <header>
        <div className="container">
          <nav>
            <div className="logo">
              <h2>SmartScape</h2>
            </div>
            <ul className={isOpen ? "nav-link active" : "nav-link" }>
              <li>
                <a href="/home" className="active">
                  Home
                </a>
              </li>
              <li>
                <a href="/About">
                  About
                </a>
              </li>
              <li>
                <a href="/services">
                  Services
                </a>
              </li>
              <li>
                <a href="/contact">
                  Contact Me
                </a>
              </li>
              <li>
                <a href="/FAQ">
                  FAQ
                </a>
              </li>
            </ul>
            <div className="icon" onClick={toggleMenu}>
              <FaBars />
            </div>
          </nav>
        </div>
        {/* <Image
            aria-hidden
            src="./rand1.jpg"
            alt="File icon"
            width={16}
            height={16}
          /> */}
      </header>
      <section>
        <div className="container">
          <div className="content">
          <h2>pls work</h2>
        </div>
        </div>
      </section>
    </>
  );
}

export default Navbar;
