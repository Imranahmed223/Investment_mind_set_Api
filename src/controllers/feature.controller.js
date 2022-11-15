const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { featureService } = require("../services");
const config = require("../config/config");

const createFeature = catchAsync(async (req, res) => {
  let createBody = req.body;
  if (req.file) createBody.photoPath = req.file.filename;
  else
    throw new ApiError(httpStatus.BAD_REQUEST, "Please upload a video file!");
  const feature = await featureService.createFeature(createBody);
  feature.photoPath = `${config.rootPath}${feature.photoPath}`;
  res.status(httpStatus.CREATED).send(feature);
});

const queryFeature = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["firstName", "role"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await featureService.queryFeature(filter, options);
  result.results.forEach((res) => {
    res.photoPath = config.rootPath + res.photoPath;
  });
  res.send(result);
});

const getFeature = catchAsync(async (req, res) => {
  const feature = await featureService.getFeature(req.params.id);
  if (!feature) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Feature not found");
  }
  feature.photoPath = config.rootPath + feature.photoPath;
  res.send(feature);
});

const updateFeature = catchAsync(async (req, res) => {
  let updateFeatureBody = req.body;
  if (req.file) updateFeatureBody.photoPath = req.file.filename;
  const feature = await featureService.updateFeature(
    req.params.id,
    updateFeatureBody
  );
  res.send(feature);
});

const deleteFeature = catchAsync(async (req, res) => {
  const feature = await featureService.deleteFeature(req.params.id);
  res.send(feature);
});

const searchFeature = catchAsync(async (req, res) => {
  console.log(req.query);
  const features = await featureService.searchFeature(req.query.search);
  features.forEach((d) => {
    d.photoPath = config.rootPath + d.photoPath;
  });
  res.send(features);
});
module.exports = {
  createFeature,
  queryFeature,
  getFeature,
  updateFeature,
  deleteFeature,
  searchFeature,
};
