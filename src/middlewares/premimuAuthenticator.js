const httpStatus = require("http-status");
const { userService } = require("../services");
const ApiError = require("../utils/ApiError");

const verify = async (req, res, resolve, reject) => {
  user = req.user;
  if (user.role === "Admin") {
    resolve();
  } else {
    if (!user.lastPaymentDate) {
      diff = (new Date() - user.createdAt) / 1000 / 60 / 60 / 24;
      if (diff >= 1) {
        return reject(
          new ApiError(
            httpStatus.BAD_REQUEST,
            "Please pay premium app charges to use app"
          )
        );
      } else resolve();
    } else {
      diff = (new Date() - user.lastPaymentDate) / 1000 / 60 / 60 / 24;
      if (diff >= 30) {
        const updateUserBody = {
          premiumUser: false,
        };
        await userService.updateUserById(user.id, updateUserBody, user.id);
        return reject(
          new ApiError(
            httpStatus.BAD_REQUEST,
            "Please pay premium app charges to use app"
          )
        );
      } else resolve();
    }
  }
};

const primiumAuth = async (req, res, next) => {
  return new Promise((resolve, reject) => {
    verify(req, res, resolve, reject);
  })
    .then(() => next())
    .catch((err) => next(err));
};

module.exports = primiumAuth;
