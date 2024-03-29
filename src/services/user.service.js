const httpStatus = require("http-status");
const { default: mongoose } = require("mongoose");
const { User, Profile } = require("../models");
const ApiError = require("../utils/ApiError");
/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email Already Taken");
  }
  const user = await User.create(userBody);
  const profileBody = {
    user: user.id,
  };
  await Profile.create(profileBody);
  return user;
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
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
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return await User.findOne({ email });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody, id) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  if (user.id.toString() !== id) {
    throw new ApiError(httpStatus.FORBIDDEN, "Forbidden");
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId, id) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "No account found for this user!"
    );
  }
  if (user.id.toString() !== id) {
    throw new ApiError(httpStatus.FORBIDDEN, "Forbidden");
  }
  await Profile.deleteOne({ user: mongoose.Types.ObjectId(user.id) });
  await user.remove();
  return (response = { msg: "user deleted" });
};

module.exports = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
};
