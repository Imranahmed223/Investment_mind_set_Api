const Joi = require("joi");
const { objectId } = require("./custom.validation");
const createStock = {
  body: Joi.object()
    .keys({
      title: Joi.string().required().description("Title is required"),
      company: Joi.string().allow().optional(),
      analysis: Joi.any().allow().optional(),
      sentiment: Joi.number().allow().optional(),
    })
    .min(1),
};

const queryStock = {
  query: Joi.object().keys({
    page: Joi.number().allow().optional(),
    limit: Joi.number().allow().optional(),
    skip: Joi.number().allow().optional(),
  }),
};

const getStock = {
  query: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

const updateStock = {
  query: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      title: Joi.string().allow().optional(),
      company: Joi.string().allow().optional(),
      analysis: Joi.any().allow().optional(),
      photoPath: Joi.any().allow().optional(),
      sentiment: Joi.number().allow().optional(),
    })
    .min(1),
};

const deleteStock = {
  query: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

const searchStock = {
  query: Joi.object()
    .keys({
      search: Joi.string().required(),
    })
    .min(1),
};

module.exports = {
  createStock,
  queryStock,
  getStock,
  updateStock,
  deleteStock,
  searchStock,
};
