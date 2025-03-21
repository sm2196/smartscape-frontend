import React, { useEffect } from "react";
import { Parallax } from "react-scroll-parallax";
import "./SMAboutUsPage.css";
import "../Footer/SMFooter.css";
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
  FaEnvelope,
} from "react-icons/fa";
import SMfooter from "../Footer/SMFooter";

function AboutUsPage() {
  useEffect(() => {
    const handleScroll = () => {
      const reveals = document.querySelectorAll(".reveal");
      reveals.forEach((element) => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;

        if (elementTop < windowHeight - elementVisible) {
          element.classList.add("active");
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="SMaboutus-page-container">
      {/* Hero Split Section */}
      <div className="SMhero-split">
        <div className="SMhero-left">
          <div className="SMhero-content">
            <div className="SMhero-title">WHO</div>
            <div className="SMhero-title">WE ARE</div>
            <div className="SMhero-text">
              <p>
                Founded in 2024, SmartScape emerged from a vision to transform
                how we interact with our living spaces. We believe in thoughtful
                innovation, taking time to perfect every detail and create
                unique solutions that enhance daily life.
              </p>
              <p>
                Our smart home solutions are crafted individually with care,
                ensuring each implementation is unique to the user. Every system
                we design is a limited edition, tailored to fit perfectly with
                each home and lifestyle, making it truly one of a kind.
              </p>
            </div>
          </div>
        </div>
        <div className="SMhero-right">
          <div className="SMhero-gradient"></div>
        </div>
      </div>

      {/* Mission Section */}
      <Parallax translateY={[-15, 15]} className="SMaboutus-mission-section">
        <div className="SMmission-content reveal">
          <div className="SMmission-text">
            <h2>OUR MISSION</h2>
            <h3>Redefining Smart Living</h3>
            <p>
              Founded in 2024, SmartScape emerged from a simple yet powerful
              idea: to make smart home technology accessible, intuitive, and
              beneficial for everyone. Our journey began when a group of tech
              enthusiasts and home automation experts came together with a
              shared vision of transforming how people interact with their
              living spaces.
            </p>
          </div>
          <div className="SMmission-image">
            <img src="/bluebg2.jpg" alt="Smart Home Technology" />
          </div>
        </div>
      </Parallax>

      {/* Values Section */}
      <section className="SMaboutus-values-section">
        <h2 className="SMvalues-title reveal">Our Core Values</h2>
        <div className="SMaboutus-grid">
          <Parallax
            translateY={[-10, 10]}
            className="SMaboutus-grid-item reveal"
          >
            <div className="SMgrid-icon-wrapper">
              <FaLightbulb className="SMgrid-icon" />
            </div>
            <h3>Innovation</h3>
            <p>
              We continuously push the boundaries of what's possible in home
              automation, developing cutting-edge solutions that anticipate and
              meet our customers' needs.
            </p>
          </Parallax>
          <Parallax
            translateY={[-5, 15]}
            className="SMaboutus-grid-item reveal"
          >
            <div className="SMgrid-icon-wrapper">
              <FaLeaf className="SMgrid-icon" />
            </div>
            <h3>Sustainability</h3>
            <p>
              Our smart home solutions are designed with environmental
              consciousness in mind, helping reduce energy consumption and
              minimize environmental impact.
            </p>
          </Parallax>
          <Parallax
            translateY={[-15, 5]}
            className="SMaboutus-grid-item reveal"
          >
            <div className="SMgrid-icon-wrapper">
              <FaShieldAlt className="SMgrid-icon" />
            </div>
            <h3>Security</h3>
            <p>
              We prioritize the safety and privacy of our users, implementing
              robust security measures in all our products and services.
            </p>
          </Parallax>
          <Parallax
            translateY={[-10, 10]}
            className="SMaboutus-grid-item reveal"
          >
            <div className="SMgrid-icon-wrapper">
              <FaHeadset className="SMgrid-icon" />
            </div>
            <h3>Support</h3>
            <p>
              Our dedicated team provides comprehensive support to ensure our
              customers get the most out of their smart home experience.
            </p>
          </Parallax>
        </div>
      </section>

      {/* Vision Section */}
      <Parallax translateY={[-15, 15]} className="SMaboutus-vision-section">
        <div className="SMvision-wrapper reveal">
          <div className="SMvision-content">
            <div className="SMvision-text">
              <h2>OUR VISION</h2>
              <h3>Creating Tomorrow's Homes Today</h3>
              <p>
                At SmartScape, we envision a future where every home device is
                connected and effortlessly smart. Our smart home app puts
                control at your fingertips, allowing you to manage all your
                devices with ease.
              </p>
              <div className="SMvision-stats">
                <div className="SMstat-item">
                  <span className="SMstat-number">100+</span>
                  <span className="SMstat-label">Smart Devices</span>
                </div>
                <div className="SMstat-item">
                  <span className="SMstat-number">50k+</span>
                  <span className="SMstat-label">Happy Users</span>
                </div>
                <div className="SMstat-item">
                  <span className="SMstat-number">24/7</span>
                  <span className="SMstat-label">Support</span>
                </div>
              </div>
            </div>
            <div className="SMvision-image">
              <img src="/try2.jpg" alt="Future Smart Home" />
            </div>
          </div>
        </div>
      </Parallax>

      {/* Team Section */}
      <section className="SMaboutus-team-section">
        <div className="SMteam-wrapper reveal">
          <div className="SMteam-header">
            <h2>OUR TEAM</h2>
            <h3>Meet the Innovators</h3>
            <p>Driven by passion, powered by innovation</p>
          </div>
          <div className="SMteam-grid">
            <div className="SMteam-member reveal">
              <div className="SMmember-image">
                <img src="/humanicon.png" alt="Team Member" />
                <div className="SMmember-overlay">
                  <div className="SMmember-social">
                    <a href="#">
                      <FaLinkedinIn />
                    </a>
                    <a href="mailto: @sm2196@hw.ac.uk">
                      <FaEnvelope />
                    </a>
                  </div>
                </div>
              </div>
              <h4>Swapna Manikandan</h4>
              <p>Developer</p>
            </div>
            <div className="SMteam-member reveal">
              <div className="SMmember-image">
                <img src="/humanicon.png" alt="Team Member" />
                <div className="SMmember-overlay">
                  <div className="SMmember-social">
                    <a href="#">
                      <FaLinkedinIn />
                    </a>
                    <a href="mailto: @rs2095@hw.ac.uk">
                      <FaEnvelope />
                    </a>
                  </div>
                </div>
              </div>
              <h4>Rushaan Sahrush</h4>
              <p>Developer</p>
            </div>
            <div className="SMteam-member reveal">
              <div className="SMmember-image">
                <img src="/humanicon.png" alt="Team Member" />
                <div className="SMmember-overlay">
                  <div className="SMmember-social">
                    <a href="#">
                      <FaLinkedinIn />
                    </a>
                    <a href="mainto: @ap2092@hw.ac.uk">
                      <FaEnvelope />
                    </a>
                  </div>
                </div>
              </div>
              <h4>Abhijith Pattali</h4>
              <p>Developer</p>
            </div>
            <div className="SMteam-member reveal">
              <div className="SMmember-image">
                <img src="/humanicon.png" alt="Team Member" />
                <div className="SMmember-overlay">
                  <div className="SMmember-social">
                    <a href="#">
                      <FaLinkedinIn />
                    </a>
                    <a href="mailto: @mk2081@hw.ac.uk">
                      <FaEnvelope />
                    </a>
                  </div>
                </div>
              </div>
              <h4>Hamza Khan</h4>
              <p>Developer</p>
            </div>
            <div className="SMteam-member reveal">
              <div className="SMmember-image">
                <img src="/KaranPic.jpg" alt="Team Member" />
                <div className="SMmember-overlay">
                  <div className="SMmember-social">
                    <a href="#">
                      <FaLinkedinIn />
                    </a>
                    <a href="mailto: @kc2045@hw.ac.uk">
                      <FaEnvelope />
                    </a>
                  </div>
                </div>
              </div>
              <h4>Karan Chawla</h4>
              <p>Developer</p>
            </div>
            <div className="SMteam-member reveal">
              <div className="SMmember-image">
                <img src="/humanicon.png" alt="Team Member" />
                <div className="SMmember-overlay">
                  <div className="SMmember-social">
                    <a href="#">
                      <FaLinkedinIn />
                    </a>
                    <a href="mailto: @sv2019@hw.ac.uk">
                      <FaEnvelope />
                    </a>
                  </div>
                </div>
              </div>
              <h4>Sneha Vijayan</h4>
              <p>Developer</p>
            </div>
            <div className="SMteam-member reveal">
              <div className="SMmember-image">
                <img src="/humanicon.png" alt="Team Member" />
                <div className="SMmember-overlay">
                  <div className="SMmember-social">
                    <a href="#">
                      <FaLinkedinIn />
                    </a>
                    <a href="mailto: @hs2072@hw.ac.uk">
                      <FaEnvelope />
                    </a>
                  </div>
                </div>
              </div>
              <h4>Hari Govind</h4>
              <p>Developer</p>
            </div>
            <div className="SMteam-member reveal">
              <div className="SMmember-image">
                <img src="/Salimpic.jpg" alt="Team Member" />
                <div className="SMmember-overlay">
                  <div className="SMmember-social">
                    <a href="#">
                      <FaLinkedinIn />
                    </a>
                    <a href="mailto: @as2241@hw.ac.uk">
                      <FaEnvelope />
                    </a>
                  </div>
                </div>
              </div>
              <h4>Salim</h4>
              <p>Developer</p>
            </div>
            <div className="SMteam-member reveal">
              <div className="SMmember-image">
                <img src="/humanicon.png" alt="Team Member" />
                <div className="SMmember-overlay">
                  <div className="SMmember-social">
                    <a href="#">
                      <FaLinkedinIn />
                    </a>
                    <a href="mailto: @mh2054@hw.ac.uk">
                      <FaEnvelope />
                    </a>
                  </div>
                </div>
              </div>
              <h4>Hamza Food</h4>
              <p>Developer</p>
            </div>
          </div>
        </div>
      </section>
      <SMfooter />
    </div>
  );
}

export default AboutUsPage;