const Joi = require("joi");
const { objectId } = require("./custom.validation");

const createNews = {
  body: Joi.object().keys({
    title: Joi.string().required().description("Title is required"),
    description: Joi.string().required().description("Description is required"),
  }),
};

const getNews = {
  query: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

const updateNews = {
  query: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      title: Joi.string().allow().optional(),
      description: Joi.string().allow().optional(),
      photoPath: Joi.string().allow().optional(),
    })
    .min(1),
};

const deleteNews = {
  query: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

const searchNews = {
  query: Joi.object()
    .keys({
      search: Joi.string().required().description("search query is required"),
    })
    .min(1),
};
module.exports = {
  createNews,
  getNews,
  updateNews,
  deleteNews,
  searchNews,
};
