import React, { useEffect } from 'react';
import { Parallax } from 'react-scroll-parallax';
import './AboutUsPage.css';
import { Link } from 'react-router-dom';
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaTwitter,
  FaLinkedinIn,
  FaLightbulb,
  FaLeaf,
  FaShieldAlt,
  FaHeadset,
  FaArrowRight
} from "react-icons/fa";
import '../SMFooter.css';

function AboutUsPage() {
  useEffect(() => {
    const handleScroll = () => {
      const reveals = document.querySelectorAll('.reveal');

      reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < windowHeight - elementVisible) {
          element.classList.add('active');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div className="aboutus-page-container">
        <Parallax translateY={[-20, 20]} className="aboutus-hero-wrapper">
          <div className="aboutus-hero">
            <h1>OUR JOURNEY</h1>
            <p>Transforming homes into intelligent living spaces</p>
            <div className="hero-scroll-indicator">
              <span>Scroll to explore</span>
              <FaArrowRight className="scroll-arrow" />
            </div>
          </div>
        </Parallax>

        <div className="aboutus-content">
          <Parallax translateY={[-15, 15]} className="aboutus-mission-section">
            <div className="mission-content reveal">
              <div className="mission-text">
                <h2>OUR MISSION</h2>
                <h3>Redefining Smart Living</h3>
                <p>Founded in 2024, SmartScape emerged from a simple yet powerful idea: to make smart home technology accessible,
                   intuitive, and beneficial for everyone. Our journey began when a group of tech enthusiasts and home automation
                   experts came together with a shared vision of transforming how people interact with their living spaces.</p>
              </div>
              <div className="mission-image">
                <img src="/try2.jpg" alt="Smart Home Technology" />
              </div>
            </div>
          </Parallax>

          <section className="aboutus-values-section">
            <h2 className="values-title reveal">Our Core Values</h2>
            <div className="aboutus-grid">
              <Parallax translateY={[-10, 10]} className="aboutus-grid-item reveal">
                <div className="grid-icon-wrapper">
                  <FaLightbulb className="grid-icon" />
                </div>
                <h3>Innovation</h3>
                <p>We continuously push the boundaries of what's possible in home automation, developing
                   cutting-edge solutions that anticipate and meet our customers' needs.</p>
              </Parallax>
              <Parallax translateY={[-5, 15]} className="aboutus-grid-item reveal">
                <div className="grid-icon-wrapper">
                  <FaLeaf className="grid-icon" />
                </div>
                <h3>Sustainability</h3>
                <p>Our smart home solutions are designed with environmental consciousness in mind,
                   helping reduce energy consumption and minimize environmental impact.</p>
              </Parallax>
              <Parallax translateY={[-15, 5]} className="aboutus-grid-item reveal">
                <div className="grid-icon-wrapper">
                  <FaShieldAlt className="grid-icon" />
                </div>
                <h3>Security</h3>
                <p>We prioritize the safety and privacy of our users, implementing robust security
                   measures in all our products and services.</p>
              </Parallax>
              <Parallax translateY={[-10, 10]} className="aboutus-grid-item reveal">
                <div className="grid-icon-wrapper">
                  <FaHeadset className="grid-icon" />
                </div>
                <h3>Support</h3>
                <p>Our dedicated team provides comprehensive support to ensure our customers get
                   the most out of their smart home experience.</p>
              </Parallax>
            </div>
          </section>

          <Parallax translateY={[-15, 15]} className="aboutus-vision-section">
            <div className="vision-wrapper reveal">
              <div className="vision-content">
                <div className="vision-text">
                  <h2>OUR VISION</h2>
                  <h3>Creating Tomorrow's Homes Today</h3>
                  <p>At SmartScape, we envision a future where every home device is connected and effortlessly smart.
                     Our smart home app puts control at your fingertips, allowing you to manage all your devices with ease.</p>
                  <div className="vision-stats">
                    <div className="stat-item">
                      <span className="stat-number">100+</span>
                      <span className="stat-label">Smart Devices</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">50k+</span>
                      <span className="stat-label">Happy Users</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">24/7</span>
                      <span className="stat-label">Support</span>
                    </div>
                  </div>
                </div>
                <div className="vision-image">
                  <img src="/try1.jpg" alt="Future Smart Home" />
                </div>
              </div>
            </div>
          </Parallax>

          <Parallax translateY={[-15, 15]} className="aboutus-team-section">
            <div className="team-wrapper reveal">
              <div className="team-header">
                <h2>OUR TEAM</h2>
                <h3>Meet the Innovators</h3>
                <p>Driven by passion, powered by innovation</p>
              </div>
              <div className="team-grid">
                <div className="team-member reveal">
                  <div className="member-image">
                    <img src="/try1.jpg" alt="Team Member" />
                    <div className="member-overlay">
                      <div className="member-social">
                        <a href="#"><FaLinkedinIn /></a>
                        <a href="#"><FaTwitter /></a>
                      </div>
                    </div>
                  </div>
                  <h4>John Doe</h4>
                  <p>Lead Developer</p>
                </div>
                <div className="team-member reveal">
                  <div className="member-image">
                    <img src="/bg3.jpg" alt="Team Member" />
                    <div className="member-overlay">
                      <div className="member-social">
                        <a href="#"><FaLinkedinIn /></a>
                        <a href="#"><FaTwitter /></a>
                      </div>
                    </div>
                  </div>
                  <h4>Jane Smith</h4>
                  <p>UX Designer</p>
                </div>
                <div className="team-member reveal">
                  <div className="member-image">
                    <img src="/bg2.jpg" alt="Team Member" />
                    <div className="member-overlay">
                      <div className="member-social">
                        <a href="#"><FaLinkedinIn /></a>
                        <a href="#"><FaTwitter /></a>
                      </div>
                    </div>
                  </div>
                  <h4>Mike Johnson</h4>
                  <p>IoT Specialist</p>
                </div>
              </div>
              <div className="team-content reveal">
                <p>Our diverse team brings together expertise in technology, design, and user experience.
                   We're united by our mission to make home automation accessible and beneficial for everyone.</p>
              </div>
            </div>
          </Parallax>
        </div>

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
                <a
                  className='social-icon-link facebook'
                  href='https://facebook.com'
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label='Facebook'
                >
                  <FaFacebookF />
                </a>
                <a
                  className='social-icon-link instagram'
                  href='https://instagram.com'
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label='Instagram'
                >
                  <FaInstagram />
                </a>
                <a
                  className='social-icon-link youtube'
                  href='https://youtube.com'
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label='Youtube'
                >
                  <FaYoutube />
                </a>
                <a
                  className='social-icon-link twitter'
                  href='https://twitter.com'
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label='Twitter'
                >
                  <FaTwitter />
                </a>
                <a
                  className='social-icon-link linkedin'
                  href='https://linkedin.com'
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label='LinkedIn'
                >
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