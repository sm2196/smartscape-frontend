import React, { useState } from "react";
import { FaVideo } from "react-icons/fa6";
import { IoChatbubblesOutline } from "react-icons/io5";

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


         <button className="videoBtn" >
           <span className="IconContainer">
             <FaVideo className="icon" />
           </span>
           <p className="text">Watch Tutorial</p>
         </button>

         <div className="wrapper">
         <div className="icon live-chat" >
           <IoChatbubblesOutline size={30} color="#fff" />
           <div className="tooltip">Chat</div>
         </div>
       </div>

  </div>)
};

export default FAQ;