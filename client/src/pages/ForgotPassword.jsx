import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import styles from "./ForgotPassword.module.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    await axios
      .post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/password/forgot`,
        { email },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success(res.data.message);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h2 className={styles.heading}>Forgot Password</h2>

        <p className={styles.description}>
          Enter your email address to receive a password reset token.
        </p>

        <form
          onSubmit={handleForgotPassword}
          className={styles.form}
        >
          <input
            type="email"
            value={email}
            placeholder="Enter your Email"
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            required
          />

          <button className={styles.button} type="submit">
            Send Reset Link
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
