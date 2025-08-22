import { useState } from "react";
import "../styles/ResetPassword.css";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; 

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/password/reset/${token}`,
        { password, confirmPassword },
        { withCredentials: true }
      );

      toast.success(res.data.message || "Password reset successful. Please login."); 
      navigate("/auth");

    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    }
  };

  return (
    <div className="reset-password-page">
      <div className="reset-password-container">
        <h2>Reset Password</h2>
        <p>Enter your new password below.</p>
        <form onSubmit={handleResetPassword} className="reset-password-form">
          <input
            type="password"
            placeholder="new password"
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="reset-input"
          />
          <input
            type="password"
            placeholder="confirm new password"
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword}
            className="reset-input"
          />
          <button type="submit" className="reset-btn">Reset Password</button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
