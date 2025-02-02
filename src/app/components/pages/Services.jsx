import React from 'react';
import { Parallax } from 'react-scroll-parallax';
import './Services.css';
import {
  FaMobileAlt,
  FaShieldAlt,
  FaLeaf,
  FaBolt,
  FaUsers,
  FaLock,
  FaChartLine,
  FaWater,
  FaClock,
  FaBrain,
  FaTools,
  FaRegLightbulb,
  FaAmazon,
  FaGoogle,
  FaApple,
  FaMicrosoft,
  FaHome
} from 'react-icons/fa';
import { MdSecurity, MdDeviceHub } from 'react-icons/md';

function Services() {
  const services = [
    {
      icon: <FaMobileAlt />,
      title: "Universal Control",
      description: "Control your entire smart home ecosystem from any device, anywhere.",
      features: [
        "Multi-device access",
        "Real-time updates",
        "Intuitive interface",
        "Secure remote control"
      ]
    },
    {
      icon: <FaUsers />,
      title: "Smart Access",
      description: "Manage permissions and access levels for family members and guests.",
      features: [
        "User profiles",
        "Custom permissions",
        "Time-based access",
        "Activity tracking"
      ]
    },
    {
      icon: <MdSecurity />,
      title: "24/7 Monitoring",
      description: "Keep your home secure with constant surveillance and instant alerts.",
      features: [
        "Live camera feeds",
        "Motion detection",
        "Smart sensors",
        "Instant alerts"
      ]
    },
    {
      icon: <FaShieldAlt />,
      title: "Emergency System",
      description: "Instant emergency responses and security measures when needed.",
      features: [
        "Quick shutdown",
        "Intrusion detection",
        "Authority alerts",
        "Remote control"
      ]
    },
    {
      icon: <FaLeaf />,
      title: "Eco-Friendly",
      description: "Contribute to sustainability while reducing your utility costs.",
      features: [
        "Energy tracking",
        "Water monitoring",
        "Smart automation",
        "Usage reports"
      ]
    },
    {
      icon: <FaBolt />,
      title: "Peak Management",
      description: "Optimize energy usage during DEWA peak hours to save costs.",
      features: [
        "Auto-scheduling",
        "Cost optimization",
        "Usage control",
        "Rate monitoring"
      ]
    }
  ];

  const additionalFeatures = [
    {
      icon: <FaWater />,
      title: "Water Conservation",
      description: "Smart water management system to reduce waste and costs"
    },
    {
      icon: <FaClock />,
      title: "Scheduling",
      description: "Automated scheduling for all your home devices"
    },
    {
      icon: <FaBrain />,
      title: "AI Integration",
      description: "Smart learning algorithms for better automation"
    },
    {
      icon: <FaTools />,
      title: "Easy Maintenance",
      description: "Predictive maintenance alerts and quick support"
    }
  ];

  const integrations = [
    {
      icon: <FaAmazon />,
      title: "Amazon Alexa",
      description: "Voice control your home with Alexa integration"
    },
    {
      icon: <FaGoogle />,
      title: "Google Home",
      description: "Seamless integration with Google Home ecosystem"
    },
    {
      icon: <FaApple />,
      title: "Apple HomeKit",
      description: "Control your home through Apple devices"
    },
    {
      icon: <FaMicrosoft />,
      title: "Microsoft Azure",
      description: "Enterprise-grade cloud infrastructure"
    }
  ];

  return (
    <div className="services-page">
      <div className="services-hero">
        <div className="hero-content">
          <h1>Transform Your Home</h1>
          <p>Experience the future of smart living with complete control at your fingertips</p>
        </div>
      </div>

      <div className="services-section">
        <div className="section-header">
          <h2>Our Core Services</h2>
          <p>Discover how we're revolutionizing home automation</p>
        </div>
        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card">
              <div className="service-icon">
                {service.icon}
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <ul>
                {service.features.map((feature, fIndex) => (
                  <li key={fIndex}>{feature}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="additional-features">
        <div className="section-header">
          <h2>Additional Features</h2>
          <p>More ways to enhance your smart home experience</p>
        </div>
        <div className="features-grid">
          {additionalFeatures.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="integrations-section">
        <div className="section-header">
          <h2>Future Integrations</h2>
          <p>Connect with your favorite smart home platforms</p>
        </div>
        <div className="integrations-grid">
          {integrations.map((integration, index) => (
            <div key={index} className="integration-card">
              <div className="integration-icon">
                {integration.icon}
              </div>
              <h3>{integration.title}</h3>
              <p>{integration.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="services-stats">
        <div className="stat-item">
          <h3>1000+</h3>
          <p>Happy Customers</p>
        </div>
        <div className="stat-item">
          <h3>24/7</h3>
          <p>Support Available</p>
        </div>
        <div className="stat-item">
          <h3>30%</h3>
          <p>Energy Savings</p>
        </div>
        <div className="stat-item">
          <h3>100%</h3>
          <p>Satisfaction Rate</p>
        </div>
      </div>

      <div className="register-section">
        <div className="register-content">
          <h2>Ready to Transform Your Home?</h2>
          <p>Join thousands of satisfied homeowners in the smart living revolution</p>
          <div className="services-register-button">
            <button><span>Register Today</span></button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Services;