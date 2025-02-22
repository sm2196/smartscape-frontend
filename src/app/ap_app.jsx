import React from "react";
import "./ap_app.css"; // Import global styles
import Navbar from "../components/navbar/ap_Navbar";
//import { Sidebar } from '../../components/devices/Sidebar';
import DeviceManagement from "../components/main/ap_DeviceManagement";

export default function App() {
  return (
    <div className="ap_layout">
      {/* Navbar */}
      {/* <div className="sidebar">
        <Sidebar />
      </div> */}
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
