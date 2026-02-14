import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import styles from "./Login.module.css";

const Login = () => {
  const { setIsAuthenticated, setUser } = useContext(AppContext);
  const navigateTo = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleLogin = async (data) => {
    await axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/api/user/login`, data, {
        withCredentials: true,
      })
      .then((res) => {
        toast.success(res.data.message);
        setIsAuthenticated(true);
        setUser(res.data.user);
        navigateTo("/");
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  return (
    <div className={styles.wrapper}>
      <form
        className={styles.form}
        onSubmit={handleSubmit((data) => handleLogin(data))}
      >
        <h2 className={styles.heading}>Login</h2>

        <input
          type="email"
          placeholder="Email"
          required
          {...register("email")}
          className={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          required
          {...register("password")}
          className={styles.input}
        />

        <p className={styles.forgot}>
          <Link to={"/forgot/password"} className={styles.link}>
            forgot Password?
          </Link>
        </p>

        <button type="submit" className={styles.button}>
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
