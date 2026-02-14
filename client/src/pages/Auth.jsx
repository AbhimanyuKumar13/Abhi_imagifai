import React, { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import Login from "../components/Login";
import Register from "../components/Register";
import { AppContext } from "../context/AppContext";
import styles from "./Auth.module.css";

const Auth = () => {
  const { isAuthenticated } = useContext(AppContext);
  const [isLogin, setIsLogin] = useState(true);

  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className={styles.authPage}>
      <div className={styles.authContainer}>
        <div className={styles.toggle}>
          <button
            className={`${styles.toggleBtn} ${isLogin ? styles.active : ""}`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`${styles.toggleBtn} ${!isLogin ? styles.active : ""}`}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>

        {isLogin ? <Login /> : <Register />}
      </div>
    </div>
  );
};

export default Auth;
