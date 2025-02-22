import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ParallaxProvider } from 'react-scroll-parallax';
import SMNavbar from '../../Swapna/components/layout/Navbar/SMNavbar';
import Home from '../../Swapna/components/pages/Home/SMHomePage';
import About from '../../Swapna/components/pages/AboutUsPage/SMAboutUsPage';
import Services from '../../Swapna/components/pages/Services/SMServices';
import ContactMe from '../../Swapna/components/pages/ContactMe/SMContactMe';
import ScrollToTop from '../../Swapna/components/ScrollToTop';
import './App.css';

function App() {
  return (
    <ParallaxProvider>
      <Router>
        <ScrollToTop />
        <SMNavbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<ContactMe />} />
        </Routes>
      </Router>
    </ParallaxProvider>
  );
}

export default App;