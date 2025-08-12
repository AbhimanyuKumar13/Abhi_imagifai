import React, { useContext, useState } from "react";
import "../styles/OtpVerification.css";
import axios from "axios";
import { Navigate, useParams } from "react-router-dom";
import { toast } from "react-toastify"; 
import { AppContext } from "../context/AppContext";

const OtpVerification = () => {
  const { isAuthenticated, setIsAuthenticated, setUser } = useContext(AppContext);
  const { email} = useParams();
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
    const data = {
      email,
      otp: enteredOtp,
    }; 
    await axios
      .post("http://localhost:4000/api/user/otp-verification", data, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      })
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
    <>
      <div className="otp-verification-page">
        <div className="otp-container">
          <h2>OTP Verification</h2>
          <p>Enter the 5-Digit OTP sent to your Email or Phone.</p>
          <form onSubmit={handleOtpVerification} className="otp-form">
            <div className="otp-input-container">
              {otp.map((digit, index) => {
                return (
                  <input
                    id={`otp-input-${index}`}
                    type="text"
                    maxLength={1}
                    key={index}
                    value={digit}
                    onChange={(e) => {
                      handleChange(e.target.value, index);
                    }}
                    onKeyDown={(e) => {
                      handleKeyDown(e, index);
                    }}
                    className="otp-input"
                  />
                );
              })}
            </div>
            <button type="submit" className="verify-button">
              Verify OTP
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default OtpVerification;
