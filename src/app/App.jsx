import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ParallaxProvider } from 'react-scroll-parallax';
import SMNavbar from './components/SMNavbar';
import Home from './components/pages/Home';
import About from './components/pages/AboutUsPage';
import Services from './components/pages/Services';
import ContactMe from './components/pages/ContactMe';
// import FAQ from './components/pages/FAQ';
import './App.css';

function App() {
  return (
    <ParallaxProvider>
      <Router>
        <SMNavbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<ContactMe />} />
          {/* <Route path="/faq" element={<FAQ />} /> */}
        </Routes>
      </Router>
    </ParallaxProvider>
  );
}

export default App;