import React, { useState, useEffect } from "react";
import "./HomeFAQ.css";
import { Link } from "react-router-dom";

const faqs = [
  { question: "How do I create a new account on SmartScape?", answer: "To create a new account, visit the sign-up page and provide your full name, email, phone number, and password. After registration, you will need to verify your email or phone through an OTP (One-Time Password) to activate your account" },
  { question: "Can I choose the type of account I want to create?", answer: "Yes, during sign-up, you can choose between an admin or general user account. Admin accounts will require additional document verification, including proof of identity and housing." },
  { question: " How do I become an admin user?", answer: "To become an admin, you need to upload documents for verification, such as your Emirates ID, lease agreement, and utility bills with the same address as the lease. After document verification, an admin PIN will be required to access the admin controls." },
  { question: "How long will it take for my account is verified after I have submitted the required documents?", answer: "Verification usually takes 1 to 3 business days. You'll receive a notification once it's complete. To avoid delays, ensure your documents are clear. If more info is needed, we'll contact you." },
  { question: "How does SmartScape ensure privacy?", answer: "SmartScape provides options for you to control the visibility of your personal information and manage your data sharing preferences with third-party services." },
  { question: "How do I manage my devices?", answer: "SmartScape automatically discovers compatible devices within your home network. You can monitor their status, set up rules for energy-saving, and control them directly from the dashboard." },
  { question: "What should I do if my account shows suspicious activity?", answer: "If there is suspicious activity, SmartScape will lock your account and notify admins. You can take action by reviewing login attempts and terminating suspicious sessions." },
  { question: "Do I need any special equipment to use SmartScape?", answer: "To use SmartScape, you’ll need a stable internet connection and compatible smart home devices. You don’t need any additional hardware; SmartScape works with existing smart devices in your home." },
  { question: "How easy is it to set up SmartScape?", answer: "Setting up SmartScape is simple. After signing up, the app automatically detects supported devices in your home. You can control devices, create automation rules, and monitor energy usage right from the app." },
  { question: "What happens if I want to delete my SmartScape account?", answer: "You can delete your SmartScape account at any time through the app’s settings. Please note that deleting your account will remove all associated data and devices." },
  { question: "Can I change my account from general user to admin?", answer: "Once your account is set up as a general user, you cannot directly change it to an admin role. You would need to create a new admin account or have an existing admin adjust your account settings." },
  { question: "How do I manage my household and linked users?", answer: "Admin users can link or remove general users, view active sessions, and customize device control settings for each member of the household." },
  { question: "How can I track my energy and water consumption?", answer: "SmartScape provides real-time data and trend charts for electricity and water consumption. You can also set thresholds and receive alerts if consumption exceeds your set limits." },
  { question: "Is SmartScape compatible with all smart devices?", answer: "SmartScape is designed to support a wide range of compatible smart home devices, including lighting, security cameras, thermostats, and more. The system automatically discovers devices on your network, making setup easy." }
];

const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className={`RSFaqItem ${isOpen ? "open" : ""}`} onClick={onClick}>
      <div className="RSFaqQuestion">
        <span>{isOpen ? "▾" : "▸"}</span> {question}
      </div>
      {isOpen && <hr className="RSFaqDivider" />}
      <div className="RSFaqAnswer">{answer}</div>
    </div>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      const reveals = document.querySelectorAll(".SMreveal");
      reveals.forEach((element) => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < windowHeight - elementVisible) {
          element.classList.add("active");
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const reveals = document.querySelectorAll(".SMreveal");
    reveals.forEach((element) => {
      element.classList.add("active");
    });
  }, []);

  return (
    <div className="RSFaqContainer">
      {/* Hero Split Section */}
      <div className="SMfaq-hero-split SMreveal">
        <div className="SMfaq-hero-left">
          <div className="SMfaq-hero-content">
            <div className="SMfaq-hero-title">FREQUENTLY</div>
            <div className="SMfaq-hero-title">ASKED QUESTIONS</div>
            <div className="SMfaq-hero-text">
              <p>
                Here's some answers to the most common questions we get asked.
              </p>
            </div>
          </div>
        </div>
        <div className="SMfaq-hero-right">
          <div className="SMfaq-hero-gradient"></div>
        </div>
      </div>

      <div className="RSFaqHeader">
        <h2>Frequently Asked Questions</h2>
        <p className="faq-subtitle">Here's some answers to the most common questions we get asked</p>
      </div>
      <div className="RSFaqGrid">
        {faqs.map((faq, index) => (
          <FAQItem
            key={index}
            question={faq.question}
            answer={faq.answer}
            isOpen={openIndex === index}
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
          />
        ))}
      </div>
    </div>
  );
};


export default FAQ;