import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ParallaxProvider } from 'react-scroll-parallax';
import SMNavbar from '../components/layout/Navbar/SMNavbar';
import Home from '../components/pages/Home/SMHomePage';
import About from '../components/pages/AboutUsPage/SMAboutUsPage';
import Services from '../components/pages/Services/SMServices';
import ContactMe from '../components/pages/ContactMe/SMContactMe';
import ScrollToTop from '../components/ScrollToTop';
import FAQ from '../components/pages/FAQ/HomeFAQ';
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
          <Route path="/faq" element={<FAQ />} />
        </Routes>
      </Router>
    </ParallaxProvider>
  );
}

export default App;