import React, { useState } from "react";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { FaVideo } from "react-icons/fa6";
import { IoChatbubblesOutline } from "react-icons/io5";
const faqs = [
  // Account & Security
{ category: "account-security", question: "How do I verify my email or phone number?", answer: "Once you sign up, you'll receive an OTP (One-Time Password) via email or SMS. Enter the OTP on the verification screen to complete the process. If you don’t receive the OTP, you can request a new one after 1 minute." },


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