import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ParallaxProvider } from 'react-scroll-parallax';
import Navbar from './components/Navbar.jsx';
import './App.css';
import Home from './components/pages/Home.jsx';
import AboutUsPage from './components/pages/AboutUsPage.jsx';
import Main from './components/pages/MainPic.jsx';

function App() {
  return (
    <ParallaxProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </Router>
    </ParallaxProvider>
  );
}

export default App;