const httpStatus = require("http-status");
const { Stock } = require("../models");
const ApiError = require("../utils/ApiError");

/**
 * Create a role
 * @param {Object} stockBody
 * @returns {Promise<Stock>}
 */
const createStock = async (stockBody) => {
  return await Stock.create(stockBody);
};

/**
 *
 * @param {*} filter
 * @param {*} options
 * @returns {Promise<Results>}
 */
const queryStock = async (filter, options) => {
  return await Stock.paginate(filter, options);
};

/**
 *
 * @param {*} id
 * @returns {Promise<Stock>}
 */
const getStock = async (id) => {
  return await Stock.findById(id);
};

/**
 *
 * @param {*} id
 * @param {*} updateBody
 * @returns {Promise<Stock>}
 */
const updateStock = async (id, updateBody) => {
  const stock = await Stock.findById(id);
  if (!stock) {
    throw new ApiError(httpStatus.NOT_FOUND, "No stock found");
  }
  Object.assign(stock, updateBody);
  await stock.save();
  return stock;
};

/**
 *
 * @param {*} id
 * @returns {Promise<Sting>}
 */
const deleteStock = async (id) => {
  const stock = await Stock.findById(id);
  if (!stock) {
    throw new ApiError(httpStatus.NOT_FOUND, "No stock found");
  }
  await stock.remove();
  return { msg: "Stock deleted" };
};

/**
 *
 * @param {*} search
 * @returns {Promise<Results>}
 */
const searchStock = async (search) => {
  return Stock.find({ $text: { $search: search } });
};
module.exports = {
  createStock,
  queryStock,
  getStock,
  updateStock,
  deleteStock,
  searchStock,
};
