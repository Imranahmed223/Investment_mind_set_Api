const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { stockServices } = require("../services");
const config = require("../config/config");

const createStock = catchAsync(async (req, res) => {
  let createBody = req.body;
  if (req.file) createBody.photoPath = req.file.filename;
  if (createBody.analysis)
    createBody.analysis = JSON.parse(createBody.analysis);
  const stock = await stockServices.createStock(createBody);
  if (stock.photoPath) stock.photoPath = `${config.rootPath}${stock.photoPath}`;
  res.status(httpStatus.CREATED).send(stock);
});

const queryStock = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["firstName", "role"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await stockServices.queryStock(filter, options);
  result.results.forEach((res) => {
    if (res.photoPath) res.photoPath = config.rootPath + res.photoPath;
  });
  res.send(result);
});

const getStock = catchAsync(async (req, res) => {
  const stock = await stockServices.getStock(req.params.id);
  if (!stock) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Feature not found");
  }
  if (stock.photoPath) stock.photoPath = config.rootPath + stock.photoPath;
  res.send(stock);
});

const updateStock = catchAsync(async (req, res) => {
  let updateStockBody = req.body;
  if (req.file) updateStockBody.photoPath = req.file.filename;
  if (updateStockBody.analysis)
    updateStockBody.analysis = JSON.parse(updateStockBody.analysis);
  const stock = await stockServices.updateStock(req.params.id, updateStockBody);
  res.send(stock);
});

const deleteStock = catchAsync(async (req, res) => {
  const stock = await stockServices.deleteStock(req.params.id);
  res.send(stock);
});

const searchStock = catchAsync(async (req, res) => {
  const stock = await stockServices.searchStock(req.query.search);
  stock.forEach((d) => {
    if (d.photoPath) d.photoPath = config.rootPath + d.photoPath;
  });
  res.send(stock);
});
module.exports = {
  createStock,
  queryStock,
  getStock,
  updateStock,
  deleteStock,
  searchStock,
};
