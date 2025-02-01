import React from 'react';
import { Parallax } from 'react-scroll-parallax';
import './Services.css';
import { FaUserShield, FaHome, FaChartLine, FaBell, FaCog, FaQuestionCircle } from 'react-icons/fa';
import { MdSecurity, MdDeviceHub, MdTimer } from 'react-icons/md';

function Services() {
  const services = [
    {
      icon: <FaUserShield />,
      title: "Account Management",
      description: "Secure account creation with email verification, two-factor authentication, and profile management.",
      features: [
        "User registration and validation",
        "Two-factor authentication",
        "Profile customization",
        "Privacy controls"
      ]
    },
    {
      icon: <MdSecurity />,
      title: "Security Features",
      description: "Advanced security measures to protect your home and data.",
      features: [
        "Emergency lockdown",
        "Break-in detection",
        "Security alerts",
        "Session management"
      ]
    },
    {
      icon: <MdDeviceHub />,
      title: "Device Management",
      description: "Seamless control and monitoring of all your smart home devices.",
      features: [
        "Automatic device discovery",
        "Real-time status monitoring",
        "Custom automation rules",
        "Room-specific controls"
      ]
    },
    {
      icon: <FaChartLine />,
      title: "Consumption Analysis",
      description: "Detailed insights into your energy and water usage patterns.",
      features: [
        "Real-time monitoring",
        "Usage trends",
        "Cost analysis",
        "Environmental impact"
      ]
    },
    {
      icon: <MdTimer />,
      title: "Peak Time Management",
      description: "Smart features to optimize energy usage during peak hours.",
      features: [
        "DEWA peak time integration",
        "Automatic device shutdown",
        "Custom override rules",
        "Usage optimization"
      ]
    },
    {
      icon: <FaQuestionCircle />,
      title: "Support System",
      description: "Comprehensive support to help you make the most of your smart home.",
      features: [
        "24/7 chatbot assistance",
        "Video tutorials",
        "FAQ section",
        "Direct support contact"
      ]
    }
  ];

  return (
    <div className="services-page">
      {/* Hero Section */}
      <Parallax translateY={[-20, 20]} className="services-hero">
        <div className="services-hero-content">
          <h1>Our Services</h1>
          <p>Comprehensive Smart Home Solutions for Modern Living</p>
        </div>
      </Parallax>

      {/* Services Grid */}
      <div className="services-grid-container">
        <div className="services-grid">
          {services.map((service, index) => (
            <Parallax
              key={index}
              translateY={[10, -10]}
              className="service-card"
            >
              <div className="service-icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <ul>
                {service.features.map((feature, fIndex) => (
                  <li key={fIndex}>{feature}</li>
                ))}
              </ul>
            </Parallax>
          ))}
        </div>
      </div>

      {/* Additional Features Section */}
      <Parallax translateY={[-15, 15]} className="additional-features">
        <div className="features-content">
          <h2>Additional Features</h2>
          <div className="features-grid">
            <div className="feature">
              <FaHome className="feature-icon" />
              <h3>Room Management</h3>
              <p>Create and customize rooms with specific automation rules</p>
            </div>
            <div className="feature">
              <FaBell className="feature-icon" />
              <h3>Smart Notifications</h3>
              <p>Customizable alerts for all your home automation needs</p>
            </div>
            <div className="feature">
              <FaCog className="feature-icon" />
              <h3>Admin Controls</h3>
              <p>Advanced management tools for household administrators</p>
            </div>
          </div>
        </div>
      </Parallax>

      {/* Call to Action */}
      <div className="services-cta">
        <h2>Ready to Transform Your Home?</h2>
        <p>Join SmartScape today and experience the future of smart living</p>
        <button className="cta-button">Get Started</button>
      </div>
    </div>
  );
}

export default Services;