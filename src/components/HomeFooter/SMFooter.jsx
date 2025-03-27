"use client"
import Link from "next/link"
import { FaFacebookF, FaInstagram, FaYoutube, FaTwitter, FaLinkedinIn } from "react-icons/fa"
import "./SMFooter.css"

const SMfooter = () => {
  return (
    <div className="SMfooter-container">
      <div className="SMfooter-subscription">
        <h1 className="SMfooter-subscription-heading">Join our newsletter to know us better</h1>
        <p className="SMfooter-subscription-text">Stay updated with our latest smart home solutions</p>
        <div className="input-areas">
          <form>
            <input className="SMfooter-input" name="email" type="email" placeholder="Your Email" />
            <div className="SM-FooterButton-wrapper">
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
            <Link href="/about">How it works</Link>
            <Link href="/about">Testimonials</Link>
            <Link href="/about">Careers</Link>
          </div>
          <div className="SMfooter-link-items">
            <h2>Contact Us</h2>
            <Link href="/contact">Contact</Link>
            <Link href="/contact">Support</Link>
            <Link href="/contact">Customer Care</Link>
            <Link href="/contact">Technical Help</Link>
          </div>
        </div>
        <div className="SMfooter-link-wrapper">
          <div className="SMfooter-link-items">
            <h2>Resources</h2>
            <Link href="/">Submit Video</Link>
            <Link href="/">Ambassadors</Link>
            <Link href="/faq">FAQ</Link>
            <Link href="/">Blog</Link>
          </div>
          <div className="SMfooter-link-items">
            <h2>Connect</h2>
            <Link href="https://instagram.com/smartscape_grp15">Instagram</Link>
            <Link href="https://facebook.com">Facebook</Link>
            <Link href="https://youtube.com">Youtube</Link>
            <Link href="https://x.com">Twitter</Link>
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
              href="https://instagram.com/smartscape_grp15"
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
              href="https://x.com"
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
  )
}

export default SMfooter

