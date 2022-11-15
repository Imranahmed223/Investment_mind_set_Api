const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const {
  authService,
  userService,
  tokenService,
  emailService,
} = require("../services");
const { User } = require("../models");
const config = require("../config/config");
const ApiError = require("../utils/ApiError");
const { v4: uuidv4 } = require("uuid");
const { default: axios } = require("axios");

/**
 * Registration Module
 */
const register = catchAsync(async (req, res) => {
  let createUserBody = req.body;
  if (req.file) createUserBody.photoPath = req.file.filename;
  const user = await userService.createUser(createUserBody);
  res.status(httpStatus.OK).send(user);
});

/**
 * Login Module
 */
const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.login(email, password);
  user.photoPath = config.rootPath + user.photoPath;
  let tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({ user, tokens });
});

/*
 * Logout Module
 */
const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body);
  res.status(httpStatus.OK).send({ success: true });
});

/**
 * Forgot Password Module
 */
const forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No user found");
  }
  const OTP = Math.floor(1000 + Math.random() * 9000);
  res.send({ OTP });
});

/**
 * Reset Password Module
 */
const resetPasswordviaSms = catchAsync(async (req, res) => {
  const { email, newPassword } = req.body;
  const user = await authService.resetPasswordviaSms(email, newPassword);
  let tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
});

/**
 * Change Password Module
 */
const changePassword = catchAsync(async (req, res) => {
  const user = await authService.changePassword(req.body);
  // const emailMessage = {
  //   to: user.email,
  //   from: {
  //     email: config.email.fromEmail,
  //   },
  //   subject: "Password Change",
  //   html: `
  //   <p>Your password changed successfully.</p>
  //   `,
  // };
  // emailService.sendMail(emailMessage);
  res.status(httpStatus.OK).json({ success: true, user });
});

const loginWithGoogle = catchAsync(async (req, res) => {
  const { email, name, picture } = req.body;
  const user = await authService.loginWithGoogle(email, name, picture);
  let tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({ user, tokens });
});

const loginWithFacebook = catchAsync(async (req, res) => {
  const { email, first_name, last_name, picture } = req.body;
  const user = await authService.loginWithFacebook(
    email,
    first_name,
    last_name,
    picture
  );
  let tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({ user, tokens });
});
module.exports = {
  register,
  login,
  logout,
  forgotPassword,
  resetPasswordviaSms,
  changePassword,
  loginWithGoogle,
  loginWithFacebook,
};
