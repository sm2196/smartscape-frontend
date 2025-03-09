import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./SMNavbar.css";
import { FaBars, FaTimes, FaSearch } from "react-icons/fa";
import SMIcons from "./SMNavIcons";

function SMNavbar() {
  const [SMclick, setSMClick] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchNotFound, setSearchNotFound] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setSMClick(!SMclick);
  };

  const closeMobileMenu = () => {
    setSMClick(false);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setSearchNotFound(false); // Reset search not found state on input change
  };

  const highlightAndScrollToSearchTerm = (term) => {
    const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    let node;
    while (node = walk.nextNode()) {
      const index = node.nodeValue.toLowerCase().indexOf(term.toLowerCase());
      if (index !== -1) {
        const span = document.createElement('span');
        span.className = 'highlight';
        const highlightedText = node.splitText(index);
        highlightedText.splitText(term.length);
        span.appendChild(highlightedText.cloneNode(true));
        highlightedText.parentNode.replaceChild(span, highlightedText);
        span.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Remove highlight after 2 seconds
        setTimeout(() => {
          span.classList.remove('highlight');
        }, 2000);

        break;
      }
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Check if the search query matches any content on the current page
      const content = document.body.innerText.toLowerCase();
      if (content.includes(searchQuery.toLowerCase())) {
        // Highlight and scroll to the first occurrence of the search term
        highlightAndScrollToSearchTerm(searchQuery);
      } else {
        setSearchNotFound(true);
        navigate(`/faq?query=${searchQuery}`);
        setTimeout(() => {
          setSearchNotFound(false);
        }, 3000); // Hide the message after 3 seconds
      }
      setSearchQuery("");
      closeMobileMenu();
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector('.SMheader');
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="SMheader">
      <div className="SMcontainer">
        <nav>
          <Link to="/" className="SMnavbar-logo" onClick={closeMobileMenu}>
            <img src="/Logo.png" alt="Logo" className="SMnavbar-logo-image" />
          </Link>

          <ul className={SMclick ? "SMnav-link active" : "SMnav-link"}>
            <li>
              <Link
                to="/"
                className={`SMa ${location.pathname === "/" ? "SMactive" : ""}`}
                onClick={closeMobileMenu}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className={`SMa ${location.pathname === "/about" ? "SMactive" : ""}`}
                onClick={closeMobileMenu}
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/services"
                className={`SMa ${location.pathname === "/services" ? "SMactive" : ""}`}
                onClick={closeMobileMenu}
              >
                Services
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className={`SMa ${location.pathname === "/contact" ? "SMactive" : ""}`}
                onClick={closeMobileMenu}
              >
                Contact Me
              </Link>
            </li>
            <li>
              <Link
                to="/faq"
                className={`SMa ${location.pathname === "/faq" ? "SMactive" : ""}`}
                onClick={closeMobileMenu}
              >
                FAQ
              </Link>
            </li>
          </ul>

          <div className="SMnavbar-right">
            <form className="SMsearch-form" onSubmit={handleSearchSubmit}>
              <input
                type="text"
                className="SMsearch-input"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <button type="submit" className="SMsearch-button">
                <FaSearch />
              </button>
            </form>
            {searchNotFound && (
              <div className="SMsearch-not-found">
                <p>Search not found</p>
              </div>
            )}
            <SMIcons />
            <div
              className="SMmenu-icon"
              onClick={toggleMenu}
              aria-label={SMclick ? "Close menu" : "Open menu"}
              role="button"
              tabIndex={0}
            >
              {SMclick ? <FaTimes /> : <FaBars />}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default SMNavbar;