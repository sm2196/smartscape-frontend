import React, { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import './ContactMe.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [submitStatus, setSubmitStatus] = useState({
    submitted: false,
    success: false,
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.name || !formData.email || !formData.message) {
      setSubmitStatus({
        submitted: true,
        success: false,
        message: 'Please fill in all required fields.'
      });
      return;
    }

    // Here you would typically send the form data to your backend
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSubmitStatus({
        submitted: true,
        success: true,
        message: 'Thank you for your message. We will get back to you soon!'
      });

      // Clear form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      setSubmitStatus({
        submitted: true,
        success: false,
        message: 'Something went wrong. Please try again later.'
      });
    }
  };

  return (
    <div className="contact-page">
      {/* Hero Split Section */}
      <div className="contact-hero-split">
        <div className="contact-hero-left">
          <div className="contact-hero-content">
            <div className="contact-hero-title">CONTACT</div>
            <div className="contact-hero-title">US</div>
            <div className="contact-hero-text">
              <p>
                Get in touch with our team for any inquiries or support. We are here to help you with all your smart home needs.
              </p>
            </div>
          </div>
        </div>
        <div className="contact-hero-right">
          <div className="contact-hero-gradient"></div>
        </div>
      </div>

      <div className="contact-content">
        <div className="contact-info-grid">
          <div className="contact-info-card">
            <FaPhone className="contact-icon" />
            <h3>Phone</h3>
            <p>+971 50 123 4567</p>
            <p>+971 4 123 4567</p>
          </div>
          <div className="contact-info-card">
            <FaEnvelope className="contact-icon" />
            <h3>Email</h3>
            <p>info@smartscape.ae</p>
            <p>support@smartscape.ae</p>
          </div>
          <div className="contact-info-card">
            <FaMapMarkerAlt className="contact-icon" />
            <h3>Location</h3>
            <p>Dubai Silicon Oasis</p>
            <p>Dubai, UAE</p>
          </div>
          <div className="contact-info-card">
            <FaClock className="contact-icon" />
            <h3>Working Hours</h3>
            <p>Mon - Fri: 9:00 AM - 6:00 PM</p>
            <p>Sat: 10:00 AM - 2:00 PM</p>
          </div>
        </div>

        <div className="contact-form-container">
          <h2>Send us a Message</h2>
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name *"
                required
              />
            </div>
            <div className="form-group">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Your Email *"
                required
              />
            </div>
            <div className="form-group">
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Your Phone"
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Subject"
              />
            </div>
            <div className="form-group">
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
              <div className={`submit-message ${submitStatus.success ? 'success' : 'error'}`}>
                {submitStatus.message}
              </div>
            )}
          </form>
        </div>

        <div className="contact-map">
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
    </div>
  );
}

export default Contact;