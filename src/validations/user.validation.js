const Joi = require("joi");
const { password, objectId } = require("./custom.validation");

const createUser = {
  body: Joi.object().keys({}),
};

const getUsers = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      firstName: Joi.string().allow().optional(),
      lastName: Joi.string().allow().optional(),
      userName: Joi.string().allow().optional(),
      password: Joi.string().allow().optional(),
      role: Joi.string().allow().optional(),
      photoPath: Joi.string().allow().optional(),
      premiumUser: Joi.boolean().allow().optional(),
      lastPaymentDate: Joi.date().allow().optional(),
      active: Joi.boolean().allow().optional(),
      suspend: Joi.boolean().allow().optional(),
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const deviceToken = {
  body: Joi.object()
    .keys({
      deviceToken: Joi.string().required(),
    })
    .min(1)
    .max(1),
};

const checkoutWithStripe = {
  body: Joi.object()
    .keys({
      number: Joi.string().required().description("card number is required"),
      exp_month: Joi.number()
        .required()
        .description("Expire Month is required"),
      exp_year: Joi.number().required().description("Expired Year is required"),
      cvc: Joi.string().required().description("CVC is required"),
    })
    .min(1),
};
module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  deviceToken,
  checkoutWithStripe,
};
