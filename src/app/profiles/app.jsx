import React from 'react';
import Navbar from './Navbar';


import '../styles-as.css'; // Importing global styles under different name
import AdminSettings from './AdminSettings';

export default function App() {
  return (
    <div className="container">
      <Navbar />
      <div className="mainContent">
        <AdminSettings/>

      </div>
    </div>
  );
}