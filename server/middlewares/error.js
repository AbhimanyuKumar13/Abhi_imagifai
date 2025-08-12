class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;

    // Captures the stack trace and excludes constructor from it
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorMiddleware = (err, req, res, next) => {
  // Set default values if not already set
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal server error.";

  console.error("🔥 Error log:", err);

  // Handle Mongoose bad ObjectId
  if (err.name === "CastError") {
    err = new ErrorHandler(`Invalid ${err.path}`, 400);
  }

  // Handle JWT invalid
  if (err.name === "JsonWebTokenError") {
    err = new ErrorHandler("JSON Web Token is invalid, try again.", 400);
  }

  // Handle JWT expired
  if (err.name === "TokenExpiredError") {
    err = new ErrorHandler("JSON Web Token has expired, try again.", 400);
  }

  // Handle Mongoose duplicate key error
  if (err.code === 11000) {
    const duplicateField = Object.keys(err.keyValue)[0];
    err = new ErrorHandler(`Duplicate field: ${duplicateField} already exists.`, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

export default ErrorHandler;
