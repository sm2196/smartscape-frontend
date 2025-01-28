import React from 'react';
import { Parallax } from 'react-scroll-parallax';
import './AboutUsHome.css';
import './pages/JoinUs.css';

const AboutUs = () => {
  return (
    <div className="about-us-container">
      <Parallax speed={-10}>
        <div className="about-us-content">
          <div className="about-us-image">
            <img src="/bg2.jpg" alt="Smart Home" />
          </div>
          <div className="about-us-text">
            <h2>About Us</h2>
            <h3>Innovative Solution for a Smarter, Simpler & Greener Home</h3>
            <p>
              At SmartScape, we're revolutionizing the way you live by transforming your home into a smarter, more sustainable space. From monitoring your energy and water usage to enhancing security and reducing environmental impact, we empower you to take control of your home effortlessly.
            </p>
            <div className="join-us-wrapper">
              <button> <span>Read More</span></button>
            </div>
          </div>
        </div>
      </Parallax>
    </div>
  );
};

export default AboutUs;
