import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

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
        headers: { "Content-Type": "application/json" },
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
    <>
      <div>
        <form
          className="auth-form"
          onSubmit={handleSubmit((data) => {
            handleRegister(data);
          })}
        >
          <h2>Register</h2>
          <input
            type="text"
            placeholder="Name"
            required
            {...register("name")}
          />
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
          <button type="submit">Register</button>
        </form>
      </div>
    </>
  );
};

export default Register;
