"use client"

import { useState } from "react"
import { useRouter } from "next/navigation" // Next.js router
import * as Components from "./components/SignUpAndLogin"
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input"
import "react-phone-number-input/style.css"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification } from "firebase/auth"
import { auth, db } from "@/lib/firebase/config"
import { setDoc, doc } from "firebase/firestore"
import { ToastContainer, toast } from "react-toastify"
import "./SignUpOrLogin.css"

function SignupOrLogin() {
  const router = useRouter() // Next.js router
  const [signIn, toggle] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [passwordMatchError, setPasswordMatchError] = useState("")
  const [phoneError, setPhoneError] = useState("")
  const [phoneValue, setPhoneValue] = useState("")
  const [email, setEmail] = useState("")
  const [fname, setFname] = useState("")
  const [lname, setLname] = useState("")
  const [loading, setLoading] = useState(false)

  const handleCheckboxChange = () => {
    setAgreeTerms(!agreeTerms)
  }

  const validateEmail = (value) => {
    if (value === "") {
      setEmailError("") // Don't show error if field is empty
      return
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailPattern.test(value)) {
      setEmailError("Please enter a valid email address.")
    } else {
      setEmailError("")
    }
  }

  const handleEmailChange = (e) => {
    const value = e.target.value
    setEmail(value)

    // Validate only if the user has typed something
    if (value.length > 0) {
      validateEmail(value)
    } else {
      setEmailError("") // Reset error if empty
    }
  }

  const validatePhone = (value) => {
    if (value === "") {
      setPhoneError("") // Don't show error if field is empty
      return
    } else if (!value || !isValidPhoneNumber(value)) {
      setPhoneError("Please enter a valid phone number.")
    } else {
      setPhoneError("")
    }
  }

  const handlePhoneChange = (value) => {
    setPhoneValue(value)
    validatePhone(value)
  }

  const validatePassword = (value) => {
    if (value === "") {
      setPasswordError("") // Don't show error if field is empty
      return
    }

    const passwordPattern = /^(?=.*\d)(?=.*[@$!%*?&])(?=.*[A-Za-z]).{8,}$/
    if (!passwordPattern.test(value)) {
      setPasswordError(
        "Password must be at least 8 characters long and include one special character (@$!%*?&) and one number.",
      )
    } else {
      setPasswordError("")
    }
  }

  const handlePasswordChange = (e) => {
    const value = e.target.value
    setPassword(value)

    if (value.length > 0) {
      validatePassword(value)
    } else {
      setPasswordError("")
    }
  }

  const validateConfirmPassword = (value) => {
    if (value === "") {
      setPasswordMatchError("") // Don't show error if field is empty
      return
    }

    if (password !== value) {
      setPasswordMatchError("Passwords do not match.")
    } else {
      setPasswordMatchError("")
    }
  }

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value
    setConfirmPassword(value)

    if (value.length > 0) {
      validateConfirmPassword(value)
    } else {
      setPasswordMatchError("")
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    try {
      // Register the user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      if (user) {
        // Validate that Firestore gets correct data
        const userData = {
          firstName: fname || "",
          lastName: lname || "",
          phone: phoneValue || "",
          verified: false, // User is not verified yet
          isAdmin: false,
          isOnline: true,
        }

        console.log("Writing to Firestore:", userData) // Debugging step

        // Add the user details to Firestore
        await setDoc(doc(db, "Users", user.uid), userData, { merge: true })

        console.log("User Registered Successfully!!")
        toast.success("Registration successful")
        await sendEmailVerification(user)

        // Set auth cookie
        document.cookie = `auth-session=true; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Strict; ${
          window.location.protocol === "https:" ? "Secure;" : ""
        }`

        console.log("Verification email sent!")

        // Show a toast notification that the email verification was sent
        toast.info("A verification email has been sent. Please check your inbox.", { position: "top-right" })
        setTimeout(() => {
          // Pass phone as a query parameter instead of state
          router.push(`/OTP?phone=${encodeURIComponent(phoneValue)}`)
        }, 1500)
      }
    } catch (error) {
      console.error("Error registering user:", error)
      toast.error(error.message, { position: "top-right" })
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      toast.success("Login successful")
      console.log("User Login Successfully!!")
      // Add a delay before navigating to the OTP page

      // Use Next.js router to navigate to dashboard after login
      setTimeout(() => {
        router.push("/dashboard")
      }, 1500)
    } catch (error) {
      console.error("Error registering user:", error)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="RSUserSignUpLogIn">
      <div className="HeaderPhone">
        <img src="/nobg.png" alt="Logo" className="HeaderPhoneLogo" />
      </div>
      <ToastContainer />
      <Components.RSSignUp $userSignIn={signIn}>
        <form className="RSForms" onSubmit={handleRegister}>
          <h1 className="RSHeader">Create Your Account</h1>
          <div className="input-group">
            <input type="text" className="input" value={fname} onChange={(e) => setFname(e.target.value)} required />
            <label className="user-label">First Name</label>
          </div>

          <div className="input-group">
            <input type="text" className="input" value={lname} onChange={(e) => setLname(e.target.value)} required />
            <label className="user-label">Last Name</label>
          </div>

          <div className="input-group">
            <input type="text" className="input" value={email} onChange={handleEmailChange} required />
            <label className="user-label">Email</label>
          </div>
          {emailError && <span className="RSErrorMessage">{emailError}</span>}
          <div className="input-group">
            <PhoneInput
              international
              defaultCountry="AE"
              value={phoneValue}
              onChange={handlePhoneChange}
              type="text"
              className="input"
              required
            />
          </div>

          {phoneError && <span className="RSErrorMessage">{phoneError}</span>}
          <div className="input-group">
            <input type="password" className="input" value={password} onChange={handlePasswordChange} required />
            <label className="user-label">Password</label>
          </div>

          {passwordError && <span className="RSErrorMessage">{passwordError}</span>}
          <div className="input-group">
            <input
              type="password"
              className="input"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
            />
            <label className="user-label">Confirm Password</label>
          </div>

          {passwordMatchError && <span className="RSErrorMessage">{passwordMatchError}</span>}

          <div className="RSTermsAndConditions">
            <input
              className="RSCheckbox"
              type="checkbox"
              required
              checked={agreeTerms}
              onChange={handleCheckboxChange}
            />
            <label className="RSTermsText">
              I have read and agree to the{" "}
              <a className="RSLinks" href="#">
                SmartScape's Terms
              </a>{" "}
              and{" "}
              <a className="RSLinks" href="#">
                Privacy Policy
              </a>
            </label>
          </div>

          <button className="RSButton" disabled={loading}>
            {loading ? "Processing..." : "Sign Up"}
          </button>
        </form>
      </Components.RSSignUp>

      {/* SignIn Form remains unchanged */}
      <Components.RSSignIn $userSignIn={signIn}>
        <form className="RSForms" onSubmit={handleLogin}>
          <h1 className="RSHeader">Sign In</h1>

          <div className="input-group">
            <input type="text" className="input" onChange={handleEmailChange} value={email} required />
            <label className="user-label">Email</label>
          </div>

          <div className="input-group">
            <input type="password" className="input" value={password} onChange={handlePasswordChange} required />
            <label className="user-label">Password</label>
          </div>

          {passwordError && <span className="RSErrorMessage">{passwordError}</span>}
          <a className="RSLinks" href="#">
            Forgot your password?
          </a>
          <button className="RSButton" disabled={loading}>
            {loading ? "Processing..." : "Sign In"}
          </button>
        </form>
      </Components.RSSignIn>

      <Components.RSLRCoverBG $userSignIn={signIn}>
        <Components.RSCover $userSignIn={signIn}>
          <Components.RSLeftSlider $userSignIn={signIn}>
            <img src="/nobg.png" alt="Logo" className="RSLogoImagee" />
            <h1 className="RSHeader">Already have an account?</h1>
            <p className="RSSliderText">
              Please log in and enjoy a personalized experience and manage your home seamlessly
            </p>
            <button className="RSButtonCover" onClick={() => toggle(true)}>
              Log In
            </button>
          </Components.RSLeftSlider>

          <Components.RSRightSlider $userSignIn={signIn}>
            <img src="/nobg.png" alt="Logo" className="RSLogoImage" />
            <h1 className="RSHeader">Your smart home experience awaits!</h1>
            <p className="RSSliderText">Join us to control, automate, and monitor your home effortlessly</p>
            <button className="RSButtonCover" onClick={() => toggle(false)}>
              Sign Up
            </button>
          </Components.RSRightSlider>
        </Components.RSCover>
      </Components.RSLRCoverBG>

      <Components.RSLRCoverBGPhone $userSignIn={signIn}>
        <Components.RSCoverPhone $userSignIn={signIn}>
          <Components.RSLeftSliderPhone $userSignIn={signIn}>
            <button className="RSButtonCover" onClick={() => toggle(true)}>
              Log In Instead?
            </button>
          </Components.RSLeftSliderPhone>

          <Components.RSRightSliderPhone $userSignIn={signIn}>
            <button className="RSButtonCover" onClick={() => toggle(false)}>
              Sign Up Instead?
            </button>
          </Components.RSRightSliderPhone>
        </Components.RSCoverPhone>
      </Components.RSLRCoverBGPhone>
    </div>
  )
}

export default SignupOrLogin

