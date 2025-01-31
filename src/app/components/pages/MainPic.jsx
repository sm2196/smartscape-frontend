import React, { useEffect, useState } from "react";
import { Parallax } from "react-scroll-parallax";
import "../../App.css";
import "../MainPic.css";
import "../AboutUsHome.css";
import "./JoinUs.css";
import "../HowItWorks.css";
import "../Parallax.css";
import { Link } from 'react-router-dom';
import '../Cards.css';
import {
  FaUserPlus,
  FaFileAlt,
  FaCheckCircle,
  FaCogs,
  FaMobileAlt,
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaTwitter,
  FaLinkedinIn
} from "react-icons/fa";
import '../Ambassador.css';
import '../SMFooter.css';
import JoinUs from './JoinUs';

const MainPicSection = () => {
  return (
    <Parallax translateY={[-20, 20]} className="SMMainPic-container">
      <h1><span>YOUR HOME AT YOUR FINGERTIPS</span></h1>
      <JoinUs />
    </Parallax>
  );
};

const AboutUs = () => {
  return (
    <div className="SM-about-us-container">
      <Parallax translateY={[-15, 15]} className="SM-about-us-content">
        <div className="SM-about-us-image">
          <img src="/bg2.jpg" alt="Smart Home" />
        </div>
        <div className="SM-about-us-text">
          <h2>About Us</h2>
          <h3>Innovative Solution for a Smarter, Simpler & Greener Home</h3>
          <p>
            At SmartScape, we're revolutionizing the way you live by transforming your home into a smarter, more sustainable space. From monitoring your energy and water usage to enhancing security and reducing environmental impact, we empower you to take control of your home effortlessly.
          </p>
          <div className="SM-AboutButton-us-wrapper">
            <button><span>Read More</span></button>
          </div>
        </div>
      </Parallax>
    </div>
  );
};

const HowItWorks = () => {
  useEffect(() => {
    const handleScroll = () => {
      const items = document.querySelectorAll(".SM-flow-item");
      items.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const isVisible = (
          rect.top <= (window.innerHeight * 0.85) &&
          rect.bottom >= 0
        );
        if (isVisible) {
          item.classList.add("SM-visible");
        }
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const steps = [
    { icon: <FaUserPlus />, title: "Register", description: "Sign up for an account to begin your journey." },
    { icon: <FaFileAlt />, title: "Upload Documents", description: "Submit required documents for verification." },
    { icon: <FaCheckCircle />, title: "Verification", description: "Our team verifies your details for security." },
    { icon: <FaCogs />, title: "Configuration", description: "Customize your settings and preferences." },
    { icon: <FaMobileAlt />, title: "Manage", description: "Control everything seamlessly from your device." },
  ];

  return (
    <Parallax translateY={[-10, 10]} className="SM-parallax-wrapper">
      <div className="SM-parallax-background">
        <div className="SM-process-flow">
          <h1 className="SM-flow-title"><span>How It Works</span></h1>
          <p className="SM-flow-subtitle">Follow these simple steps to get started and make the most of our platform.</p>
          <div className="SM-flow-timeline">
            {steps.map((step, index) => (
              <Parallax
                key={index}
                translateX={[index % 2 === 0 ? -10 : 10, 0]}
                className={`SM-flow-item ${index % 2 === 0 ? "SM-left" : "SM-right"}`}
              >
                <div className="SM-flow-icon">{step.icon}</div>
                <div className="SM-flow-content">
                  <h3 className="SM-flow-title-item">{step.title}</h3>
                  <p className="SM-flow-description">{step.description}</p>
                </div>
              </Parallax>
            ))}
          </div>
        </div>
      </div>
    </Parallax>
  );
};

function CardItem(props) {
  return (
    <div className='SMcards__item'>
      <Link className='SMcards__item__link' to={props.path}>
        <figure className='SMcards__item__pic-wrap' data-category={props.label}>
          <img
            className='SMcards__item__img'
            alt='Feature Image'
            src={props.src}
          />
        </figure>
        <div className='SMcards__item__info'>
          <h5 className='SMcards__item__text'>{props.text}</h5>
        </div>
      </Link>
    </div>
  );
}

function Cards() {
  return (
    <Parallax translateY={[-15, 15]} className='SMcards'>
      <h1><span>What's special about us?</span></h1>
      <div className='SMcards__container'>
        <div className='SMcards__wrapper'>
          <CardItem
            src='/bulb.jpg'
            text='Monitor your electricity consumption... and Your home'
            label='1'
            path='/services'
          />
          <CardItem
            src='/device.jpg'
            text='Save your bills. Turn off devices during peak hours.'
            label='2'
            path='/services'
          />
          <CardItem
            src='/control.jpg'
            text='Control all your devices on the run.'
            label='3'
            path='/services'
          />
          <CardItem
            src='/cam.jpg'
            text='Watch for intruders!'
            label='4'
            path='/products'
          />
          <CardItem
            src='/off.jpg'
            text='Emergency shutdown and Do Not Disturb modes'
            label='5'
            path='/sign-up'
          />
        </div>
      </div>
    </Parallax>
  );
}

const AmbassadorForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    socialMedia: '',
    about: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="ambassador-section">
      <Parallax
        translateY={[-20, 20]}
        className="ambassador-form-wrapper"
        style={{ position: 'relative' }}
      >
        <div className="ambassador-form-container">
          <form className="ambassador-form" onSubmit={handleSubmit}>
            <h2 className="ambassador-heading">
              Become a SmartScape Ambassador
              <div className="ambassador-heading-underline"></div>
            </h2>
            <p className="ambassador-subtitle">
              Join our community of smart home enthusiasts and help others transform their living spaces.
            </p>
            <input
              className="ambassador-input"
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
            <input
              className="ambassador-input"
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              className="ambassador-input"
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            <input
              className="ambassador-input"
              type="text"
              name="socialMedia"
              placeholder="Social Media Handles"
              value={formData.socialMedia}
              onChange={handleChange}
            />
            <textarea
              className="ambassador-textarea"
              name="about"
              placeholder="Tell us about yourself"
              value={formData.about}
              onChange={handleChange}
              required
            ></textarea>
            <div className="ambassador-button-container">
              <div className="SM-AmbassadorButton-wrapper">
                <button type="submit">
                  <span>Become an ambassador</span>
                </button>
              </div>
              <div className="SM-AmbassadorButton-wrapper">
                <button type="button">
                  <span>Back to Home</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </Parallax>
    </div>
  );
};

function SMfooter() {
  return (
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
            <Link to='/sign-up'>How it works</Link>
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
  );
}

const Main = () => {
  return (
    <>
      <MainPicSection />
      <AboutUs />
      <HowItWorks />
      <Cards />
      <AmbassadorForm />
      <SMfooter />
    </>
  );
};

export default Main;