import React from "react";
import "./ap_app.css"; // Import global styles
import Navbar from "../../components/devices/navbar/ap_Navbar";
//import { Sidebar } from '../../components/devices/Sidebar';
import DeviceManagement from "../../components/devices/main/ap_DeviceManagement";

export default function App() {
  return (
    <div className="layout">
      {/* Navbar */}
      {/* <div className="sidebar">
        <Sidebar />
      </div> */}
      <div className="navbar">
        <Navbar />
      </div>

      {/* Main Content */}
      <div className="main-content">
        <DeviceManagement />
      </div>
    </div>
  );
}
