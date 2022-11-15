const Joi = require("joi");
const { objectId } = require("./custom.validation");
const createFeature = {
  body: Joi.object()
    .keys({
      name: Joi.string().required().description("Name is required"),
    })
    .min(1),
};

const getFeature = {
  query: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

const updateFeature = {
  query: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string().allow().optional(),
      photoPath: Joi.string().allow().optional(),
    })
    .min(1),
};

const deleteFeature = {
  query: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

const searchFeature = {
  query: Joi.object()
    .keys({
      search: Joi.string().required().description("search query is required"),
    })
    .min(1),
};
module.exports = {
  createFeature,
  getFeature,
  updateFeature,
  deleteFeature,
  searchFeature,
};
