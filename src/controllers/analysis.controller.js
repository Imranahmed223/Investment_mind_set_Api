const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { analysisService } = require("../services");
const config = require("../config/config");
const createAnalysis = catchAsync(async (req, res) => {
  let createBody = req.body;
  if (req.file) createBody.photoPath = req.file.filename;
  const analysis = await analysisService.createAnalysis(createBody);
  analysis.photoPath = `${config.rootPath}${analysis.photoPath}`;
  res.status(httpStatus.CREATED).send(analysis);
});

const queryAnalysis = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["firstName", "role"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await analysisService.queryAnalysis(filter, options);
  result.results.forEach((res) => {
    res.photoPath = config.rootPath + res.photoPath;
  });
  res.send(result);
});

const getAnalysis = catchAsync(async (req, res) => {
  const analysis = await analysisService.getAnalysis(req.params.id);
  if (!analysis) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Analysis not found");
  }
  analysis.photoPath = config.rootPath + analysis.photoPath;
  res.send(analysis);
});

const updateAnalysis = catchAsync(async (req, res) => {
  let updateAnalysisBody = req.body;
  const analysis = await analysisService.updateAnalysis(
    req.params.id,
    updateAnalysisBody
  );
  res.send(analysis);
});

const deleteAnalysis = catchAsync(async (req, res) => {
  const analysis = await analysisService.deleteAnalysis(req.params.id);
  res.send(analysis);
});

const searchAnalysis = catchAsync(async (req, res) => {
  console.log(req.query);
  const analysis = await analysisService.searchAnalysis(req.query.search);
  analysis.forEach((d) => {
    d.photoPath = config.rootPath + d.photoPath;
  });
  res.send(analysis);
});
module.exports = {
  createAnalysis,
  queryAnalysis,
  getAnalysis,
  updateAnalysis,
  deleteAnalysis,
  searchAnalysis,
};
