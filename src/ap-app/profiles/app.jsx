import React from 'react';
import './app.css'; // Import global styles
import Navbar from '../../ap-components/devices/navbar/Navbar';
//import { Sidebar } from '../../components/devices/Sidebar';
import DeviceManagement from '../../ap-components/devices/main/DeviceManagement';

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