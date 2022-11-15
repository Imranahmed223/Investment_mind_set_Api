const Joi = require("joi");
const { password } = require("./custom.validation");

const register = {
  body: Joi.object().keys({
    firstName: Joi.string().required().description("First name is required"),
    lastName: Joi.string().required().description("Last name is required"),
    email: Joi.string().email().required().description("Email is required"),
    userName: Joi.string().required().description("Username is required"),
    password: Joi.string().required().description("Password is required"),
  }),
};
const login = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const changePassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().required(),
  }),
};
const resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
  }),
};

const loginWithGoogle = {
  body: Joi.object()
    .keys({
      email: Joi.string().email().required(),
      name: Joi.string().required(),
      picture: Joi.string().allow().optional(),
    })
    .min(2)
    .max(3),
};
const loginWithFacebook = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    picture: Joi.string().required(),
  }),
};
module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  changePassword,
  loginWithGoogle,
  loginWithFacebook,
};
