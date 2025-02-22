import React from "react";
import "./ap_app.css"; // Import global styles
import Navbar from "./navbar/ap_Navbar";
import DeviceManagement from "./main/ap_DeviceManagement";

export default function App() {
  return (
    <div className="ap_layout">
      {/* Navbar */}
      <div className="navbar">
        <Navbar />
      </div>
      {/* Main Content */}
      <div className="ap_main-content">
        <DeviceManagement />
      </div>
    </div>
  );
}
