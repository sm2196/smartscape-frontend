import React from 'react';
import { Parallax } from 'react-scroll-parallax';
import './AboutUsPage.css';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaYoutube, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import '../SMFooter.css';

function AboutUsPage() {
  return (
    <>
      <div className="aboutus-page-container">
        {/* Hero Section with Parallax */}
        <Parallax translateY={[-20, 20]} className="aboutus-hero-wrapper">
          <div className="aboutus-hero">
            <h1>OUR JOURNEY</h1>
            <p>Transforming homes into intelligent living spaces</p>
          </div>
        </Parallax>

        <div className="aboutus-content">
          {/* Mission Section with Parallax */}
          <Parallax translateY={[-15, 15]} className="aboutus-mission-section">
            <div className="mission-content">
              <h2>OUR MISSION</h2>
              <h3>Redefining Smart Living</h3>
              <p>Founded in 2024, SmartScape emerged from a simple yet powerful idea: to make smart home technology accessible,
                 intuitive, and beneficial for everyone. Our journey began when a group of tech enthusiasts and home automation
                 experts came together with a shared vision of transforming how people interact with their living spaces.</p>
            </div>
          </Parallax>

          {/* Values Grid Section */}
          <section className="aboutus-values-section">
            <div className="aboutus-grid">
              <Parallax translateY={[-10, 10]} className="aboutus-grid-item">
                <h3>Innovation</h3>
                <p>We continuously push the boundaries of what's possible in home automation, developing
                   cutting-edge solutions that anticipate and meet our customers' needs.</p>
              </Parallax>
              <Parallax translateY={[-5, 15]} className="aboutus-grid-item">
                <h3>Sustainability</h3>
                <p>Our smart home solutions are designed with environmental consciousness in mind,
                   helping reduce energy consumption and minimize environmental impact.</p>
              </Parallax>
              <Parallax translateY={[-15, 5]} className="aboutus-grid-item">
                <h3>Security</h3>
                <p>We prioritize the safety and privacy of our users, implementing robust security
                   measures in all our products and services.</p>
              </Parallax>
              <Parallax translateY={[-10, 10]} className="aboutus-grid-item">
                <h3>Support</h3>
                <p>Our dedicated team provides comprehensive support to ensure our customers get
                   the most out of their smart home experience.</p>
              </Parallax>
            </div>
          </section>

          {/* Vision Section with Parallax */}
          <Parallax translateY={[-15, 15]} className="aboutus-vision-section">
            <div className="vision-content">
              <h2>OUR VISION</h2>
              <p>At SmartScape, we envision a future where every home device is connected and effortlessly smart. Our smart home app puts control at your fingertips, allowing you to manage all your devices with ease. From lighting and security to energy management, we aim to create a simple, intuitive experience that enhances comfort, efficiency, and peace of mind.</p>
            </div>
          </Parallax>

          {/* Team Section with Parallax */}
          <Parallax translateY={[-15, 15]} className="aboutus-team-section">
            <div className="team-content">
              <h2>OUR TEAM</h2>
              <p>SmartScape is driven by a team of nine passionate students on a mission to simplify and enhance everyday home experiences. With backgrounds in technology, design, and user experience, we focus on creating smart, intuitive solutions that make homes more efficient and convenient. We believe in innovation that blends seamlessly into daily life, making home automation smarter, easier, and more accessible for everyone.</p>
            </div>
          </Parallax>
        </div>

        {/* Footer Section */}
        <div className='SMfooter-container'>
          <section className='SMfooter-subscription'>
            <p className='SMfooter-subscription-heading'>
              Join our newsletter to know us better
            </p>
            <p className='SMfooter-subscription-text'>
              Stay updated with our latest smart home solutions
            </p>
            <div className='input-areas'>
              <form>
                <input
                  className='SMfooter-input'
                  name='email'
                  type='email'
                  placeholder='Your Email'
                />
                <div className="SM-FooterButton-wrapper">
                  <button type="submit">
                    <span>Subscribe</span>
                  </button>
                </div>
              </form>
            </div>
          </section>

          <div className='SMfooter-links'>
            <div className='SMfooter-link-wrapper'>
              <div className='SMfooter-link-items'>
                <h2>About Us</h2>
                <Link to='/'>How it works</Link>
                <Link to='/'>Why choose us</Link>
                <Link to='/'>Testimonials</Link>
                <Link to='/'>Careers</Link>
              </div>
              <div className='SMfooter-link-items'>
                <h2>Contact Us</h2>
                <Link to='/'>Contact</Link>
                <Link to='/'>Support</Link>
                <Link to='/'>Customer Care</Link>
                <Link to='/'>Technical Help</Link>
              </div>
            </div>
            <div className='SMfooter-link-wrapper'>
              <div className='SMfooter-link-items'>
                <h2>Resources</h2>
                <Link to='/'>Submit Video</Link>
                <Link to='/'>Ambassadors</Link>
                <Link to='/'>FAQ</Link>
                <Link to='/'>Blog</Link>
              </div>
              <div className='SMfooter-link-items'>
                <h2>Connect</h2>
                <Link to='/'>Instagram</Link>
                <Link to='/'>Facebook</Link>
                <Link to='/'>Youtube</Link>
                <Link to='/'>Twitter</Link>
              </div>
            </div>
          </div>

          <section className='social-media'>
            <div className='social-media-wrap'>
              <div className='social-icons'>
                <a className='social-icon-link facebook' href='https://facebook.com' target='_blank' rel='noopener noreferrer' aria-label='Facebook'>
                  <FaFacebookF />
                </a>
                <a className='social-icon-link instagram' href='https://instagram.com' target='_blank' rel='noopener noreferrer' aria-label='Instagram'>
                  <FaInstagram />
                </a>
                <a className='social-icon-link youtube' href='https://youtube.com' target='_blank' rel='noopener noreferrer' aria-label='Youtube'>
                  <FaYoutube />
                </a>
                <a className='social-icon-link twitter' href='https://twitter.com' target='_blank' rel='noopener noreferrer' aria-label='Twitter'>
                  <FaTwitter />
                </a>
                <a className='social-icon-link linkedin' href='https://linkedin.com' target='_blank' rel='noopener noreferrer' aria-label='LinkedIn'>
                  <FaLinkedinIn />
                </a>
              </div>
            </div>
          </section>
          <div className='website-rights'>
            <p>SmartScape © {new Date().getFullYear()} | All Rights Reserved</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default AboutUsPage;