import React, { useContext, useState } from "react";
import axios from "axios";
import { Navigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import styles from "./OtpVerification.module.css";

const OtpVerification = () => {
  const { isAuthenticated, setIsAuthenticated, setUser } =
    useContext(AppContext);
  const { email } = useParams();
  const [otp, setOtp] = useState(["", "", "", "", ""]);

  const handleChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpVerification = async (e) => {
    e.preventDefault();
    const enteredOtp = otp.join("");

    const data = { email, otp: enteredOtp };

    await axios
      .post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/otp-verification`,
        data,
        { withCredentials: true }
      )
      .then((res) => {
        toast.success(res.data.message);
        setIsAuthenticated(true);
        setUser(res.data.user);
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message);
        setIsAuthenticated(false);
        setUser(null);
      });
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  };

  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h2 className={styles.heading}>OTP Verification</h2>

        <p className={styles.description}>
          Enter the 5-Digit OTP sent to your Email or Phone.
        </p>

        <form onSubmit={handleOtpVerification} className={styles.form}>
          <div className={styles.otpContainer}>
            {otp.map((digit, index) => (
              <input
                id={`otp-input-${index}`}
                type="text"
                maxLength={1}
                key={index}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className={styles.otpInput}
              />
            ))}
          </div>

          <button type="submit" className={styles.button}>
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default OtpVerification;
