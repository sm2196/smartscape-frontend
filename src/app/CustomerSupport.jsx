import React, { useState } from "react";

const FAQ = () => {

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
        />
      </div>


  </div>)
};

export default FAQ;