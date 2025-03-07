import React, { useState } from "react";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { FaVideo } from "react-icons/fa6";
import { IoChatbubblesOutline } from "react-icons/io5";
const faqs = [
   // Account & Security
   { category: "account-security", question: "How do I verify my email or phone number?", answer: "Once you sign up, you'll receive an OTP (One-Time Password) via email or SMS. Enter the OTP on the verification screen to complete the process. If you don’t receive the OTP, you can request a new one after 1 minute." },
   { category: "account-security", question: "What should I do if I don’t receive the OTP?", answer: "- Check your spam or junk folder (for email).\n- Ensure your phone has network coverage (for SMS).\n- Wait a minute before requesting a new OTP.\n- If the issue persists, contact support." },
   { category: "account-security", question: "Can I change my email or phone number after registration?", answer: "Yes! Go to 'Settings > Account Information' to update your email or phone. You will need to verify the new email/phone before it is updated." },
   { category: "account-security", question: "How do I reset my password if I forget it?", answer: "Click 'Forgot Password?' on the login page, enter your registered email, and follow the instructions in the reset email." },
   { category: "account-security", question: "What happens if my account gets locked after multiple failed login attempts?", answer: "For security reasons, your account will be locked after '4 failed attempts'. You can unlock it by resetting your password or waiting '15 minutes' before trying again." },
   { category: "account-security", question: "How do I enable two-factor authentication?", answer: "Go to Settings > Security, and toggle 2FA On. You’ll be required to verify via SMS or email each time you log in from a new device." },
   { category: "account-security", question: "How do I control who can see my personal information?", answer: "Under Privacy Settings, you can choose who can see your profile details. You can also limit data sharing with third-party services." },
   { category: "account-security", question: "Can I disable data sharing with third-party services?", answer: "Yes! Go to Privacy Settings and toggle off third-party data sharing." },
   { category: "account-security", question: "How do I receive alerts for security events like break-ins?", answer: "Ensure Security Alerts are enabled under Settings > Notifications. You will receive real-time alerts via push notifications, SMS, or email." },
   { category: "account-security", question: "How do I activate emergency lockdown mode?", answer: "Press and hold the Lockdown button in the app, or use the admin PIN on your security panel to activate lockdown instantly." },
   { category: "account-security", question: "Can I log out of all sessions if I suspect suspicious activity?", answer: "Yes! Go to Settings > Active Sessions, and tap Log Out of All Devices to end all active sessions." },

// User & Household Management
{ category: "user-household", question: "What is the difference between an admin and a general user?", answer: "- 'Admin:' Manages household settings, users, security, and devices.\n- 'General User:' Can control devices but needs admin approval to join a household." },


// Devices & Automation
{ category: "devices-automation", question: "How do I add a new smart device to the system?", answer: "1. Ensure your device is powered on.\n2. Go to 'Device Management > Add Device'.\n3. The system will scan for compatible devices.\n4. Select your device and follow the on-screen setup." },


// Energy & Consumption
{ category: "energy-consumption", question: "How can I track my household’s electricity and water usage?", answer: "Your 'Dashboard' provides real-time consumption stats for electricity and water." },


];
const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className={`faq-item ${isOpen ? "open" : ""}`} onClick={onClick}>
      <div className="faq-question">
        <span style={{ color: "#0A1630" }}>
          {isOpen ? <IoMdArrowDropup /> : <IoMdArrowDropdown />}
        </span>{" "}
        {question}
      </div>
      {isOpen && <hr className="faq-divider" />}
      {isOpen && <div className="faq-answer">{answer}</div>}
    </div>
  );
};

const FAQ = () => {
 const [openIndex, setOpenIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("account-security");

  const filteredFaqs = searchQuery
    ? faqs.filter((faq) =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs.filter((faq) => faq.category === activeCategory);

  const handleTutorialButtonClick = () => {
    // Placeholder for video tutorial action
    window.open("https://www.example.com/tutorial-video", "_blank"); // Replace with your actual tutorial URL


    const handleClick = () => {
      // Placeholder for live chat logic
      window.open("https://www.example.com/live-chat", "_blank"); // Replace with your actual live chat URL
    };

  };
  return (
      <div className="faq-container">
        <div className="faq-header">
          <h2>Customer Support</h2>
          <p className="faq-subtitle">
            Here are some answers to the most common questions we get asked
          </p>

          {/* Search bar */}
          <input
            type="text"
            className="faq-search-bar"
            placeholder="Search for a question..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>


        <button className="videoBtn" onClick={handleTutorialButtonClick}>
          <span className="IconContainer">
            <FaVideo className="icon" />
          </span>
          <p className="text">Watch Tutorial</p>
        </button>

        <div className="wrapper">
        <div className="icon live-chat" onClick={handleClick}>
          <IoChatbubblesOutline size={30} color="#fff" />
          <div className="tooltip">Chat</div>
        </div>
      </div>

        <div className="faq-nav">
          {["account-security", "user-household", "devices-automation", "energy-consumption"].map((category) => (
            <div
              key={category}
              className={`faq-nav-item ${activeCategory === category ? "active" : ""}`}
              onClick={() => setActiveCategory(category)}
            >
              {category.replace("-", " ").charAt(0).toUpperCase() + category.slice(1).replace("-", " ")}
            </div>
          ))}
        </div>

        <div className="faq-grid">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              />
            ))
          ) : (
            <p>No results found.</p>
          )}
        </div>
      </div>
    );
  };

  export default FAQ;