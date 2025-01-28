import React, { useEffect, useState } from 'react';
import './Ambassador.css';

const AmbassadorForm = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="ambassador-page">
      {/* Parallax Background */}
      <div
        className="ambassador-form-wrapper"
        style={{ backgroundPositionY: `${scrollPosition * 0.5}px` }}
      >
        <div className="ambassador-form-container">
          <div className="ambassador-form">
            <span className="ambassador-heading">Become a SmartScape Ambassador</span>
            <span className="ambassador-subtitle">
              Join our community of smart home enthusiasts and help others transform their living spaces.
            </span>

            <input className="ambassador-input" type="text" placeholder="Full Name" />
            <input className="ambassador-input" type="email" placeholder="Email Address" />
            <input className="ambassador-input" type="text" placeholder="Phone Number" />
            <input className="ambassador-input" type="text" placeholder="Social Media Handles" />
            <textarea className="ambassador-textarea" placeholder="Tell us about yourself"></textarea>

            <div className="ambassador-button-container">
              <div className="ambassador-send-button">Become an Ambassador</div>
              <div className="ambassador-reset-button-container">
                <div className="ambassador-reset-button" id="reset-btn">Logout</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Extra space to allow scrolling */}
      <div className="ambassador-scroll-space"></div>
    </div>
  );
};

export default AmbassadorForm;
