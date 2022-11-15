const express = require("express");
const validate = require("../middlewares/validate");
const authValidation = require("../validations/auth.validation");
const { authController } = require("../controllers/index");
const { fileUpload } = require("../utils/fileUpload");
const auth = require("../middlewares/auth");
const router = express.Router();

router.post(
  "/register",
  [fileUpload.single("photoPath"), validate(authValidation.register)],
  authController.register
);
router.post("/login", validate(authValidation.login), authController.login);
router.post("/logout", validate(authValidation.logout), authController.logout);

router
  .route("/google/login")
  .post(
    validate(authValidation.loginWithGoogle),
    authController.loginWithGoogle
  );
router
  .route("/facebook/login")
  .post(
    validate(authValidation.loginWithFacebook),
    authController.loginWithFacebook
  );
router.post(
  "/forgot-password",
  validate(authValidation.forgotPassword),
  authController.forgotPassword
);
router.post(
  "/reset-password",
  validate(authValidation.resetPassword),
  authController.resetPasswordviaSms
);
router.post(
  "/change-password",
  auth(),
  validate(authValidation.changePassword),
  authController.changePassword
);

module.exports = router;
