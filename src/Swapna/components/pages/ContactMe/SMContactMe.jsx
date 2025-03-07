@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');

.SMcontact-page {
  min-height: 100vh;
  background-color: #ffffff;
}

/* Hero Split Section */
.SMcontact-hero-split {
  display: flex;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

.SMcontact-hero-left {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 5rem;
  background: #ffffff;
  position: relative;
  z-index: 2;
}

.SMcontact-hero-content {
  max-width: 600px;
}

.SMcontact-hero-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 6rem;
  line-height: 1;
  font-weight: 700;
  color: #0A1630;
  margin-bottom: 0.5rem;
}

.SMcontact-hero-text {
  margin-top: 3rem;
}

.SMcontact-hero-text p {
  font-size: 1.2rem;
  line-height: 1.6;
  color: #666;
  margin-bottom: 1.5rem;
}

.SMcontact-hero-right {
  flex: 1;
  background: #0A1630;
  position: relative;
  overflow: hidden;
}

.SMcontact-hero-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 20% 20%, rgba(41, 98, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(41, 98, 255, 0.1) 0%, transparent 50%);
  animation: SMgradientMove 8s ease-in-out infinite alternate;
}

.SMcontact-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
}

.SMcontact-info-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  margin-bottom: 4rem;
}

.SMcontact-info-card {
  background: #fff;
  padding: 2rem;
  text-align: center;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.SMcontact-info-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.SMcontact-icon {
  font-size: 2rem;
  color: #212a3c;
  margin-bottom: 1rem;
}

.SMcontact-info-card h3 {
  color: #212a3c;
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
}

.SMcontact-info-card p {
  color: #666;
  font-size: 1rem;
}

.SMcontact-form-container {
  background: #fff;
  padding: 3rem;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.SMcontact-form-container h2 {
  text-align: center;
  color: #212a3c;
  margin-bottom: 2rem;
  font-size: 2rem;
}

.SMcontact-form {
  max-width: 800px;
  margin: 0 auto;
}

.SMform-group {
  margin-bottom: 1.5rem;
}

.SMform-group input,
.SMform-group textarea {
  width: 100%;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  font-family: "Roboto", serif;
  transition: border-color 0.3s ease;
}

.SMform-group input:focus,
.SMform-group textarea:focus {
  outline: none;
  border-color: #212a3c;
}

.SMsubmit-btn {
  width: 100%;
  padding: 1rem;
  background: #212a3c;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.SMsubmit-btn:hover {
  background: #1a2942;
  transform: translateY(-2px);
}

.SMsubmit-message {
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 5px;
  text-align: center;
}

.SMsubmit-message.success {
  background: #d4edda;
  color: #155724;
}

.SMsubmit-message.error {
  background: #f8d7da;
  color: #721c24;
}

/* Footer Styles */
.SMfooter-container {
  background: linear-gradient(180deg, #0A1630 0%, #1a2942 100%);
  padding: 4rem 0 2rem 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  margin-top: 0;
}

.SMfooter-subscription {
  text-align: center;
  max-width: 800px;
  margin: 0 auto 60px;
  padding: 0 20px;
}

.SMfooter-subscription-heading {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.SMfooter-subscription-text {
  font-size: 1.1rem;
  margin-bottom: 2rem;
  opacity: 0.8;
}

.SMinput-areas {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.SMfooter-input {
  padding: 15px 20px;
  border-radius: 5px;
  border: none;
  margin-bottom: 20px;
  width: 100%;
  max-width: 400px;
  font-size: 1rem;
}

.SM-FooterButton-wrapper button:hover {
  background: white;
  color: #0A1630;
}

.SM-FooterButton-wrapper button {
  outline: none;
  cursor: pointer;
  border: none;
  padding: 0.9rem 2rem;
  font-family: "Roboto", sans-serif;
  font-size: 17px;
  position: relative;
  display: inline-block;
  letter-spacing: 0.05rem;
  font-weight: 700;
  border-radius: 500px;
  overflow: hidden;
  background: #ffffff;
  border: 1px solid #f0f3fb;
  min-width: 150px;
}

.SMfooter-links {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  gap: 40px;
  padding: 0 20px;
}

.SMfooter-link-wrapper {
  display: flex;
  gap: 40px;
}

.SMfooter-link-items {
  min-width: 160px;
}

.SMfooter-link-items h2 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.SMfooter-link-items a {
  color: white;
  text-decoration: none;
  display: block;
  margin-bottom: 0.5rem;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.SMfooter-link-items a:hover {
  opacity: 1;
}

.SMsocial-media {
  max-width: 1200px;
  margin: 60px auto 0;
  padding: 0 20px;
}

.SMsocial-media-wrap {
  display: flex;
  justify-content: center;
}

.SMsocial-icons {
  display: flex;
  gap: 20px;
}

.SMsocial-icon-link {
  color: white;
  font-size: 24px;
  transition: transform 0.3s ease;
}

.SMsocial-icon-link:hover {
  transform: translateY(-3px);
}

.SMwebsite-rights {
  text-align: center;
  margin-top: 40px;
  opacity: 0.8;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .SMcontact-info-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .SMcontact-hero-title {
    font-size: 4rem;
  }

  .SMcontact-content {
    padding: 2rem 1rem;
  }

  .SMcontact-form-container {
    padding: 2rem 1.5rem;
  }

  .SMfooter-links {
    flex-direction: column;
    align-items: center;
  }
}

@media (max-width: 480px) {
  .SMcontact-info-grid {
    grid-template-columns: 1fr;
  }

  .SMcontact-hero-title {
    font-size: 3rem;
  }

  .SMcontact-hero-text p {
    font-size: 1rem;
  }

  .SMcontact-form-container {
    padding: 1.5rem 1rem;
  }

  .SMfooter-link-wrapper {
    flex-direction: column;
    text-align: center;
  }
}

/* Animations */
@keyframes SMgradientMove {
  0% {
    opacity: 0.4;
    transform: scale(1);
  }
  100% {
    opacity: 0.8;
    transform: scale(1.1);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.SMcontact-info-card,
.SMcontact-form-container {
  animation: fadeIn 0.6s ease-out forwards;
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .SMcontact-info-card,
  .SMcontact-form-container {
    animation: none;
  }

  .SMcontact-info-card:hover {
    transform: none;
  }

  .SMsubmit-btn:hover {
    transform: none;
  }
}