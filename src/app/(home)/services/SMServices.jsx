import './SMServices.css';
import {
  FaMobileAlt,
  FaShieldAlt,
  FaLeaf,
  FaBolt,
  FaUsers,
  FaWater,
  FaClock,
  FaBrain,
  FaTools,
  FaAmazon,
  FaGoogle,
  FaApple,
  FaMicrosoft,
} from 'react-icons/fa';
import { MdSecurity } from 'react-icons/md';
import Link from "next/link";

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
    <div className="SMservices-page">
      {/* Updated Hero Section */}
      <div className="SMservices-hero">
        <div className="SMhero-left">
          <div className="SMhero-content">
            <div className="SMhero-title">OUR</div>
            <div className="SMhero-title">SERVICES</div>
            <div className="SMhero-text">
              <p>
                Experience the future of smart living with complete control at your fingertips.
                Our comprehensive suite of services transforms your home into an intelligent,
                efficient, and secure living space.
              </p>
            </div>
          </div>
        </div>
        <div className="SMhero-right">
          <div className="SMhero-gradient"></div>
        </div>
      </div>

      <div className="SMservices-section">
        <div className="SMsection-header">
          <h2>Our Core Services</h2>
          <p>Discover how we're revolutionizing home automation</p>
        </div>
        <div className="SMservices-grid">
          {services.map((service, index) => (
            <div key={index} className="SMservice-card">
              <div className="SMservice-icon">
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

      <div className="SMadditional-features">
        <div className="SMsection-header">
          <h2>Additional Features</h2>
          <p>More ways to enhance your smart home experience</p>
        </div>
        <div className="SMfeatures-grid">
          {additionalFeatures.map((feature, index) => (
            <div key={index} className="SMfeature-card">
              <div className="SMfeature-icon">
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="SMintegrations-section">
        <div className="SMsection-header">
          <h2>Future Integrations</h2>
          <p>Connect with your favorite smart home platforms</p>
        </div>
        <div className="SMintegrations-grid">
          {integrations.map((integration, index) => (
            <div key={index} className="SMintegration-card">
              <div className="SMintegration-icon">
                {integration.icon}
              </div>
              <h3>{integration.title}</h3>
              <p>{integration.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="SMservices-stats">
        <div className="SMstat-item">
          <h3>1000+</h3>
          <p>Happy Customers</p>
        </div>
        <div className="SMstat-item">
          <h3>24/7</h3>
          <p>Support Available</p>
        </div>
        <div className="SMstat-item">
          <h3>30%</h3>
          <p>Energy Savings</p>
        </div>
        <div className="SMstat-item">
          <h3>100%</h3>
          <p>Satisfaction Rate</p>
        </div>
      </div>

      <div className="SMregister-section">
        <div className="SMregister-content">
          <h2>Ready to Transform Your Home?</h2>
          <p>Join thousands of satisfied homeowners in the smart living revolution</p>
          <div className="SMservices-register-button">
          <Link href="/auth"><button><span>Register Today</span></button></Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Services;