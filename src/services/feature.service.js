const httpStatus = require("http-status");
const { Feature } = require("../models");
const ApiError = require("../utils/ApiError");
/**
 * Create a Feature
 * @param {Object} FeatureBody
 * @returns {Promise<Feature>}
 */
const createFeature = async (featureBody) => {
  return await Feature.create(featureBody);
};

/**
 * Get all Feature
 * @param {Filter Options}
 * @returns {Promise<Feature>}
 */
const queryFeature = async (filter, options) => {
  return await Feature.paginate(filter, options);
};

/**
 * Get single feature
 * @param {*} featureId
 * @returns {Promise<Feature>}
 */
const getFeature = async (featureId) => {
  const feature = await Feature.findById(featureId);
  if (!feature) {
    throw new ApiError(httpStatus.NOT_FOUND, "No Feature Video found");
  }
  return feature;
};

/**
 * Update Feature
 * @param {*} featureId
 * @param {*} updateBody
 * @returns {Promise<Feature>}
 */
const updateFeature = async (featureId, updateBody) => {
  const feature = await Feature.findById(featureId);
  if (!feature) {
    throw new ApiError(httpStatus.NOT_FOUND, "No Feature video found");
  }
  Object.assign(feature, updateBody);
  await feature.save();
  return feature;
};

/**
 * Delete Feature
 * @param {*} featureId
 * @returns {Promise<Feature>}
 */
const deleteFeature = async (featureId) => {
  const feature = await Feature.findById(featureId);
  if (!feature) {
    throw new ApiError(httpStatus.NOT_FOUND, "No Feature found");
  }
  await feature.remove();
  return { msg: "Feature deleted" };
};

/**
 *
 * @param {*} search
 * @returns {Promise<Feature>}
 */
const searchFeature = async (search) => {
  return await Feature.find({ $text: { $search: search } });
};
module.exports = {
  createFeature,
  updateFeature,
  getFeature,
  queryFeature,
  deleteFeature,
  searchFeature,
};
