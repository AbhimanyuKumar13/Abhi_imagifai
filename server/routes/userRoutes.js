import express from "express";
import {
  register,
  verifyOtp,
  login,
  logout,
  forgotPassword,
  resetPassword,
  userCredits,
  paymentRazorpay,
  verifyRazorpay,
  getUser,
} from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const userRouter = express.Router();

userRouter.post("/register", register)
userRouter.post("/otp-verification", verifyOtp)
userRouter.post("/login", login)
userRouter.get("/logout", isAuthenticated , logout) 
userRouter.get("/me", isAuthenticated, getUser)
userRouter.post("/password/forgot", forgotPassword)
userRouter.put("/password/reset/:token", resetPassword)
userRouter.get("/credits", isAuthenticated, userCredits);
userRouter.post("/pay-razor", isAuthenticated, paymentRazorpay);
userRouter.post("/verify-razor", verifyRazorpay); 

export default userRouter;
