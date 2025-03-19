"use client"

import { useState, useEffect } from "react"
import { FaArrowLeft } from "react-icons/fa"
import { MdLockReset } from "react-icons/md"
import { ToastContainer, toast } from "react-toastify"
import { useRouter } from "next/navigation"

const OTPVerification = () => {
  const router = useRouter()

  // Get phone number from query parameter or localStorage
  const storedPhone = typeof window !== "undefined" ? localStorage.getItem("phoneNumber") : null
  const phoneNumber = storedPhone || "Placeholder Number"

  const [otp, setOtp] = useState(["", "", "", ""])
  const [timeLeft, setTimeLeft] = useState(120)
  const [isDisabled, setIsDisabled] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0) // 30s resend cooldown

  useEffect(() => {
    if (phoneNumber !== "Placeholder Number") {
      localStorage.setItem("phoneNumber", phoneNumber)
    }
  }, [phoneNumber])

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setIsDisabled(true)
    }
  }, [timeLeft])

  useEffect(() => {
    if (resendCooldown > 0) {
      const cooldownTimer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
      return () => clearTimeout(cooldownTimer)
    }
  }, [resendCooldown])

  const handleChange = (index, value) => {
    // Only allow numbers (0-9)
    if (!/^[0-9]$/.test(value) && value !== "") return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Focus on next input if value is entered
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      if (nextInput) nextInput.focus() // Check if nextInput exists
    }
  }

  const handleVerify = () => {
    if (isDisabled) {
      toast.error("OTP expired! Please request a new code.")
      return
    }
    if (otp.includes("")) {
      toast.error("Please enter all OTP digits.")
      return
    }
    toast.success("Verification Complete")
    setTimeout(() => {
      router.push("/auth/DocAuthentication")
    }, 1500)
  }

  const handleResend = () => {
    if (resendCooldown > 0) {
      toast.error("Please wait 30 seconds before generating a new OTP")
      return // Prevent spamming resend
    }
    setOtp(["", "", "", ""])
    setTimeLeft(120)
    setIsDisabled(false)
    setResendCooldown(30) // Start 30s cooldown
    toast.info("A new OTP has been sent!")
    localStorage.setItem("phoneNumber", phoneNumber)
  }

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60)
    const seconds = timeLeft % 60
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`
  }

  const handleChangePhone = () => {
    // Navigate to the ChangePhoneNumber page
    router.push("/auth/ChangePhoneNumber")
  }

  return (
    <div className="RSUserSignUpLogInFU">
      <div className="HeaderPhone">
        <img src="/nobg.png" alt="Logo" className="HeaderPhoneLogo" />
      </div>
      <ToastContainer />
      <div className="left-section">
        <img src="/nobg.png" alt="Logo" className="RSLogoImagee" />

        <button className="Changebutton" onClick={handleChangePhone}>
          <FaArrowLeft className="changearrow" /> Change Phone Number
        </button>
      </div>
      <div className="right-section">
        <MdLockReset className="OTPicon" />
        <h2 className="RSHeader">Verification</h2>
        <p className="subtitle">
          A verification code has been sent to <br />
          <b>{phoneNumber}</b>
        </p>

        <div className="otp-inputs">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength="1"
              className="otp-box"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              disabled={isDisabled}
            />
          ))}
        </div>

        <p className="otp-expiry">
          This code expires in <b>{formatTime()}</b>
        </p>

        <button className="RSButtonCoverOTP" onClick={handleVerify} disabled={isDisabled}>
          {isDisabled ? "OTP Expired" : "Verify"}
        </button>

        <a className="RSLinks" onClick={handleResend}>
          Didn't receive a code? Resend again
        </a>
      </div>
    </div>
  )
}

export default OTPVerification

