const httpStatus = require("http-status");
const { default: mongoose } = require("mongoose");
const { Report } = require("../models");
const ApiError = require("../utils/ApiError");
/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<Report>}
 */
const createReport = async (reportBody) => {
  return await Report.create(reportBody);
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
const getReports = async (filter, options) => {
  return await Report.paginate(filter, options);
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getReportById = async (id) => {
  return await Report.findById(id).populate("reportedBy");
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<Report>}
 */
const updateReport = async (reportId, updateBody) => {
  const report = await getReportById(reportId);
  if (!report) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Report not found!");
  }
  Object.assign(report, updateBody);
  await report.save();
  return report;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteReport = async (reportId) => {
  const report = await getReportById(reportId);
  if (!report) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Report not found!");
  }
  await report.remove();
  return (response = { success: true, message: "report deleted!" });
};

const getReportsOfLoggedUser = async (userId) => {
  return await Report.find({ reportBody: mongoose.Types.ObjectId(userId) });
};
module.exports = {
  createReport,
  getReports,
  getReportById,
  updateReport,
  deleteReport,
  getReportsOfLoggedUser,
};
