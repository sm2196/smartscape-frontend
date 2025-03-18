import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { app } from "./firebase"; // Import your Firebase app configuration


const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    //const navigate = useNavigate();

    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);

        // Validate only if the user has typed something
        if (value.length > 0) {
            validateEmail(value);
        } else {
            setEmailError(""); // Reset error if empty
        }
    };

    const validateEmail = (email) => {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(email)) {
            setEmailError("Please enter a valid email address");
        } else {
            setEmailError("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Firebase password reset
        if (!emailError && email) {
            const auth = getAuth(app);
            try {
                await sendPasswordResetEmail(auth, email);
                toast.success("Password reset email sent!");
                // navigate("/login"); // Navigate to login page or wherever you need
            } catch (error) {
                console.error(error);
                toast.error("Error sending reset email. Please try again.");
            }
        } else {
            toast.error("Please enter a valid email address.");
        }
    };

    return (
        <div className="RSUserSignUpLogInFP">
            <div className="HeaderPhone">
                <img src="\nobg.png" alt="Logo" className="HeaderPhoneLogo" />
            </div>
            <ToastContainer />
            <div className="right-section-fp">
                <img src="/nobg.png" alt="Logo" className="RSLogoImagee-fp" />
                <form className="RSForms-fp" onSubmit={handleSubmit}>
                    <h2 className="RSHeader">Reset your password</h2>
                    <p className="subtitle-fp">
                        Enter your Email address and we will send you instructions to reset your password.
                    </p>
                    <div className="input-group">
                        <input
                            type="text"
                            className="input"
                            value={email}
                            onChange={handleEmailChange}
                            required
                        />
                        <label className="user-label">Email</label>
                    </div>
                    {emailError && <span className="RSErrorMessage">{emailError}</span>}
                    <button className="RSButton-fp" type="submit">Send Reset Link</button>
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
    );
};

export default ForgotPassword;
