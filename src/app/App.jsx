import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ParallaxProvider } from 'react-scroll-parallax';
import SMNavbar from './components/Navbar.jsx';
import './App.css';
import Home from './components/pages/Home.jsx';
import AboutUsPage from './components/pages/AboutUsPage.jsx';
import Services from './components/pages/Services.jsx';
// import Contact from './components/pages/Contact.jsx';
import Main from './components/pages/MainPic.jsx';

function App() {
  return (
    <ParallaxProvider>
      <Router>
        <SMNavbar />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/services" element={<Services />} />
          {/* <Route path="/contact" element={<Contact />} /> */}
        </Routes>
      </Router>
    </ParallaxProvider>
  );
}

export default App;