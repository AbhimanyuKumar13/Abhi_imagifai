import {useState } from "react";
import "../styles/ForgotPassword.css"; 
import axios from "axios";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";

const ForgotPassword = () => { 
  const [email, setEmail] = useState("");
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    await axios
      .post(
        "http://localhost:4000/api/user/password/forgot",
        { email },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        toast.success(res.data.message); 
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };
  return (
    <>
      <div className="forgot-password-page">
        <div className="forgot-password-container">
          <h2>Forgot Password</h2>
          <p>Enter your email address to receive a password reset token.</p>
          <form
            onSubmit={handleForgotPassword}
            className="forgot-password-form"
          >
            <input
              type="email"
              value={email}
              placeholder="Enter your Email"
              onChange={(e) => setEmail(e.target.value)}
              className="forgot-input"
              required
            />
            <button className="forgot-btn" type="submit">
              Send Reset Link
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
