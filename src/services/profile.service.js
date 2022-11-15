const httpStatus = require("http-status");
const { User, Profile } = require("../models");
const ApiError = require("../utils/ApiError");
/**
 * Create a user
 * @param {Object} profileBody
 * @returns {Promise<Profile>}
 */
const createProfile = async (profileBody) => {
  const user = await User.findById(profileBody.user);
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "No user found.");
  }
  const profile = await Profile.create(profileBody);
  return profile;
};

/**
 * Query for users
 * @returns {Promise<QueryResult>}
 */
const queryProfiles = async (filter, options) => {
  const profiles = await Profile.paginate(filter, options);
  return profiles;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<Profile>}
 */
const getProfileByUserId = async (id) => {
  return await Profile.findOne({ user: id }).populate("user");
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateProfileById = async (userId, updateBody) => {
  const profile = await getProfileByUserId(userId);
  if (!profile) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Profile not found");
  }
  Object.assign(profile, updateBody);
  await profile.save();
  await Profile.populate(profile, { path: "user" });
  return profile;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteProfileById = async (userId) => {
  const profile = await getUserById(userId);
  if (!profile) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "No account found for this user!"
    );
  }
  await profile.remove();
  return (response = { msg: "profile deleted" });
};

module.exports = {
  createProfile,
  queryProfiles,
  getProfileByUserId,
  updateProfileById,
  deleteProfileById,
};
