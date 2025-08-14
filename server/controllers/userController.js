import { User } from "../models/userModel.js";
import ErrorHandler, { errorMiddleware } from "../middlewares/error.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { sendEmail } from "../utils/sendEmail.js";
import { sendToken } from "../utils/sendToken.js";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

import razorpay from "razorpay";
import transactionModel from "../models/transactionModel.js";

const register = catchAsyncError(async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return next(new ErrorHandler("All fields are required.", 400));
    }
    const existingUser = await User.findOne({
      email,
      accountVerified: true,
    });

    if (existingUser) {
      return next(new ErrorHandler("Phone or Email is already used.", 400));
    }

    const registerationAttemptsByUser = await User.find({
      email,
      accountVerified: false,
    });
    if (registerationAttemptsByUser.length > 3) {
      return next(
        new ErrorHandler(
          "You have exceeded the maximum number of attempts (3). Please try again after an hour.",
          400
        )
      );
    }

    const userData = {
      name,
      email,
      password,
    };
    const user = await User.create(userData);
    const verificationCode = await user.generateVerificationCode();
    await user.save();
    sendVerificationCode(verificationCode, name, email, res);
  } catch (error) {
    next(error);
  }
});

async function sendVerificationCode(verificationCode, name, email, res) {
  try {
    const message = generateEmailTemplate(verificationCode);
    await sendEmail({ email, subject: "your verification code", message });
    res.status(200).json({
      success: true,
      message: `Verification Email successfully sent to ${name}`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "verification code failed to send.",
    });
  }
}
function generateEmailTemplate(verificationCode) {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0;">
      <h2 style="color: #333;">Email Verification</h2>
      <p>Thank you for registering. Please use the verification code below to complete your sign-up process:</p>
      <div style="font-size: 24px; font-weight: bold; color: #4CAF50; margin: 20px 0;">
        ${verificationCode}
      </div>
      <p>If you did not request this code, you can safely ignore this email.</p>
      <p style="color: #888; font-size: 12px;">This code will expire in 10 minutes.</p>
    </div>
  `;
}

const verifyOtp = catchAsyncError(async (req, res, next) => {
  const { email, otp } = req.body;
  console.log(email);
  if (!email) {
    return next(new ErrorHandler("Email required.", 400));
  }
  try {
    const userAllEntries = await User.find({
      email,
      accountVerified: false,
    }).sort({ createdAt: -1 });

    if (!userAllEntries || userAllEntries.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    let user;

    if (userAllEntries.length > 1) {
      user = userAllEntries[0];

      await User.deleteMany({
        _id: { $ne: user._id },
        email,
        accountVerified: false,
      });
    } else {
      user = userAllEntries[0];
    }
    try {
      if (!otp || user.VerificationCode.toString() !== otp.toString()) {
        return next(new ErrorHandler("Invalid OTP.", 400));
      }
    } catch (err) {
      console.error("OTP comparison failed:", err);
      return next(new ErrorHandler("OTP check failed.", 500));
    }

    const currentTime = Date.now();
    const verificationCodeExpire = new Date(
      user.verificationCodeExpire
    ).getTime();

    if (currentTime > verificationCodeExpire) {
      return next(new ErrorHandler("OTP Expired.", 400));
    }

    user.accountVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpire = null;
    await user.save({ validateModifiedOnly: true });
    sendToken(user, 200, "Account Verified", res);
  } catch (error) {
    console.error("verifyOtp error:", error);
    return next(
      new ErrorHandler(error.message || "Internal Server Error", 500)
    );
  }
});

const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Email and password is required.", 400));
  }
  const user = await User.findOne({ email, accountVerified: true }).select(
    "+password"
  );
  if (!user) {
    return next(new ErrorHandler("Invalid email or password.", 400));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password.", 400));
  }
  sendToken(user, 200, "user logged in successfully", res);
});

const logout = catchAsyncError(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure: true,
      sameSite: "none",
      domain: "https://imagifai.netlify.app",
    })
    .json({
      success: true,
      message: "log out successfully",
    });
});

const forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({
    email: req.body.email,
    accountVerified: true,
  });
  if (!user) {
    return next(new ErrorHandler("user not found", 404));
  }
  const resetToken = user.generateResetPasswordToken();

  await user.save({ validateBeforeSave: false });
  const resetPasswordUrl = `${process.env.FRONTEND_URL}/forgot/reset/${resetToken}`;

  const message = `your reset password token is : \n\n ${resetPasswordUrl} \n\n if you have not requested, ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Reset your password !!",
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully.`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new ErrorHandler(
        error.message ? error.message : "can not send reset password token.",
        500
      )
    );
  }
});

const resetPassword = catchAsyncError(async (req, res, next) => {
  const { token } = req.params;
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(
      new ErrorHandler(
        "Reset password token is invalid or has been expired.",
        400
      )
    );
  }
  if (req.body.password !== req.body.confirmPassword) {
    return next(
      new ErrorHandler(" password and confirm password do not match.", 400)
    );
  }

  user.password = req.body.password;
  user.resetPasswordExpire = undefined;
  user.resetPasswordToken = undefined;
  await user.save();

  sendToken(user, 200, "password reset successfully.", res);
});
const getUser = catchAsyncError(async (req, res, next) => {
  const user = req.user;

  res.status(200).json({
    success: true,
    user,
  });
});

const userCredits = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    res.json({
      success: true,
      credits: user.creditBalance,
      user: { name: user.name },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
const paymentRazorpay = async (req, res) => {
  try {
    const { planId } = req.body;
    const userId = req.user?._id;

    if (!userId || !planId) {
      return res.json({ success: false, Message: "Invalid User or Plan Id" });
    }

    let credits, plan, amount;
    switch (planId) {
      case "Basic":
        plan = "Basic";
        credits = 11;
        amount = 10;
        break;
      case "Advanced":
        plan = "Advanced";
        credits = 60;
        amount = 50;
        break;
      case "Business":
        plan = "Business";
        credits = 350;
        amount = 250;
        break;
      default:
        return res.json({ success: false, Message: "Plan not found!" });
    }

    const newTransaction = await transactionModel.create({
      userId,
      plan,
      amount,
      credits,
      date: Date.now(),
    });

    const options = {
      amount: amount * 100, // Convert to paise
      currency: process.env.CURRENCY || "INR",
      receipt: newTransaction._id.toString(),
      payment_capture: 1, // Auto-capture payment
    };

    const order = await razorpayInstance.orders.create(options);
    if (!order) {
      return res.json({ success: false, Message: "Order creation failed" });
    }

    res.json({ success: true, order });
  } catch (error) {
    console.error("Payment Error:", error);
    res.json({ success: false, Message: error.message });
  }
};
const verifyRazorpay = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.json({ success: false, Message: "Invalid payment data" });
    }

    // Generate expected signature
    const secret = process.env.RAZORPAY_KEY_SECRET;
    const generatedSignature = crypto
      .createHmac("sha256", secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.json({
        success: false,
        Message: "Payment verification failed",
      });
    }

    // Fetch order details
    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);
    if (!orderInfo) {
      return res.json({ success: false, Message: "Order not found" });
    }

    const transactionData = await transactionModel.findById(orderInfo.receipt);
    if (!transactionData || transactionData.payment) {
      return res.json({
        success: false,
        Message: "Invalid transaction or already paid",
      });
    }

    // Update user credits
    const userData = await User.findById(transactionData.userId);
    const updatedCredits = userData.creditBalance + transactionData.credits;

    await User.findByIdAndUpdate(userData._id, {
      creditBalance: updatedCredits,
    });
    await transactionModel.findByIdAndUpdate(transactionData._id, {
      payment: true,
    });

    res.json({ success: true, Message: "Credits added successfully" });
  } catch (error) {
    console.error("Verification Error:", error);
    res.json({ success: false, Message: error.message });
  }
};

export {
  register,
  verifyOtp,
  login,
  logout,
  getUser,
  forgotPassword,
  resetPassword,
  userCredits,
  verifyRazorpay,
  paymentRazorpay,
};
