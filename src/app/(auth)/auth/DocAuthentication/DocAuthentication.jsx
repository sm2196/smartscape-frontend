"use client";

import { useState, useEffect } from "react";
import * as Components from "../components/SignUpAndLogin";
import { getAuth } from "firebase/auth";
import { ToastContainer, toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { FaFilePdf } from "react-icons/fa";
import { IoIosCloseCircleOutline } from "react-icons/io";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  deleteField,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";

// Simulate file upload progress
const simulateUpload = (progressCallback) => {
  let progress = 0;
  const interval = setInterval(() => {
    progress += 10;
    progressCallback(progress);
    if (progress >= 100) {
      clearInterval(interval);
    }
  }, 500);
};

const generateHomeId = () => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let homeId = "SMART-";
  for (let i = 0; i < 6; i++) {
    homeId += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return homeId;
};

function FileUploading() {
  const router = useRouter();
  const [signIn, toggle] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([null, null, null]);
  const [progress, setProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("select");
  const [homeId, setHomeId] = useState("");

  useEffect(() => {
    if (uploadStatus === "uploading") {
      simulateUpload(setProgress);
    }
  }, [uploadStatus]);

  const handleFileSelect = (e, index) => {
    const file = e.target.files[0];
    if (file && file.type !== "application/pdf") {
      toast.error("Only PDF files are allowed.");
      return;
    }
    const newFiles = [...selectedFiles];
    newFiles[index] = file;
    setSelectedFiles(newFiles);
  };

  const handleClearFile = (index) => {
    const newFiles = [...selectedFiles];
    newFiles[index] = null;
    setSelectedFiles(newFiles);
    setUploadStatus("select");
    setProgress(0);
  };

  // Update the handleUpload function to use the Next.js API route
  const handleUpload = async () => {
    if (!selectedFiles.every((file) => file !== null)) {
      toast.error("Please select all required files.");
      return;
    }

    setUploadStatus("uploading");
    setProgress(0);

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      toast.error("User not authenticated.");
      setUploadStatus("select");
      return;
    }

    try {
      // First set the user as admin and create home ID
      await setUserAsAdmin(user.uid);

      // Then send the email with documents
      const userEmail = user.email;
      const formData = new FormData();
      formData.append("userId", user.uid);
      formData.append("userEmail", userEmail);
      formData.append("subject", "Documents Submission");
      formData.append(
        "text",
        `Dear SmartScape Verification Team,

A user has submitted the required documents for verification. Please find the attached files for review. Kindly process the verification at your earliest convenience and update the system accordingly.

User Details:
- User ID: ${user.uid}
- User Email: ${userEmail}

Thank you.

Best regards,
SmartScape System`
      );

      selectedFiles.forEach((file) => {
        formData.append("documents", file);
      });

      try {
        // Start progress animation
        let currentProgress = 0;
        const progressInterval = setInterval(() => {
          // Only go up to 90% until we confirm the email was sent
          if (currentProgress < 90) {
            currentProgress += 10;
            setProgress(currentProgress);
          }
        }, 300);

        // Send the email with documents using native fetch API
        const response = await fetch("/api/send-email", {
          method: "POST",
          body: formData,
        });

        // Clear the progress interval
        clearInterval(progressInterval);

        // Check if response is OK
        if (!response.ok) {
          const errorText = await response.text();
          console.error("Server error response:", errorText);
          throw new Error(
            `Server responded with ${response.status}: ${response.statusText}`
          );
        }

        // Try to parse the JSON response
        let result;
        try {
          result = await response.json();
        } catch (jsonError) {
          console.error("Error parsing JSON response:", jsonError);
          throw new Error("Invalid response from server. Please try again.");
        }

        if (result.success) {
          // Complete the progress to 100%
          setProgress(100);
          toast.success("Documents successfully uploaded!");

          // Wait a moment before redirecting
          setTimeout(() => {
            router.push("/auth/ThankYou");
          }, 1500);
        } else {
          throw new Error(result.error || "Failed to send email");
        }
      } catch (error) {
        console.error("Error sending email with documents:", error);
        toast.error(`Error sending documents: ${error.message}`);
        setUploadStatus("select");
        setProgress(0);
      }
    } catch (error) {
      console.error("Error during upload:", error);
      setUploadStatus("select");
      toast.error("Error during upload. Please try again.");
    }
  };

  const setUserAsAdmin = async (userId) => {
    const homeId = generateHomeId();

    try {
      const userDocRef = doc(db, "Users", userId);
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        toast.error("User not found.");
        return;
      }
      const userData = userDoc.data();

      await setDoc(userDocRef, { isAdmin: true, homeId }, { merge: true });

      toast.success(
        "You are now an admin, and your smart home is ready to go!"
      );
    } catch (error) {
      console.error("Error setting user as admin:", error);
      toast.error("Failed to set admin status.");
    }
  };

  // Replace the existing linkUserToHome function with this updated version
  const linkUserToHome = async (userId, homeId) => {
    try {
      // Check if the current user exists
      const userDocRef = doc(db, "Users", userId);
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        toast.error("User not found.");
        return;
      }

      // Find the admin user who has this homeId
      const usersRef = collection(db, "Users");
      const adminQuery = query(usersRef, where("homeId", "==", homeId));
      const adminSnapshot = await getDocs(adminQuery);

      if (adminSnapshot.empty) {
        toast.error("Home ID does not exist.");
        return;
      }

      // Get the admin document
      const adminDoc = adminSnapshot.docs[0];
      const adminId = adminDoc.id;

      // Check if user is trying to add themselves as a general user
      if (adminId === userId) {
        toast.error("Admin cannot be added as a general user.");
        return;
      }

      // Update the user document with adminRef pointing to the admin
      await updateDoc(userDocRef, {
        adminPin: deleteField(),
        adminRef: doc(db, "Users", adminId),
        homeId: homeId,
      });

      toast.success("Account successfully linked to the home!");
      setTimeout(() => {
        router.push("/auth");
      }, 3000);
    } catch (error) {
      console.error("Error linking user to home:", error);
      toast.error("Failed to link account to home.");
    }
  };

  // Remove or comment out this useEffect since we're handling navigation in handleUpload now
  useEffect(() => {
    if (progress === 100) {
      setUploadStatus("done");
      // Navigation is now handled in the handleUpload function
    }
  }, [progress]);

  useEffect(() => {
    if (uploadStatus === "done") {
      setSelectedFiles([null, null, null]);
      setProgress(0);
      setUploadStatus("select");
    }
  }, [uploadStatus]);

  return (
    <div className="RSUserSignUpLogIn">
      <div className="HeaderPhone">
        <img src="/nobg.png" alt="Logo" className="HeaderPhoneLogo" />
      </div>
      <ToastContainer />
      <Components.RSSignUp $userSignIn={signIn}>
        <div className="right-section-file">
          <h2 className="FileHeader">
            Upload Required Documents for Verification
          </h2>

          <div className="upload-box">
            <h3 className="file-upload-header">
              Proof of identity (Emirates ID)
            </h3>
            {[0].map((index) => (
              <div key={index}>
                <input
                  type="file"
                  onChange={(e) => handleFileSelect(e, index)}
                  style={{ display: "none" }}
                />
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
                      <input
                        type="file"
                        onChange={(e) => handleFileSelect(e, index)}
                      />
                      Choose a file
                    </label>
                  </div>
                ) : (
                  <div className="file-card">
                    <FaFilePdf className="file-icon" />
                    <span className="file-name">
                      {selectedFiles[index].name}
                    </span>
                    <button
                      className="close-btn"
                      onClick={() => handleClearFile(index)}
                    >
                      <IoIosCloseCircleOutline />
                    </button>
                  </div>
                )}
                {uploadStatus === "uploading" && (
                  <div className="progress-container">
                    <div className="progress-bar">
                      <div
                        className="progress"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="upload-box">
            <h3 className="file-upload-header">
              Proof of housing (Current Lease Agreement)
            </h3>
            {[1].map((index) => (
              <div key={index}>
                <input
                  type="file"
                  onChange={(e) => handleFileSelect(e, index)}
                  style={{ display: "none" }}
                />
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
                      <input
                        type="file"
                        onChange={(e) => handleFileSelect(e, index)}
                      />
                      Choose a file
                    </label>
                  </div>
                ) : (
                  <div className="file-card">
                    <FaFilePdf className="file-icon" />
                    <span className="file-name">
                      {selectedFiles[index].name}
                    </span>
                    <button
                      className="close-btn"
                      onClick={() => handleClearFile(index)}
                    >
                      <IoIosCloseCircleOutline />
                    </button>
                  </div>
                )}
                {uploadStatus === "uploading" && (
                  <div className="progress-container">
                    <div className="progress-bar">
                      <div
                        className="progress"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="upload-box">
            <h3 className="file-upload-header">
              Utility bills with the same address as the lease
            </h3>
            {[2].map((index) => (
              <div key={index}>
                <input
                  type="file"
                  onChange={(e) => handleFileSelect(e, index)}
                  style={{ display: "none" }}
                />
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
                      <input
                        type="file"
                        onChange={(e) => handleFileSelect(e, index)}
                      />
                      Choose a file
                    </label>
                  </div>
                ) : (
                  <div className="file-card">
                    <FaFilePdf className="file-icon" />
                    <span className="file-name">
                      {selectedFiles[index].name}
                    </span>
                    <button
                      className="close-btn"
                      onClick={() => handleClearFile(index)}
                    >
                      <IoIosCloseCircleOutline />
                    </button>
                  </div>
                )}
                {uploadStatus === "uploading" && (
                  <div className="progress-container">
                    <div className="progress-bar">
                      <div
                        className="progress"
                        style={{ width: `${progress}%` }}
                      ></div>
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
            <input
              type="text"
              className="input"
              value={homeId}
              onChange={(e) => setHomeId(e.target.value)}
              required
            />
            <label className="user-label">Home ID</label>
          </div>

          <button
            className="RSButtonFile"
            onClick={() => {
              const auth = getAuth();
              const user = auth.currentUser;
              if (!user) {
                toast.error("User not authenticated.");
                return;
              }
              linkUserToHome(user.uid, homeId);
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
              Please visit the following page to complete the registration
              process for your general user account.
            </p>
            <button className="RSButtonCover" onClick={() => toggle(true)}>
              Become A General User
            </button>
          </Components.RSLeftSlider>

          <Components.RSRightSlider $userSignIn={signIn}>
            <img src="/nobg.png" alt="Logo" className="RSLogoImage" />
            <h1 className="RSHeader">Want to be an admin?</h1>
            <p className="RSSliderText">
              Please visit the following page and follow the instructions to
              complete your admin account setup.
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
  );
}

export default FileUploading;
