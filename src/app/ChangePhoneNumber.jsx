import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css'; // Import the phone number input CSS
import { isValidPhoneNumber } from 'react-phone-number-input';
import { db, auth } from './firebase'; // Import Firebase db and auth instances
import { updateDoc, doc } from 'firebase/firestore'; // Firestore update functions

const ChangePhoneNum = () => {
  const [phoneValue, setPhoneValue] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const navigate = useNavigate();

  // Phone validation logic
  const validatePhone = (value) => {
    if (value === "") {
      setPhoneError(""); // Don't show error if field is empty
      return;
    }
    if (!value || !isValidPhoneNumber(value)) {
      setPhoneError("Please enter a valid phone number.");
    } else {
      setPhoneError("");
    }
  };

  const handlePhoneChange = (value) => {
    setPhoneValue(value);
    validatePhone(value);
  };

  const handleUpdatePhone = async () => {
    // Check if the phone number is valid
    if (phoneError || !phoneValue) {
      toast.error("Please enter a valid phone number.");
      return;
    }

    try {
      // Get the current user's UID
      const user = auth.currentUser;
      if (user) {
        // Update the phone number in Firestore
        const userDocRef = doc(db, "Users", user.uid); // Get the user's document reference
        await updateDoc(userDocRef, {
          phone: phoneValue, // Update the phone field in Firestore
        });

        // Save the new phone number to localStorage
        localStorage.setItem("phoneNumber", phoneValue);

        // Notify the user
        toast.success("Phone number updated successfully!");

        // Redirect to the OTP verification page with the new phone number
        navigate("/OTPVerification", { state: { phone: phoneValue } });
      } else {
        toast.error("User is not logged in.");
      }
    } catch (error) {
      console.error("Error updating phone number in Firestore:", error);
      toast.error("An error occurred while updating your phone number.");
    }
  };


  return (
    <div className="RSUserSignUpLogInFP">
      <div className="HeaderPhone">
        <img src="\nobg.png" alt="Logo" className="HeaderPhoneLogo" />
      </div>
      <ToastContainer />
      <div className="right-section-cfn">
        <img src="/nobg.png" alt="Logo" className="RSLogoImagee-fp" />
        <form className="RSForms-fp">
          <div>
            <h2>Change Your Phone Number</h2>
<div className="padding-cfn">
            <div className="input-group">
              <PhoneInput
                international
                defaultCountry="AE"
                value={phoneValue}
                onChange={handlePhoneChange}
                className="input"
                required
              />
            </div>

            {phoneError && <span className="RSErrorMessage">{phoneError}</span>}
          </div>
          </div>
          <button type="button" className="RSButton" onClick={handleUpdatePhone}>
            Update Phone Number
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePhoneNum;
