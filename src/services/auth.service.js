const httpStatus = require("http-status");
const tokenService = require("./token.service");
const userService = require("./user.service");
const Token = require("../models/token.model");
const ApiError = require("../utils/ApiError");
const crypto = require("crypto");
const { tokenTypes } = require("../config/tokens");
const config = require("../config/config");
const { User } = require("../models");
const _ = require("lodash");
const { default: axios } = require("axios");
const fs = require("fs");
const logger = require("../config/logger");
const Path = require("path");

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "incorrect email id or user name or password"
    );
  } else if (user.suspended) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Your account has been suspended! Please contact your adminstrator"
    );
  }
  const updateBody = user;
  updateBody.active = true;
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise}
 */
const logout = async (data) => {
  let refreshToken = data.refreshToken;
  const refreshTokenDoc = await Token.findOne({
    token: refreshToken,
    type: tokenTypes.REFRESH,
    blacklisted: false,
  });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, "Not found");
  }
  const userId = refreshTokenDoc.user;
  await User.updateOne({ _id: userId }, { $set: { active: false } });
  await refreshTokenDoc.remove();
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return await User.findById(id);
};
/**
 *
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const approveUser = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "No user found!");
  }
  if (user.status === "approved") {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "User status is already approved!"
    );
  }
  const updatedBody = {
    status: "approved",
  };
  Object.assign(user, updatedBody);
  await user.save();
  return user;
};
/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<Object>}
 */
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(
      refreshToken,
      tokenTypes.REFRESH
    );
    // if(refreshTokenDoc.length)
    if (!_.isEmpty(refreshTokenDoc)) {
      const user = await userService.getUserById(refreshTokenDoc.user);
      if (!user) {
        throw new Error();
      }
      await refreshTokenDoc.remove();
      return tokenService.generateAuthTokens(user);
    } else {
      throw new ApiError(httpStatus.BAD_REQUEST, "No token found");
    }
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate");
  }
};

const changePassword = async (body) => {
  const { email, user_id, oldPassword, newPassword } = body;
  const user = await User.findOne({ email, user_id });
  if (!user) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "No user found, please try with correct email and membership id!"
    );
  }
  const check = await user.isPasswordMatch(oldPassword);
  if (!check) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Incorrect old password");
  } else {
    user.password = newPassword;
    await user.save();
    return user;
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise}
 */
const resetPassword = async (resetPasswordToken, newPassword) => {
  try {
    const resetPasswordTokenDoc = await tokenService.verifyToken(
      resetPasswordToken,
      tokenTypes.RESET_PASSWORD
    );
    const user = await userService.getUserById(resetPasswordTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await userService.updateUserById(user.id, { password: newPassword });
    await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Password reset failed");
  }
};

/**
 * Reset password
 * @param {string} email
 * @param {string} newPassword
 * @param {string} oldPassword
 * @returns {Promise}
 */
const resetPasswordviaEmail = async (email, newPassword) => {
  try {
    const user = await userService.getUserByEmail(email);
    await userService.updateUserById(user.id, { password: newPassword });
    const result = "Password Updated";
    return result;
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Password reset failed");
  }
};

const loginWithGoogle = async (email, name, picture) => {
  let user = await User.findOne({ email });
  if (user) return user;
  const [firstName, lastName] = name.split(" ");
  const password = await generateRandomPassword();
  const userName = email.split("@")[0];
  const newUser = {
    firstName,
    lastName,
    email,
    password,
    userName,
    photoPath: picture,
    role: "User",
  };
  user = await User.create(newUser);
  return user;
};

const loginWithFacebook = async (email, first_name, last_name, picture) => {
  let user = await User.findOne({ email });
  if (user) return user;
  const photoPath = `photo-${new Date()}.jpg`;
  if (picture) {
    const result = downloadImage(picture, photoPath);
    result
      .then((response) => {
        logger.info("File save successfully ", response);
      })
      .catch((err) => {
        logger.error("Unable to save file ", err);
      });
  }
  const password = await generateRandomPassword();
  const userName = email.split("@")[0];
  const newUser = {
    firstName: first_name,
    lastName: last_name,
    email,
    password,
    userName,
    photoPath: photoPath,
    role: "User",
  };
  user = await User.create(newUser);
  return user;
};

async function downloadImage(url, photoPath) {
  const path = Path.resolve("public", "uploads", photoPath);
  const writer = fs.createWriteStream(path);

  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });
  response.data.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}

const generateRandomPassword = async () => {
  length = 8;
  wishlist =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$";
  return Array.from(crypto.randomFillSync(new Uint32Array(length)))
    .map((x) => wishlist[x % wishlist.length])
    .join("");
};
module.exports = {
  login,
  logout,
  approveUser,
  refreshAuth,
  resetPassword,
  resetPasswordviaEmail,
  changePassword,
  loginWithGoogle,
  loginWithFacebook,
};
