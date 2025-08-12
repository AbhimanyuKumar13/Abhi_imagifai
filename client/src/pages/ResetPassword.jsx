import { useContext, useState } from "react";
import "../styles/ResetPassword.css";
import axios from "axios";
import { Navigate, useParams } from "react-router-dom";
import { toast } from "react-toastify"; 
import { AppContext } from "../context/AppContext";

const ResetPassword = () => {
  const { isAuthenticated, setIsAuthenticated, setUser } = useContext(AppContext);
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    await axios
      .put(
        `http://localhost:4000/api/user/password/reset/${token}`,
        { password, confirmPassword },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        toast.success(res.data.message);
        setIsAuthenticated(true);
        setUser(res.data.user);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };
  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }

  return (
    <>
      <div className="reset-password-page">
        <div className="reset-password-container">
          <h2>Reset Password</h2>
          <p>Enter your new password below.</p>
          <form onSubmit={handleResetPassword} className="reset-password-form">
            <input
              type="password"
              placeholder="new password"
              required
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              value={password}
              className="reset-input"
            />
            <input
              type="password"
              placeholder="confirm new password"
              required
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
              value={confirmPassword}
              className="reset-input"
            />
            <button type="submit" className="reset-btn">Reset Password</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
