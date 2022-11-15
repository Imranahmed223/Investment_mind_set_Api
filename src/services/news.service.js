const httpStatus = require("http-status");
const { News } = require("../models");
const ApiError = require("../utils/ApiError");
/**
 * Create a news
 * @param {Object} newsBody
 * @returns {Promise<News>}
 */
const createNews = async (newsBody) => {
  return await News.create(newsBody);
};

/**
 * Get all news
 * @param {Filter Options}
 * @returns {Promise<News>}
 */
const queryNews = async (filter, options) => {
  return await News.paginate(filter, options);
};

/**
 *
 * @param {*} newsId
 * @returns {Promise<News>}
 */
const getNews = async (newsId) => {
  const news = await News.findById(newsId);
  if (!news) {
    throw new ApiError(httpStatus.NOT_FOUND, "No news found");
  }
  return news;
};

/**
 *
 * @param {*} newsId
 * @param {*} updateBody
 * @returns {Promise<News>}
 */
const updateNews = async (newsId, updateBody) => {
  const news = await News.findById(newsId);
  if (!news) {
    throw new ApiError(httpStatus.NOT_FOUND, "No news found");
  }
  Object.assign(news, updateBody);
  await news.save();
  return news;
};

/**
 *
 * @param {*} newsId
 * @returns {Promise<News>}
 */
const deleteNews = async (newsId) => {
  const news = await News.findById(newsId);
  if (!news) {
    throw new ApiError(httpStatus.NOT_FOUND, "No news found");
  }
  await news.remove();
  return { msg: "News deleted" };
};

const searchNews = async (search) => {
  return await News.find({ $text: { $search: search } });
};
module.exports = {
  createNews,
  updateNews,
  getNews,
  queryNews,
  deleteNews,
  searchNews,
};
