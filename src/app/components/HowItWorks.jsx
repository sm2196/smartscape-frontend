import React, { useEffect } from "react";
import "./HowItWorks.css";
import { FaUserPlus, FaFileAlt, FaCheckCircle, FaCogs, FaMobileAlt } from "react-icons/fa";

const ProcessFlow = () => {
  useEffect(() => {
    const handleScroll = () => {
      const items = document.querySelectorAll(".flow-item");
      items.forEach((item) => {
        const rect = item.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.85) {
          item.classList.add("visible");
        }
      });
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const steps = [
    { icon: <FaUserPlus />, title: "Register", description: "Sign up for an account to begin your journey." },
    { icon: <FaFileAlt />, title: "Upload Documents", description: "Submit required documents for verification." },
    { icon: <FaCheckCircle />, title: "Verification", description: "Our team verifies your details for security." },
    { icon: <FaCogs />, title: "Configuration", description: "Customize your settings and preferences." },
    { icon: <FaMobileAlt />, title: "Manage", description: "Control everything seamlessly from your device." },
  ];

  return (
    <div className="parallax-background">
      <div className="process-flow">
        <h1 className="flow-title">How It <span>Works</span></h1>
        <p className="flow-subtitle">Follow these simple steps to get started and make the most of our platform.</p>
        <div className="flow-timeline">
          {steps.map((step, index) => (
            <div key={index} className={`flow-item ${index % 2 === 0 ? "left" : "right"}`}>
              <div className="flow-icon">{step.icon}</div>
              <div className="flow-content">
                <h3 className="flow-title-item">{step.title}</h3>
                <p className="flow-description">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProcessFlow;