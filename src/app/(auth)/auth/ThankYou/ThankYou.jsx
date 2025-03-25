"use client"

import { ToastContainer } from "react-toastify"
import Link from "next/link"

const ThankYou = () => {
  return (
    <div className="RSUserSignUpLogInFP">
      <div className="HeaderPhone">
        <img src="/auth/nobg.png" alt="Logo" className="HeaderPhoneLogo" />
      </div>
      <ToastContainer />
      <div className="right-section-fp">
        <img src="/auth/nobg.png" alt="Logo" className="RSLogoImagee-fp" />
        <form className="RSForms-fp">
          <div>
            <h2>Thank you for submitting your documents!</h2>
            <p className="subtitle-ty">
              Your documents are currently being reviewed. You will receive an email shortly if everything is in order,
              and your account will be cleared for the next steps. We appreciate your patience!
            </p>
            <Link href="/auth" className="RSButton-fp">
              Return to Login
            </Link>
          </div>
        </form>
        <label className="RSTermsText">
          <a
            className="RSLinks"
            href="https://docs.google.com/document/d/1Q6r_lRzIUZn4J3eFrCvfJ_n2ZT3szbq134eKq0mGHRI/edit?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
          >
            SmartScape's Terms
          </a>
          {" | "}
          <a
            className="RSLinks"
            href="https://docs.google.com/document/d/1mtVqldz80iHshNOun4jq8p7xhPhpROsxxw5BXQwldsY/edit?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </a>
        </label>
      </div>
    </div>
  )
}

export default ThankYou

