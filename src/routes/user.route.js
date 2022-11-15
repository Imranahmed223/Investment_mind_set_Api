const express = require("express");
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const userValidation = require("../validations/user.validation");
const userController = require("../controllers/user.controller");
const { fileUpload } = require("../utils/fileUpload");
const router = express.Router();

router
  .route("/")
  .get(auth(), validate(userValidation.getUsers), userController.getUsers);

router
  .route("/:userId")
  .get(auth(), validate(userValidation.getUser), userController.getUser)
  .patch(
    auth(),
    fileUpload.single("photoPath"),
    validate(userValidation.updateUser),
    userController.updateUser
  )
  .delete(
    auth(),
    validate(userValidation.deleteUser),
    userController.deleteUser
  );

router
  .route("/add/token")
  .post(
    auth(),
    validate(userValidation.deviceToken),
    userController.addUserDeviceToken
  );

router
  .route("/remove/token")
  .post(
    auth(),
    validate(userValidation.deviceToken),
    userController.removeUserDeviceToken
  );

router
  .route("/stripe-checkout")
  .post(
    auth(),
    validate(userValidation.checkoutWithStripe),
    userController.checkoutWithStripe
  );
module.exports = router;
