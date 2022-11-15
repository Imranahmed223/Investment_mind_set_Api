const httpStatus = require("http-status");
const { Analysis } = require("../models");
const ApiError = require("../utils/ApiError");
/**
 * Create a Analysis
 * @param {Object} analysisBody
 * @returns {Promise<Analysis>}
 */
const createAnalysis = async (analysisBody) => {
  return await Analysis.create(analysisBody);
};

/**
 * Get all Analysis
 * @param {Filter Options}
 * @returns {Promise<Analysis>}
 */
const queryAnalysis = async (filter, options) => {
  return await Analysis.paginate(filter, options);
};

/**
 *
 * @param {*} analysisId
 * @returns {Promise<Analysis>}
 */
const getAnalysis = async (analysisId) => {
  const analysis = await Analysis.findById(analysisId);
  if (!analysis) {
    throw new ApiError(httpStatus.NOT_FOUND, "No Analysis found");
  }
  return analysis;
};

/**
 *
 * @param {*} analysisId
 * @param {*} updateBody
 * @returns {Promise<Analysis>}
 */
const updateAnalysis = async (analysisId, updateBody) => {
  const analysis = await Analysis.findById(analysisId);
  if (!analysis) {
    throw new ApiError(httpStatus.NOT_FOUND, "No Analysis found");
  }
  Object.assign(analysis, updateBody);
  await analysis.save();
  return analysis;
};

/**
 *
 * @param {*} analysisId
 * @returns {Promise<Analysis>}
 */
const deleteAnalysis = async (analysisId) => {
  const analysis = await Analysis.findById(analysisId);
  if (!analysis) {
    throw new ApiError(httpStatus.NOT_FOUND, "No Analysis found");
  }
  await analysis.remove();
  return { msg: "Analysis deleted" };
};
/**
 *
 * @param {*} search
 * @returns {Promise<Analysis>}
 */
const searchAnalysis = async (search) => {
  return await Analysis.find({ $text: { $search: search } });
};
module.exports = {
  createAnalysis,
  updateAnalysis,
  getAnalysis,
  queryAnalysis,
  deleteAnalysis,
  searchAnalysis,
};
