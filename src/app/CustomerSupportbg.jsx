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
{ category: "user-household", question: "How do I link a general user to my household?", answer: "Go to 'Settings > Manage Users > Add User', enter their email, and send an invite. They must accept the invitation before they can access household devices." },
{ category: "user-household", question: "How can I approve or remove a linked user?", answer: "As an admin, go to Manage Users, select the user, and click Approve or Remove." },
{ category: "user-household", question: "What documents are required for admin verification?", answer: "Emirates ID (Proof of identity)\nLease Agreement (Proof of housing)\nUtility bill with the same address as the lease" },
{ category: "user-household", question: "How do I change my admin PIN?", answer: "Go to Settings > Security, enter your current PIN, and set a new one." },
{ category: "user-household", question: "How do I check which family members are online?", answer: "Your Dashboard displays all household members with their online/offline status." },
{ category: "user-household", question: "How do I delete my household account and all associated data?", answer: "As an admin, go to Settings > Account Management, select Delete Household, and confirm." },
{ category: "user-household", question: "How do I add, name, and manage rooms in my household?", answer: "Go to Manage Rooms, click Add Room, name it, and assign devices." },

// Devices & Automation
{ category: "devices-automation", question: "How do I add a new smart device to the system?", answer: "1. Ensure your device is powered on.\n2. Go to 'Device Management > Add Device'.\n3. The system will scan for compatible devices.\n4. Select your device and follow the on-screen setup." },
{ category: "devices-automation", question: "Why is my device not appearing in the app?", answer: "- Ensure the device is powered on and connected to WiFi.\n- Check if it is compatible with the system.\n- Restart your router and try again.\n- If issues persist, reset the device and re-add it." },
{ category: "devices-automation", question: "How can I check if a device is currently online or offline?", answer: "Your Dashboard will show real-time device statuses." },
{ category: "devices-automation", question: "Can I set up automation rules for specific devices?", answer: "Yes! Go to Device Automation, select a device, and configure schedules or triggers." },
{ category: "devices-automation", question: "How do I exclude a device from automatic shutdown rules?", answer: "In Device Settings, select Exclusions and add the device." },
{ category: "devices-automation", question: "How do I override automatic shutdown for certain devices?", answer: "Enable Manual Override in Device Settings to temporarily disable automatic shutdown." },
{ category: "devices-automation", question: "How do I set up my notification preferences?", answer: "Go to Settings > Notifications, where you can enable/disable alerts for specific events." },
{ category: "devices-automation", question: "Can I receive alerts via email instead of push notifications?", answer: "Yes! In Notification Preferences, select Email Alerts." },
{ category: "devices-automation", question: "What kind of alerts does the system provide?", answer: "The system alerts you about:\n- Security issues (break-ins, unauthorized access)\n- Device statuses (offline, malfunctioning)\n- Energy consumption (high usage, peak hours)" },
{ category: "devices-automation", question: "How do I disable notifications for certain events?", answer: "In Settings > Notifications, toggle off the events you don’t want notifications for." },

// Energy & Consumption
{ category: "energy-consumption", question: "How can I track my household’s electricity and water usage?", answer: "Your 'Dashboard' provides real-time consumption stats for electricity and water." },
{ category: "energy-consumption", question: "What do the trend charts and analytics mean?", answer: "The system analyzes your consumption trends, showing daily, weekly, and monthly usage to help you optimize energy use." },
{ category: "energy-consumption", question: "How does the system determine if a device is idle?", answer: "Idle devices are identified based on low or zero electricity usage over a period." },
{ category: "energy-consumption", question: "How do I get notifications when my consumption is too high?", answer: "Set Threshold Alerts in Consumption Settings to receive notifications when usage exceeds a set limit." },
{ category: "energy-consumption", question: "Can I see daily, weekly, and monthly consumption reports?", answer: "Yes! The Reports section provides breakdowns by day, week, and month." },
{ category: "energy-consumption", question: "How does the system calculate energy and water savings?", answer: "The system compares automatic shutdown savings with regular usage to determine efficiency gains." },
{ category: "energy-consumption", question: "Can I receive energy-saving tips based on my usage?", answer: "Yes! The Energy Tips section offers insights based on your past consumption." },
{ category: "energy-consumption", question: "Can I share my energy consumption statistics on social media?", answer: "Yes! In Reports, tap Share Statistics to post your eco-friendly impact." }


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


  };

  const handleClick = () => {
    // Placeholder for live chat logic
    window.open("https://www.example.com/live-chat", "_blank"); // Replace with your actual live chat URL
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