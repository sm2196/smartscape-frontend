import React, { useState } from "react";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaFacebookF, FaInstagram, FaYoutube, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./SMContactMe.css";
import "../../layout/Footer/SMFooter.css";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [submitStatus, setSubmitStatus] = useState({
    submitted: false,
    success: false,
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.name || !formData.email || !formData.message) {
      setSubmitStatus({
        submitted: true,
        success: false,
        message: "Please fill in all required fields.",
      });
      return;
    }

    // Here you would typically send the form data to your backend
    try {
      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSubmitStatus({
        submitted: true,
        success: true,
        message: "Thank you for your message. We will get back to you soon!",
      });

      // Clear form
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      setSubmitStatus({
        submitted: true,
        success: false,
        message: "Something went wrong. Please try again later.",
      });
    }
  };

  return (
    <div className="SMcontact-page">
      {/* Hero Split Section */}
      <div className="SMcontact-hero-split">
        <div className="SMcontact-hero-left">
          <div className="SMcontact-hero-content">
            <div className="SMcontact-hero-title">CONTACT</div>
            <div className="SMcontact-hero-title">US</div>
            <div className="SMcontact-hero-text">
              <p>
                Get in touch with our team for any inquiries or support. We are
                here to help you with all your smart home needs.
              </p>
            </div>
          </div>
        </div>
        <div className="SMcontact-hero-right">
          <div className="SMcontact-hero-gradient"></div>
        </div>
      </div>

      <div className="SMcontact-content">
        <div className="SMcontact-info-grid">
          <div className="SMcontact-info-card">
            <FaPhone className="SMcontact-icon" />
            <h3>Phone</h3>
            <p>+971 50 123 4567</p>
            <p>+971 4 123 4567</p>
          </div>
          <div className="SMcontact-info-card">
            <FaEnvelope className="SMcontact-icon" />
            <h3>Email</h3>
            <p>info@smartscape.ae</p>
            <p>support@smartscape.ae</p>
          </div>
          <div className="SMcontact-info-card">
            <FaMapMarkerAlt className="SMcontact-icon" />
            <h3>Location</h3>
            <p>Dubai Silicon Oasis</p>
            <p>Dubai, UAE</p>
          </div>
          <div className="SMcontact-info-card">
            <FaClock className="SMcontact-icon" />
            <h3>Working Hours</h3>
            <p>Mon - Fri: 9:00 AM - 6:00 PM</p>
            <p>Sat: 10:00 AM - 2:00 PM</p>
          </div>
        </div>

        <div className="SMcontact-form-container">
          <h2>Send us a Message</h2>
          <form onSubmit={handleSubmit} className="SMcontact-form">
            <div className="SMform-group">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name *"
                required
              />
            </div>
            <div className="SMform-group">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email *"
                required
              />
            </div>
            <div className="SMform-group">
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Your Phone"
              />
            </div>
            <div className="SMform-group">
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Subject"
              />
            </div>
            <div className="SMform-group">
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your Message *"
                required
                rows="6"
              ></textarea>
            </div>
            <button type="submit" className="submit-btn">
              Send Message
            </button>
            {submitStatus.submitted && (
              <div
                className={`submit-message ${
                  submitStatus.success ? "success" : "error"
                }`}
              >
                {submitStatus.message}
              </div>
            )}
          </form>
        </div>

        <div className="SMcontact-map">
          <iframe
            title="SmartScape Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.178787593566!2d55.37246931501224!3d25.185305983896973!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f61c8f8f3b6ef%3A0x6f7f0937b5b38967!2sDubai%20Silicon%20Oasis!5e0!3m2!1sen!2sae!4v1647887774745!5m2!1sen!2sae"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </div>

      {/* Footer */}
      <div className="SMfooter-container">
        <div className="SMfooter-subscription">
          <h1 className="SMfooter-subscription-heading">
            Join our newsletter to know us better
          </h1>
          <p className="SMfooter-subscription-text">
            Stay updated with our latest smart home solutions
          </p>
          <div className="input-areas">
            <form>
              <input
                className="SMfooter-input"
                name="email"
                type="email"
                placeholder="Your Email"
              />
              <div className="SMfooter-button-wrapper">
                <button type="submit">
                  <span>Subscribe</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="SMfooter-links">
          <div className="SMfooter-link-wrapper">
            <div className="SMfooter-link-items">
              <h2>About Us</h2>
              <Link to="/">How it works</Link>
              <Link to="/">Why choose us</Link>
              <Link to="/">Testimonials</Link>
              <Link to="/">Careers</Link>
            </div>
            <div className="SMfooter-link-items">
              <h2>Contact Us</h2>
              <Link to="/">Contact</Link>
              <Link to="/">Support</Link>
              <Link to="/">Customer Care</Link>
              <Link to="/">Technical Help</Link>
            </div>
          </div>
          <div className="SMfooter-link-wrapper">
            <div className="SMfooter-link-items">
              <h2>Resources</h2>
              <Link to="/">Submit Video</Link>
              <Link to="/">Ambassadors</Link>
              <Link to="/">FAQ</Link>
              <Link to="/">Blog</Link>
            </div>
            <div className="SMfooter-link-items">
              <h2>Connect</h2>
              <Link to="/">Instagram</Link>
              <Link to="/">Facebook</Link>
              <Link to="/">Youtube</Link>
              <Link to="/">Twitter</Link>
            </div>
          </div>
        </div>

        <section className="social-media">
          <div className="social-media-wrap">
            <div className="social-icons">
              <a
                className="social-icon-link facebook"
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <FaFacebookF />
              </a>
              <a
                className="social-icon-link instagram"
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
              <a
                className="social-icon-link youtube"
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Youtube"
              >
                <FaYoutube />
              </a>
              <a
                className="social-icon-link twitter"
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
              >
                <FaTwitter />
              </a>
              <a
                className="social-icon-link linkedin"
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn />
              </a>
            </div>
          </div>
        </section>
        <div className="website-rights">
          <p>SmartScape © {new Date().getFullYear()} | All Rights Reserved</p>
        </div>
      </div>
    </div>
  );
}

export default Contact;