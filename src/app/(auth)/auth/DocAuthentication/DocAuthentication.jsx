"use client"

import { useState, useEffect } from "react"
import * as Components from "../components/SignUpAndLogin"
import emailjs from "emailjs-com"
import { getAuth } from "firebase/auth"
import { ToastContainer, toast } from "react-toastify"
import { useRouter } from "next/navigation"
import { FaFilePdf } from "react-icons/fa"
import { IoIosCloseCircleOutline } from "react-icons/io"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase/config"

// Simulate file upload progress
const simulateUpload = (progressCallback) => {
  let progress = 0
  const interval = setInterval(() => {
    progress += 10
    progressCallback(progress)
    if (progress >= 100) {
      clearInterval(interval)
    }
  }, 500)
}

const generateHomeId = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let homeId = "SMART-";
  for (let i = 0; i < 6; i++) {
    homeId += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return homeId;
}

function FileUploading() {
  const router = useRouter()
  const [signIn, toggle] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState([null, null, null])
  const [progress, setProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState("select")
  const [homeId, setHomeId] = useState("")

  useEffect(() => {
    if (uploadStatus === "uploading") {
      simulateUpload(setProgress)
    }
  }, [uploadStatus])

  const handleFileSelect = (e, index) => {
    const file = e.target.files[0]
    if (file && file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed.")
      return
    }
    const newFiles = [...selectedFiles]
    newFiles[index] = file
    setSelectedFiles(newFiles)
  }

  const handleClearFile = (index) => {
    const newFiles = [...selectedFiles]
    newFiles[index] = null
    setSelectedFiles(newFiles)
    setUploadStatus("select")
    setProgress(0)
  }

  const handleRegistrationComplete = async () => {
    const auth = getAuth()
    const user = auth.currentUser

    if (!user) {
      toast.error("User not authenticated.")
      return
    }

    const userEmail = user.email

    try {
      await emailjs.send(
        "service_bfv0h4h",
        "template_vuyc74s",
        {
          to_name: user.displayName || "User",
          to_email: userEmail,
          from_name: "SmartScape",
          message:
            "Welcome to SmartScape! You have successfully registered. The admin will contact you shortly to link you to a household account.",
        },
        "hbWTAcvJCRfka3lwx",
      )

      toast.success("Registration completed.")
    } catch (error) {
      console.error("Email sending error:", error)
      toast.error("Error sending confirmation email.")
    }
  }

  const handleUpload = async () => {
    if (selectedFiles.every((file) => file !== null)) {
      setUploadStatus("uploading")
      setProgress(0)

      const auth = getAuth()
      const user = auth.currentUser

      if (!user) {
        toast.error("User not authenticated.")
        setUploadStatus("select")
        return
      }

      try {
        await setUserAsAdmin(user.uid)
      } catch (error) {
        console.error("Error during upload:", error)
        setUploadStatus("select")
      }
    }
  }

  const setUserAsAdmin = async (userId) => {
    const homeId = generateHomeId()

    try {
      const userDocRef = doc(db, "Users", userId)
      const userDoc = await getDoc(userDocRef)
      if (!userDoc.exists()) {
        toast.error("User not found.")
        return
      }
      const userData = userDoc.data()

      await setDoc(userDocRef, { isAdmin: true, homeId }, { merge: true })

      await setDoc(doc(db, "Homes", homeId), {
        adminId: userId,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
      })

      toast.success("You are now an admin, and your smart home is ready to go!")
    } catch (error) {
      console.error("Error setting user as admin:", error)
      toast.error("Failed to set admin status.")
    }
  }

  const linkUserToHome = async (userId, homeId) => {
    try {
      const userDocRef = doc(db, "Users", userId)
      const userDoc = await getDoc(userDocRef)
      if (!userDoc.exists()) {
        toast.error("User not found.")
        return
      }
      const userData = userDoc.data()

      const homeDocRef = doc(db, "Homes", homeId)
      const homeDoc = await getDoc(homeDocRef)
      if (!homeDoc.exists()) {
        toast.error("Home ID does not exist.")
        return
      }

      const homeData = homeDoc.data()
      if (homeData.adminId === userId) {
        toast.error("Admin cannot be added as a general user.")
        return
      }

      await setDoc(doc(db, "Homes", homeId, "generalUsers", userId), {
        userId: userId,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phone: userData.phone,
      })

      await setDoc(userDocRef, { homeId }, { merge: true })

      toast.success("Account successfully linked to the home!")
    } catch (error) {
      console.error("Error linking user to home:", error)
      toast.error("Failed to link account to home.")
    }
  }

  useEffect(() => {
    if (progress === 100) {
      setUploadStatus("done")
      router.push("/auth/ThankYou")
    }
  }, [progress, router])

  useEffect(() => {
    if (uploadStatus === "done") {
      setSelectedFiles([null, null, null])
      setProgress(0)
      setUploadStatus("select")
    }
  }, [uploadStatus])

  return (
    <div className="RSUserSignUpLogIn">
      <div className="HeaderPhone">
        <img src="/nobg.png" alt="Logo" className="HeaderPhoneLogo" />
      </div>
      <ToastContainer />
      <Components.RSSignUp $userSignIn={signIn}>
        <div className="right-section-file">
          <h2 className="FileHeader">Upload Required Documents for Verification</h2>

          <div className="upload-box">
            <h3 className="file-upload-header">Proof of identity (Emirates ID)</h3>
            {[0].map((index) => (
              <div key={index}>
                <input type="file" onChange={(e) => handleFileSelect(e, index)} style={{ display: "none" }} />
                {!selectedFiles[index] ? (
                  <div className="container">
                    <div className="folder">
                      <div className="front-side">
                        <div className="tip"></div>
                        <div className="cover"></div>
                      </div>
                      <div className="back-side cover"></div>
                    </div>
                    <label className="custom-file-upload">
                      <input type="file" onChange={(e) => handleFileSelect(e, index)} />
                      Choose a file
                    </label>
                  </div>
                ) : (
                  <div className="file-card">
                    <FaFilePdf className="file-icon" />
                    <span className="file-name">{selectedFiles[index].name}</span>
                    <button className="close-btn" onClick={() => handleClearFile(index)}>
                      <IoIosCloseCircleOutline />
                    </button>
                  </div>
                )}
                {uploadStatus === "uploading" && (
                  <div className="progress-container">
                    <div className="progress-bar">
                      <div className="progress" style={{ width: `${progress}%` }}></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="upload-box">
            <h3 className="file-upload-header">Proof of housing (Current Lease Agreement)</h3>
            {[1].map((index) => (
              <div key={index}>
                <input type="file" onChange={(e) => handleFileSelect(e, index)} style={{ display: "none" }} />
                {!selectedFiles[index] ? (
                  <div className="container">
                    <div className="folder">
                      <div className="front-side">
                        <div className="tip"></div>
                        <div className="cover"></div>
                      </div>
                      <div className="back-side cover"></div>
                    </div>
                    <label className="custom-file-upload">
                      <input type="file" onChange={(e) => handleFileSelect(e, index)} />
                      Choose a file
                    </label>
                  </div>
                ) : (
                  <div className="file-card">
                    <FaFilePdf className="file-icon" />
                    <span className="file-name">{selectedFiles[index].name}</span>
                    <button className="close-btn" onClick={() => handleClearFile(index)}>
                      <IoIosCloseCircleOutline />
                    </button>
                  </div>
                )}
                {uploadStatus === "uploading" && (
                  <div className="progress-container">
                    <div className="progress-bar">
                      <div className="progress" style={{ width: `${progress}%` }}></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="upload-box">
            <h3 className="file-upload-header">Utility bills with the same address as the lease</h3>
            {[2].map((index) => (
              <div key={index}>
                <input type="file" onChange={(e) => handleFileSelect(e, index)} style={{ display: "none" }} />
                {!selectedFiles[index] ? (
                  <div className="container">
                    <div className="folder">
                      <div className="front-side">
                        <div className="tip"></div>
                        <div className="cover"></div>
                      </div>
                      <div className="back-side cover"></div>
                    </div>
                    <label className="custom-file-upload">
                      <input type="file" onChange={(e) => handleFileSelect(e, index)} />
                      Choose a file
                    </label>
                  </div>
                ) : (
                  <div className="file-card">
                    <FaFilePdf className="file-icon" />
                    <span className="file-name">{selectedFiles[index].name}</span>
                    <button className="close-btn" onClick={() => handleClearFile(index)}>
                      <IoIosCloseCircleOutline />
                    </button>
                  </div>
                )}
                {uploadStatus === "uploading" && (
                  <div className="progress-container">
                    <div className="progress-bar">
                      <div className="progress" style={{ width: `${progress}%` }}></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {selectedFiles.every((file) => file !== null) && (
            <button className="upload-btn" onClick={handleUpload}>
              Upload
            </button>
          )}
        </div>
      </Components.RSSignUp>

      <Components.RSSignIn $userSignIn={signIn}>
        <div className="left-section-file">
          <h2 className="FileHeader">Finalize Your Account Setup</h2>

          <div className="input-group">
            <input type="text" className="input" value={homeId} onChange={(e) => setHomeId(e.target.value)} required />
            <label className="user-label">Home ID</label>
          </div>

          <button
            className="RSButtonFile"
            onClick={() => {
              const auth = getAuth()
              const user = auth.currentUser
              if (!user) {
                toast.error("User not authenticated.")
                return
              }
              linkUserToHome(user.uid, homeId)
            }}
          >
            Link Account
          </button>
        </div>
      </Components.RSSignIn>

      <Components.RSLRCoverBG $userSignIn={signIn}>
        <Components.RSCover $userSignIn={signIn}>
          <Components.RSLeftSlider $userSignIn={signIn}>
            <img src="/nobg.png" alt="Logo" className="RSLogoImagee" />
            <h1 className="RSHeader">Want to be a general user?</h1>
            <p className="RSSliderText">
              Please visit the following page to complete the registration process for your general user account.
            </p>
            <button className="RSButtonCover" onClick={() => toggle(true)}>
              Become A General User
            </button>
          </Components.RSLeftSlider>

          <Components.RSRightSlider $userSignIn={signIn}>
            <img src="/nobg.png" alt="Logo" className="RSLogoImage" />
            <h1 className="RSHeader">Want to be an admin?</h1>
            <p className="RSSliderText">
              Please visit the following page and follow the instructions to complete your admin account setup.
            </p>
            <button className="RSButtonCover" onClick={() => toggle(false)}>
              Become An Admin
            </button>
          </Components.RSRightSlider>
        </Components.RSCover>
      </Components.RSLRCoverBG>

      <Components.RSLRCoverBGPhone $userSignIn={signIn}>
        <Components.RSCoverPhone $userSignIn={signIn}>
          <Components.RSLeftSliderPhone $userSignIn={signIn}>
            <button className="RSButtonCover" onClick={() => toggle(true)}>
              Become A General User?
            </button>
          </Components.RSLeftSliderPhone>

          <Components.RSRightSliderPhone $userSignIn={signIn}>
            <button className="RSButtonCover" onClick={() => toggle(false)}>
              Become An Admin?
            </button>
          </Components.RSRightSliderPhone>
        </Components.RSCoverPhone>
      </Components.RSLRCoverBGPhone>
    </div>
  )
}

export default FileUploading

