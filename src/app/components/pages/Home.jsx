import React from 'react';
import { ParallaxProvider, Parallax } from 'react-scroll-parallax';
import '../../App.css';
import Cards from '../Cards';
import MainPicSection from '../MainPic';
import Footer from '../Footer';
import Form from '../Ambassador';
import AboutUs from '../AboutUsHome';
import HowItWorks from '../HowItWorks';

function Home() {
  return (
    <ParallaxProvider>
      <Parallax speed={-15}>
        <MainPicSection />
      </Parallax>
      <Parallax speed={-10}>
        <AboutUs />
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
    </ParallaxProvider>
  );
}

export default Home;
