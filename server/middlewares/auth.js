import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import ErrorHandler from "./error.js";
import { catchAsyncError } from "./catchAsyncError.js";

export const isAuthenticated = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;
  console.log(token);
  
  if (!token) {
    console.log("🔴 No token in cookies");
    return next(new ErrorHandler("User is not authenticated", 400));
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); 
    console.log("🟢 Token decoded:", decoded);
  } catch (err) {
    console.log("🔴 Token verification failed");
    return next(new ErrorHandler("Invalid token", 401));
  }

  const user = await User.findById(decoded.id); // ✅ fixed field name
  if (!user) {
    console.log("🔴 No user found with ID:", decoded.id);
    return next(new ErrorHandler("User not found", 404));
  }

  req.user = user;
  next();
});
