import React from 'react';
import { ParallaxProvider, Parallax } from 'react-scroll-parallax';
import '../../App.css';
import Cards from '../Cards';
import Main from '../MainPic'; // Import Main instead of separate components
import Footer from '../Footer';
import Form from '../Ambassador';
import HowItWorks from '../HowItWorks';

function Home() {
  return (
    <ParallaxProvider>
      <div className="home-container">
        <Parallax speed={-15}>
          <Main />
        </Parallax>
        <Parallax speed={-5}>
          <Cards />
        </Parallax>
        <Parallax speed={10}>
          <HowItWorks />
        </Parallax>
        <Parallax speed={5}>
          <Form />
        </Parallax>
        <Footer />
      </div>
    </ParallaxProvider>
  );
}

export default Home;
