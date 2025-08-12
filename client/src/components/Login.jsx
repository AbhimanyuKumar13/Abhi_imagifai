import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify"; 
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Login = () => {
  const {  setIsAuthenticated, setUser } =
    useContext(AppContext);
  const navigateTo = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const handleLogin = async (data) => {
    await axios
      .post("http://localhost:4000/api/user/login", data, {
        withCredentials: true 
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
    <>
      <form
        className="auth-form"
        onSubmit={handleSubmit((data) => handleLogin(data))}
      >
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          required
          {...register("email")}
        />
        <input
          type="password"
          placeholder="Password"
          required
          {...register("password")}
        />
        <p className="forgot-password">
          <Link to={"/forgot/password"}>forgot Password?</Link>
        </p>
        <button type="submit">Login</button>
      </form>
    </>
  );
};

export default Login;
