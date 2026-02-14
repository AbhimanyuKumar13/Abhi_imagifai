import { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "./ResetPassword.module.css";

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

      toast.success(
        res.data.message || "Password reset successful. Please login."
      );

      navigate("/auth");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to reset password"
      );
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h2 className={styles.heading}>Reset Password</h2>

        <p className={styles.description}>
          Enter your new password below.
        </p>

        <form onSubmit={handleResetPassword} className={styles.form}>
          <input
            type="password"
            placeholder="New password"
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className={styles.input}
          />

          <input
            type="password"
            placeholder="Confirm new password"
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword}
            className={styles.input}
          />

          <button type="submit" className={styles.button}>
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
