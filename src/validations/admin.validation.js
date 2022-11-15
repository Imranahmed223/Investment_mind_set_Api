const Joi = require("joi");
const { password, objectId } = require("./custom.validation");

const createAdmin = {
  body: Joi.object()
    .keys({
      firstName: Joi.string().required(),
      lastName: Joi.string().required(),
      email: Joi.string().email().required(),
      userName: Joi.string().required(),
      password: Joi.string().custom(password),
      role: Joi.string().allow().optional(),
    })
    .min(1),
};

const getAdmin = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

const updateAdmin = {
  params: Joi.object().keys({
    id: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      firstName: Joi.string().allow().optional(),
      lastName: Joi.string().allow().optional(),
      email: Joi.string().email().allow().optional(),
      userName: Joi.string().allow().optional(),
      password: Joi.string().custom(password).allow().optional(),
      active: Joi.boolean().allow().optional(),
      suspended: Joi.boolean().allow().optional(),
      role: Joi.string().allow().optional(),
    })
    .min(1),
};

const deleteAdmin = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};
const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};
module.exports = {
  createAdmin,
  getAdmin,
  updateAdmin,
  deleteAdmin,
  login,
  logout,
};
