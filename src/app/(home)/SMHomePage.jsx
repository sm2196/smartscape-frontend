"use client"

import { useEffect, useState } from "react"
import { ParallaxProvider, Parallax } from "react-scroll-parallax"
import { useRouter } from "next/navigation"
import "./styles/SMHomeHeroSection.css"
import "./styles/SMAboutUsHome.css"
import "./styles/SMHowItWorks.css"
import "./styles/SMParallax.css"
import "./styles/SMCards.css"
import "./styles/SMAmbassador.css"
import { FaUserPlus, FaFileAlt, FaCheckCircle, FaCogs, FaMobileAlt } from "react-icons/fa"
import { auth, db } from "@/lib/firebase/config"
import { setDoc, doc, serverTimestamp } from "firebase/firestore"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { toast } from "react-toastify"
import Link from "next/link"

const MainPicSection = () => {
  return (
    <Parallax translateY={[-20, 20]} className="SMMainPic-container">
      <h1>
        <span>YOUR HOME AT YOUR FINGERTIPS</span>
      </h1>
      <br></br>
      <br></br>
      <div className="SM-joinButton-us-wrapper">
        <button>
          <span>Register today</span>
        </button>
      </div>
    </Parallax>
  )
}

const AboutUs = () => {
  const router = useRouter() // Replace useNavigate with useRouter

  const handleReadMoreClick = () => {
    router.push("/about") // Replace navigate with router.push
  }

  return (
    <div className="SM-about-us-container">
      <Parallax translateY={[-30, 30]} className="SM-about-us-content">
        <div className="SM-about-us-image">
          <img src="/home/bluebg1.jpg" alt="Smart Home" />
        </div>
        <div className="SM-about-us-text">
          <h2>About Us</h2>
          <h3>Innovative Solution for a Smarter, Simpler & Greener Home</h3>
          <p>
            At SmartScape, we're revolutionizing the way you live by transforming your home into a smarter, more
            sustainable space. From monitoring your energy and water usage to enhancing security and reducing
            environmental impact, we empower you to take control of your home effortlessly.
          </p>
          <div className="SM-AboutButton-us-wrapper">
            <button onClick={handleReadMoreClick}>
              <span>Read More</span>
            </button>
          </div>
        </div>
      </Parallax>
    </div>
  )
}

