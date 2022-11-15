const httpStatus = require("http-status");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { newsService } = require("../services");
const config = require("../config/config");
const createNews = catchAsync(async (req, res) => {
  let createBody = req.body;
  if (req.file) createBody.photoPath = req.file.filename;
  const news = await newsService.createNews(createBody);
  news.photoPath = `${config.rootPath}${news.photoPath}`;
  res.status(httpStatus.CREATED).send(news);
});

const queryNews = catchAsync(async (req, res, next) => {
  console.log("Get News -------------- ");
  const filter = pick(req.query, ["firstName", "role"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await newsService.queryNews(filter, options);
  result.results.forEach((res) => {
    res.photoPath = config.rootPath + res.photoPath;
  });
  res.send(result);
});

const getNews = catchAsync(async (req, res) => {
  console.log("Get News -------------- ");
  const news = await newsService.getNews(req.params.id);
  if (!news) {
    throw new ApiError(httpStatus.BAD_REQUEST, "News not found");
  }
  news.photoPath = config.rootPath + news.photoPath;
  res.send(news);
});

const updateNews = catchAsync(async (req, res) => {
  let updateNewsBody = req.body;
  const news = await newsService.updateNews(req.params.id, updateNewsBody);
  res.send(news);
});

const deleteNews = catchAsync(async (req, res) => {
  const news = await newsService.deleteNews(req.params.id);
  res.send(news);
});

const searchNews = catchAsync(async (req, res) => {
  console.log(req.query);
  const news = await newsService.searchNews(req.query.search);
  news.forEach((d) => {
    d.photoPath = config.rootPath + d.photoPath;
  });
  res.send(news);
});
module.exports = {
  createNews,
  queryNews,
  getNews,
  updateNews,
  deleteNews,
  searchNews,
};
