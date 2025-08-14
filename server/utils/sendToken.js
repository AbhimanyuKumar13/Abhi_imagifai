export const sendToken = async (user, statusCode, message, res) => {
  const token = await user.generateToken();

  const cookieExpireDays = parseInt(process.env.JWT_EXPIRE) || 7;

  res
    .status(statusCode)
    .cookie("token", token, {
      expires: new Date(Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: true,
      sameSite: "none",
      domain: "https://imagifai.netlify.app",
    })
    .json({
      success: true,
      message,
      token,
      user,
    });
};
