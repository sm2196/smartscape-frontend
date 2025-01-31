import React from 'react';
import './AboutUsPage.css';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaYoutube, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import '../SMFooter.css';

function AboutUsPage() {
  return (
    <>
      <div className="aboutus-page-container">
        <div className="aboutus-hero">
          <h1>About SmartScape</h1>
          <p>Transforming homes into intelligent living spaces</p>
        </div>

        <div className="aboutus-content">
          <section className="aboutus-section">
            <h2>Our Story</h2>
            <p>Founded in 2024, SmartScape emerged from a simple yet powerful idea: to make smart home technology accessible, intuitive, and beneficial for everyone. Our journey began when a group of tech enthusiasts and home automation experts came together with a shared vision of transforming how people interact with their living spaces.</p>
          </section>

          <section className="aboutus-section">
            <h2>Our Mission</h2>
            <p>At SmartScape, we're committed to revolutionizing home automation by creating intelligent, user-friendly solutions that enhance comfort, security, and energy efficiency. Our mission is to empower homeowners with technology that makes their lives simpler, safer, and more sustainable.</p>
          </section>

          <section className="aboutus-section">
            <div className="aboutus-grid">
              <div className="aboutus-grid-item">
                <h3>Innovation</h3>
                <p>We continuously push the boundaries of what's possible in home automation, developing cutting-edge solutions that anticipate and meet our customers' needs.</p>
              </div>
              <div className="aboutus-grid-item">
                <h3>Sustainability</h3>
                <p>Our smart home solutions are designed with environmental consciousness in mind, helping reduce energy consumption and minimize environmental impact.</p>
              </div>
              <div className="aboutus-grid-item">
                <h3>Security</h3>
                <p>We prioritize the safety and privacy of our users, implementing robust security measures in all our products and services.</p>
              </div>
              <div className="aboutus-grid-item">
                <h3>Support</h3>
                <p>Our dedicated team provides comprehensive support to ensure our customers get the most out of their smart home experience.</p>
              </div>
            </div>
          </section>

          <section className="aboutus-section">
            <h2>Our Team</h2>
            <p>SmartScape is powered by a diverse team of experts in technology, design, and customer service. We bring together years of experience in home automation, software development, and user experience design to create solutions that truly make a difference in people's lives.</p>
          </section>

          <section className="aboutus-section">
            <h2>Join Our Journey</h2>
            <p>Whether you're a homeowner looking to upgrade your living space or a technology enthusiast interested in the future of home automation, we invite you to be part of our growing community. Together, we're building the homes of tomorrow, today.</p>
          </section>
        </div>
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
    </>
  );
}

export default AboutUsPage;