const HowItWorks = () => {
  useEffect(() => {
    const handleScroll = () => {
      const items = document.querySelectorAll(".SM-flow-item")
      const title = document.querySelector(".SM-flow-title")
      const subtitle = document.querySelector(".SM-flow-subtitle")

      const isElementInView = (element) => {
        const rect = element.getBoundingClientRect()
        return rect.top <= window.innerHeight * 0.85 && rect.bottom >= 0
      }

      if (title && isElementInView(title)) {
        title.classList.add("SM-visible")
      }

      if (subtitle && isElementInView(subtitle)) {
        subtitle.classList.add("SM-visible")
      }

      items.forEach((item, index) => {
        if (isElementInView(item)) {
          item.classList.add("SM-visible")
          item.style.transitionDelay = `${index * 0.2}s`
        }
      })
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const steps = [
    {
      icon: <FaUserPlus />,
      title: "Register",
      description:
        "Begin your smart home journey with a simple registration process. Join our community of tech-savvy homeowners.",
    },
    {
      icon: <FaFileAlt />,
      title: "Upload Documents",
      description: "Securely submit your verification documents through our encrypted platform.",
    },
    {
      icon: <FaCheckCircle />,
      title: "Verification",
      description: "Our expert team carefully verifies your information to ensure the highest security standards.",
    },
    {
      icon: <FaCogs />,
      title: "Configuration",
      description: "Customize your smart home settings with our intuitive setup wizard and expert guidance.",
    },
    {
      icon: <FaMobileAlt />,
      title: "Manage",
      description: "Take full control of your smart home from anywhere using our powerful mobile application.",
    },
  ]

  return (
    <div className="SM-parallax-wrapper">
      <div className="SM-process-flow">
        <div className="SM-flow-title">
          <span>How It Works</span>
        </div>
        <p className="SM-flow-subtitle">
          Transform your home into a smart haven with our simple step-by-step process. Experience the future of home
          automation with SmartScape.
        </p>
        <div className="SM-flow-timeline">
          {steps.map((step, index) => (
            <div key={index} className={`SM-flow-item ${index % 2 === 0 ? "SM-left" : "SM-right"}`}>
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
  )
}

const Cards = () => {
  return (
    <Parallax translateY={[-15, 15]} className="SMcards">
      <h1>
        <span>What's special about us?</span>
      </h1>
      <div className="SMcards__container">
        <div className="SMcards__wrapper">
          <div className="SMcards__item">
            <Link className="SMcards__item__link" href="/services">
              <figure className="SMcards__item__pic-wrap" data-category="1">
                <img className="SMcards__item__img" alt="Smart Home" src="/home/bulb.jpg" />
              </figure>
              <div className="SMcards__item__info">
                <h5 className="SMcards__item__text">Monitor your electricity consumption... and Your home</h5>
              </div>
            </Link>
          </div>
          <div className="SMcards__item">
            <Link className="SMcards__item__link" href="/services">
              <figure className="SMcards__item__pic-wrap" data-category="2">
                <img className="SMcards__item__img" alt="Smart Device" src="/home/device.jpg" />
              </figure>
              <div className="SMcards__item__info">
                <h5 className="SMcards__item__text">Save your bills. Turn off devices during peak hours.</h5>
              </div>
            </Link>
          </div>
          <div className="SMcards__item">
            <Link className="SMcards__item__link" href="/services">
              <figure className="SMcards__item__pic-wrap" data-category="3">
                <img className="SMcards__item__img" alt="Control" src="/home/control.jpg" />
              </figure>
              <div className="SMcards__item__info">
                <h5 className="SMcards__item__text">Control all your devices on the run.</h5>
              </div>
            </Link>
          </div>
          <div className="SMcards__item">
            <Link className="SMcards__item__link" href="/products">
              <figure className="SMcards__item__pic-wrap" data-category="4">
                <img className="SMcards__item__img" alt="Security" src="/home/cam.jpg" />
              </figure>
              <div className="SMcards__item__info">
                <h5 className="SMcards__item__text">Watch for intruders!</h5>
              </div>
            </Link>
          </div>
          <div className="SMcards__item">
            <Link className="SMcards__item__link" href="/sign-up">
              <figure className="SMcards__item__pic-wrap" data-category="5">
                <img className="SMcards__item__img" alt="Emergency" src="/home/off.jpg" />
              </figure>
              <div className="SMcards__item__info">
                <h5 className="SMcards__item__text">Emergency shutdown for enhanced home safety</h5>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </Parallax>
  )
}

const AmbassadorForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    socialMedia: "",
    about: "",
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    if (!formData.fullName || !formData.email || !formData.phone || !formData.about) {
      toast.error("Please fill in all required fields.")
      setLoading(false)
      return
    }

    try {
      // Register the user with email and a default password
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, "defaultPassword123")
      const user = userCredential.user

      if (user) {
        // Prepare user data for Firestore
        const ambassadorData = {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          socialMedia: formData.socialMedia || "",
          about: formData.about,
          verified: false, // User is not verified yet
          admin: false,
          userId: user.uid,
          timestamp: serverTimestamp(),
        }

        console.log("Writing to Firestore:", ambassadorData) // Debugging step

        // Save the user data to Firestore
        await setDoc(doc(db, "Ambassadors", user.uid), ambassadorData, { merge: true })

        console.log("User Registered Successfully!")
        toast.success("Successfully applied!")

        // Clear only the form after successful submission
        setFormData({ fullName: "", email: "", phone: "", socialMedia: "", about: "" })
      }
    } catch (error) {
      console.error("Error registering user:", error)
      toast.error(error.message, { position: "top-right" })
    }

    setLoading(false)
  }

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
              Join our community of smart home enthusiasts and help others transform their living spaces.
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
                placeholder="Instagram Handle (Optional)"
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
              <button type="submit" disabled={loading}>
                <span>{loading ? "Submitting..." : "Submit Application"}</span>
              </button>
            </div>
          </form>
        </div>
      </Parallax>
    </div>
  )
}

function Home() {
  return (
    <ParallaxProvider>
      <div className="home-container">
        <MainPicSection />
        <AboutUs />
        <HowItWorks />
        <Cards />
        <AmbassadorForm />
      </div>
    </ParallaxProvider>
  )
}

export default Home

