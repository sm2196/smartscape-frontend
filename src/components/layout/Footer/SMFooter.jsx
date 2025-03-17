import React, { useEffect, useState } from "react";
import { ParallaxProvider, Parallax } from "react-scroll-parallax";
import { useNavigate } from "react-router-dom";
import "../../../app/App.css";
import "../../sections/SMHomeHeroSection.css";
import "../../sections/SMAboutUsHome.css";
import "../../sections/SMHowItWorks.css";
import "../../sections/SMParallax.css";
import { Link } from "react-router-dom";
import {
  FaUserPlus,
  FaFileAlt,
  FaCheckCircle,
  FaCogs,
  FaMobileAlt,
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";
import "../../layout/Footer/SMFooter.css";

const SMfooter = () => {
  return (
    <div className="SMfooter-container">
      <div className="SMfooter-subscription">
        <h1 className="SMfooter-subscription-heading">
          Join our newsletter to know us better
        </h1>
        <p className="SMfooter-subscription-text">
          Stay updated with our latest smart home solutions
        </p>
        <div className="input-areas">
          <form>
            <input
              className="SMfooter-input"
              name="email"
              type="email"
              placeholder="Your Email"
            />
            <div className="SM-FooterButton-wrapper">
              <button type="submit">
                <span>Subscribe</span>
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="SMfooter-links">
        <div className="SMfooter-link-wrapper">
          <div className="SMfooter-link-items">
            <h2>About Us</h2>
            <Link to="/">How it works</Link>
            <Link to="/">Testimonials</Link>
            <Link to="/">Careers</Link>
          </div>
          <div className="SMfooter-link-items">
            <h2>Contact Us</h2>
            <Link to="/">Contact</Link>
            <Link to="/">Support</Link>
            <Link to="/">Customer Care</Link>
            <Link to="/">Technical Help</Link>
          </div>
        </div>
        <div className="SMfooter-link-wrapper">
          <div className="SMfooter-link-items">
            <h2>Resources</h2>
            <Link to="/">Submit Video</Link>
            <Link to="/">Ambassadors</Link>
            <Link to="/">FAQ</Link>
            <Link to="/">Blog</Link>
          </div>
          <div className="SMfooter-link-items">
            <h2>Connect</h2>
            <Link to="/">Instagram</Link>
            <Link to="/">Facebook</Link>
            <Link to="/">Youtube</Link>
            <Link to="/">Twitter</Link>
          </div>
        </div>
      </div>
      <section className="social-media">
        <div className="social-media-wrap">
          <div className="social-icons">
            <a
              className="social-icon-link facebook"
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <FaFacebookF />
            </a>
            <a
              className="social-icon-link instagram"
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>
            <a
              className="social-icon-link youtube"
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Youtube"
            >
              <FaYoutube />
            </a>
            <a
              className="social-icon-link twitter"
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <FaTwitter />
            </a>
            <a
              className="social-icon-link linkedin"
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </section>
      <div className="website-rights">
        <p>SmartScape © {new Date().getFullYear()} | All Rights Reserved</p>
      </div>
    </div>
  );
};

export default SMfooter;
