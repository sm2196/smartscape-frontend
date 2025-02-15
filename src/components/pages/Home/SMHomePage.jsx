import React, { useEffect, useState } from "react";
import { Parallax } from "react-scroll-parallax";
import "../../../app/App.css";
import "../../sections/SMHomeHeroSection.css";
import "../../sections/SMAboutUsHome.css";
import "../../sections/SMHowItWorks.css";
import "../../sections/SMParallax.css";
import { Link } from 'react-router-dom';
import '../../sections/SMCards.css';
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
import '../../sections/SMAmbassador.css';
import '../../layout/Footer/SMFooter.css';

const MainPicSection = () => {
  return (
    <Parallax translateY={[-20, 20]} className="SMMainPic-container">
      <h1><span>YOUR HOME AT YOUR FINGERTIPS</span></h1>
      <div className="SM-joinButton-us-wrapper">
        <button><span>Register today</span></button>
      </div>
    </Parallax>
  );
};

const AboutUs = () => {
  return (
    <div className="SM-about-us-container">
      <Parallax translateY={[-15, 15]} className="SM-about-us-content">
        <div className="SM-about-us-image">
          <img src="/bluebg1.jpg" alt="Smart Home" />
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
      const title = document.querySelector(".SM-flow-title");
      const subtitle = document.querySelector(".SM-flow-subtitle");

      const isElementInView = (element) => {
        const rect = element.getBoundingClientRect();
        return (rect.top <= (window.innerHeight * 0.85) && rect.bottom >= 0);
      };

      if (title && isElementInView(title)) {
        title.classList.add("SM-visible");
      }

      if (subtitle && isElementInView(subtitle)) {
        subtitle.classList.add("SM-visible");
      }

      items.forEach((item, index) => {
        if (isElementInView(item)) {
          item.classList.add("SM-visible");
          item.style.transitionDelay = `${index * 0.2}s`;
        }
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const steps = [
    {
      icon: <FaUserPlus />,
      title: "Register",
      description: "Begin your smart home journey with a simple registration process. Join our community of tech-savvy homeowners."
    },
    {
      icon: <FaFileAlt />,
      title: "Upload Documents",
      description: "Securely submit your verification documents through our encrypted platform."
    },
    {
      icon: <FaCheckCircle />,
      title: "Verification",
      description: "Our expert team carefully verifies your information to ensure the highest security standards."
    },
    {
      icon: <FaCogs />,
      title: "Configuration",
      description: "Customize your smart home settings with our intuitive setup wizard and expert guidance."
    },
    {
      icon: <FaMobileAlt />,
      title: "Manage",
      description: "Take full control of your smart home from anywhere using our powerful mobile application."
    },
  ];

  return (
    <div className="SM-parallax-wrapper">
      <div className="SM-process-flow">
        <div className="SM-flow-title">
          <span>How It Works</span>
        </div>
        <p className="SM-flow-subtitle">
          Transform your home into a smart haven with our simple step-by-step process.
          Experience the future of home automation with SmartScape.
        </p>
        <div className="SM-flow-timeline">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`SM-flow-item ${index % 2 === 0 ? "SM-left" : "SM-right"}`}
            >
              <div className="SM-flow-icon">{step.icon}</div>
              <div className="SM-flow-content">
                <h3 className="SM-flow-title-item">{step.title}</h3>
                <p className="SM-flow-description">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Cards = () => {
  return (
    <Parallax translateY={[-15, 15]} className='SMcards'>
      <h1><span>What's special about us?</span></h1>
      <div className='SMcards__container'>
        <div className='SMcards__wrapper'>
          <div className='SMcards__item'>
            <Link className='SMcards__item__link' to='/services'>
              <figure className='SMcards__item__pic-wrap' data-category='1'>
                <img className='SMcards__item__img' alt='Smart Home' src='/bulb.jpg' />
              </figure>
              <div className='SMcards__item__info'>
                <h5 className='SMcards__item__text'>Monitor your electricity consumption... and Your home</h5>
              </div>
            </Link>
          </div>
          <div className='SMcards__item'>
            <Link className='SMcards__item__link' to='/services'>
              <figure className='SMcards__item__pic-wrap' data-category='2'>
                <img className='SMcards__item__img' alt='Smart Device' src='/device.jpg' />
              </figure>
              <div className='SMcards__item__info'>
                <h5 className='SMcards__item__text'>Save your bills. Turn off devices during peak hours.</h5>
              </div>
            </Link>
          </div>
          <div className='SMcards__item'>
            <Link className='SMcards__item__link' to='/services'>
              <figure className='SMcards__item__pic-wrap' data-category='3'>
                <img className='SMcards__item__img' alt='Control' src='/control.jpg' />
              </figure>
              <div className='SMcards__item__info'>
                <h5 className='SMcards__item__text'>Control all your devices on the run.</h5>
              </div>
            </Link>
          </div>
          <div className='SMcards__item'>
            <Link className='SMcards__item__link' to='/products'>
              <figure className='SMcards__item__pic-wrap' data-category='4'>
                <img className='SMcards__item__img' alt='Security' src='/cam.jpg' />
              </figure>
              <div className='SMcards__item__info'>
                <h5 className='SMcards__item__text'>Watch for intruders!</h5>
              </div>
            </Link>
          </div>
          <div className='SMcards__item'>
            <Link className='SMcards__item__link' to='/sign-up'>
              <figure className='SMcards__item__pic-wrap' data-category='5'>
                <img className='SMcards__item__img' alt='Emergency' src='/off.jpg' />
              </figure>
              <div className='SMcards__item__info'>
                <h5 className='SMcards__item__text'>Emergency shutdown and Do Not Disturb modes</h5>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </Parallax>
  );
};

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
    <div className="SMambassador-section">
      <Parallax translateY={[-20, 20]} className="SMambassador-form-wrapper">
        <div className="SMambassador-form-container">
          <form className="SMambassador-form" onSubmit={handleSubmit}>
            <h2 className="SMambassador-heading">
              Become a SmartScape Ambassador
              <div className="SMambassador-heading-underline"></div>
            </h2>
            <p className="SMambassador-subtitle">
              Join our community of smart home enthusiasts and help others transform their living spaces
            </p>
            <div className="SMform-group">
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Full Name"
                required
              />
            </div>
            <div className="SMform-group">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                required
              />
            </div>
            <div className="SMform-group">
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                required
              />
            </div>
            <div className="SMform-group">
              <input
                type="text"
                name="socialMedia"
                value={formData.socialMedia}
                onChange={handleChange}
                placeholder="Social Media Handles"
              />
            </div>
            <div className="SMform-group">
              <textarea
                name="about"
                value={formData.about}
                onChange={handleChange}
                placeholder="Tell us about yourself..."
                required
              />
            </div>
            <div className="SM-AmbassadorButton-wrapper">
              <button type="submit">
                <span>Submit Application</span>
              </button>
            </div>
          </form>
        </div>
      </Parallax>
    </div>
  );
};

const SMfooter = () => {
  return (
    <div className='SMfooter-container'>
      <div className='SMfooter-subscription'>
        <h1 className='SMfooter-subscription-heading'>
          Join our newsletter to know us better
        </h1>
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
              <button type='submit'>
                <span>Subscribe</span>
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className='SMfooter-links'>
        <div className='SMfooter-link-wrapper'>
          <div className='SMfooter-link-items'>
            <h2>About Us</h2>
            <Link to='/'>How it works</Link>
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
};

function Home() {
  return (
    <div className="home-container">
      <MainPicSection />
      <AboutUs />
      <HowItWorks />
      <Cards />
      <AmbassadorForm />
      <SMfooter />
    </div>
  );
}

export default Home;