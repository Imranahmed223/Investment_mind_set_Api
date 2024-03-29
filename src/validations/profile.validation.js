const Joi = require("joi");
const { password, objectId } = require("./custom.validation");

const createProfile = {
  body: Joi.object().keys({
    user: Joi.required().custom(objectId),
    bio: Joi.string().allow().optional(),
    followers: Joi.array().allow().optional(),
    following: Joi.array().allow().optional(),
  }),
};

const getProfile = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

const updateProfile = {
  params: Joi.object().keys({
    id: Joi.required().custom(objectId),
  }),
  body: Joi.object().keys({
    user: Joi.allow().optional().custom(objectId),
    bio: Joi.string().allow().optional(),
    followers: Joi.array().allow().optional(),
    following: Joi.array().allow().optional(),
  }),
};
module.exports = {
  createProfile,
  getProfile,
  updateProfile,
};
