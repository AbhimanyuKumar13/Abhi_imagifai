import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import styles from "./Register.module.css";

const Register = () => {
  const NavigateTo = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleRegister = async (data) => {
    await axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/api/user/register`, data, {
        withCredentials: true,
      })
      .then((res) => {
        toast.success(res.data.message);
        NavigateTo(`/otp-verification/${data.email}`);
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || "Registration failed");
      });
  };

  return (
    <div className={styles.wrapper}>
      <form
        className={styles.form}
        onSubmit={handleSubmit((data) => {
          handleRegister(data);
        })}
      >
        <h2 className={styles.heading}>Register</h2>

        <input
          type="text"
          placeholder="Name"
          required
          {...register("name")}
          className={styles.input}
        />

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

        <button type="submit" className={styles.button}>
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
