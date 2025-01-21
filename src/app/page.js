"use client"; // Ensures this component runs as a client-side component

import React from "react";
import "./homeStyle.css"; // Importing global styles
import Navbar from "./Navbar";


const Page = () => {
  return (
    <div className="app-container">
      <Navbar />
    </div>
  );
};

export default Page;